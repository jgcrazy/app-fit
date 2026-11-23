import * as Crypto from 'expo-crypto';
import * as SQLite from 'expo-sqlite';

import { api, ApiError } from '../api/client';

/**
 * Fila de sincronização offline.
 *
 * Academia tem sinal ruim, e a tela de execução de treino é o momento de maior
 * valor do app. Toda escrita é gravada localmente primeiro e enviada depois.
 *
 * Cada operação carrega um `client_uuid` gerado AQUI, antes do envio. O servidor
 * faz upsert por (user_id, client_uuid), então reenvio é seguro por construção.
 * Sem isso, o retry da fila duplica série e o gráfico de carga passa a mentir.
 *
 * Ver docs/adr/0002-offline-first-e-idempotencia.md
 */

export type QueuedOperation = {
  id: number;
  client_uuid: string;
  endpoint: string;
  method: 'POST' | 'PUT' | 'PATCH';
  payload: string;
  attempts: number;
  created_at: string;
};

let db: SQLite.SQLiteDatabase | null = null;

export async function openDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;

  // TODO: trocar por banco criptografado (SQLCipher) antes de guardar dado de
  // saúde em produção. Ver docs/arquitetura.md, seção Segurança.
  db = await SQLite.openDatabaseAsync('appfit.db');

  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS sync_queue (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      client_uuid TEXT NOT NULL UNIQUE,
      endpoint    TEXT NOT NULL,
      method      TEXT NOT NULL,
      payload     TEXT NOT NULL,
      attempts    INTEGER NOT NULL DEFAULT 0,
      last_error  TEXT,
      created_at  TEXT NOT NULL
    );
  `);

  return db;
}

/** Enfileira uma escrita e devolve o client_uuid usado. */
export async function enqueue(
  endpoint: string,
  payload: Record<string, unknown>,
  method: QueuedOperation['method'] = 'POST',
): Promise<string> {
  const database = await openDatabase();
  const clientUuid = Crypto.randomUUID();

  await database.runAsync(
    `INSERT INTO sync_queue (client_uuid, endpoint, method, payload, created_at)
     VALUES (?, ?, ?, ?, ?)`,
    clientUuid,
    endpoint,
    method,
    JSON.stringify({ ...payload, client_uuid: clientUuid }),
    new Date().toISOString(),
  );

  return clientUuid;
}

/**
 * Drena a fila em ordem de criação.
 *
 * 4xx (exceto 408/429) é erro de contrato: reenviar não resolve, então a
 * operação sai da fila e é reportada. 5xx e falha de rede ficam para a próxima
 * tentativa — a fila não se esvazia por desistência silenciosa.
 */
export async function flush(): Promise<{ sent: number; failed: number; pending: number }> {
  const database = await openDatabase();
  const rows = await database.getAllAsync<QueuedOperation>(
    'SELECT * FROM sync_queue ORDER BY id ASC LIMIT 50',
  );

  let sent = 0;
  let failed = 0;

  for (const row of rows) {
    try {
      await api(row.endpoint, { method: row.method, body: row.payload });
      await database.runAsync('DELETE FROM sync_queue WHERE id = ?', row.id);
      sent++;
    } catch (error) {
      const isContractError =
        error instanceof ApiError &&
        error.status >= 400 &&
        error.status < 500 &&
        error.status !== 408 &&
        error.status !== 429;

      if (isContractError) {
        await database.runAsync('DELETE FROM sync_queue WHERE id = ?', row.id);
        failed++;
        continue;
      }

      await database.runAsync(
        'UPDATE sync_queue SET attempts = attempts + 1, last_error = ? WHERE id = ?',
        String(error),
        row.id,
      );
      break; // preserva a ordem: não pula operação pendente
    }
  }

  const pending = await database.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM sync_queue',
  );

  return { sent, failed, pending: pending?.count ?? 0 };
}
