/* @ds-bundle: {"format":4,"namespace":"Ensign","components":[{"name":"Button"},{"name":"Field"},{"name":"Badge"},{"name":"KPICard"},{"name":"ListCard"},{"name":"FeatureCard"},{"name":"DataTable"},{"name":"Toast"},{"name":"BottomTabBar"},{"name":"Sidebar"},{"name":"AppHeader"}]} */
/* Ensign — bundle de componentes. Script clássico; usa window.React.
   Nenhum hex: toda cor vem das custom properties em bundle.css / tokens.css. */
(function (global) {
  'use strict';
  var React = global.React;
  if (!React) { global.Ensign = {}; return; }
  var h = React.createElement;

  function cx() {
    var out = [];
    for (var i = 0; i < arguments.length; i++) if (arguments[i]) out.push(arguments[i]);
    return out.join(' ');
  }
  function omit(obj, chaves) {
    var out = {}, k;
    for (k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && chaves.indexOf(k) < 0) out[k] = obj[k];
    return out;
  }

  /* ───────────────────────────────────────────────────────────── Icon
     Traço de 1.75px, herda currentColor. Formas geométricas simples;
     em produção use Lucide com o mesmo traço. */
  var TRACOS = {
    'arrow-up':     'M12 19V5M5 12l7-7 7 7',
    'arrow-down':   'M12 5v14M19 12l-7 7-7-7',
    'minus':        'M5 12h14',
    'plus':         'M12 5v14M5 12h14',
    'check':        'M4 12.5l5 5L20 6.5',
    'x':            'M6 6l12 12M18 6L6 18',
    'alert':        'M12 4l9 16H3zM12 10v4M12 17v.01',
    'info':         'M12 11v6M12 7.5v.01',
    'search':       'M20 20l-4.2-4.2M17 10.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z',
    'bell':         'M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6zM10 19a2 2 0 0 0 4 0',
    'chevron-left': 'M14 6l-6 6 6 6',
    'chevron-down': 'M6 10l6 6 6-6',
    'package':      'M3 8l9-4 9 4v8l-9 4-9-4zM3 8l9 4 9-4M12 12v8',
    'home':         'M4 11l8-7 8 7v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z',
    'user':         'M5 20v-1a5 5 0 0 1 14 0v1M12 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z',
    'chart':        'M4 20V10M10 20V4M16 20v-7M22 20H3',
    'list':         'M8 7h12M8 12h12M8 17h12M4 7v.01M4 12v.01M4 17v.01',
    'dots':         'M12 6v.01M12 12v.01M12 18v.01',
  };

  function Icon(props) {
    var p = props || {};
    var tam = p.size || 20;
    var decorativo = !p.label;
    return h('svg', {
      className: p.className,
      width: tam, height: tam, viewBox: '0 0 24 24',
      fill: 'none', stroke: 'currentColor',
      strokeWidth: tam >= 24 ? 2 : 1.75,
      strokeLinecap: 'round', strokeLinejoin: 'round',
      'aria-hidden': decorativo ? 'true' : undefined,
      role: decorativo ? undefined : 'img',
      'aria-label': p.label,
      style: { flex: '0 0 auto' },
    }, h('path', { d: TRACOS[p.name] || TRACOS.minus }));
  }

  /* ─────────────────────────────────────────────────────────── Button */
  function Button(props) {
    var p = props || {};
    var variante = p.variant || 'primary';
    var tamanho = p.size || 'md';
    var carregando = !!p.loading;
    var resto = omit(p, ['variant', 'size', 'loading', 'icon', 'className', 'children']);
    return h('button', Object.assign({
      type: p.type || 'button',
      className: cx('ens-btn', 'ens-btn--' + variante, 'ens-btn--' + tamanho, 'ens-focusable', p.className),
      disabled: p.disabled || carregando,
      'aria-busy': carregando ? 'true' : undefined,
    }, resto),
      carregando
        ? [h('span', { key: 's', className: 'ens-btn__spinner' }),
           h('span', { key: 'v', style: { visibility: 'hidden' } }, p.children)]
        : [p.icon ? h(Icon, { key: 'i', name: p.icon, size: tamanho === 'sm' ? 16 : 20 }) : null,
           h('span', { key: 't' }, p.children)]
    );
  }

  function IconButton(props) {
    var p = props || {};
    var resto = omit(p, ['name', 'label', 'className', 'size']);
    return h('button', Object.assign({
      type: 'button',
      className: cx('ens-iconbtn', 'ens-focusable', p.className),
      'aria-label': p.label,
    }, resto), h(Icon, { name: p.name, size: p.size || 20 }));
  }

  /* ──────────────────────────────────────────────────────────── Field */
  var proxId = 0;
  function Field(props) {
    var p = props || {};
    var tipo = p.as || 'input';
    var id = p.id || 'ens-f-' + (++proxId);
    var idAjuda = id + '-ajuda';
    var idErro = id + '-erro';
    var descrito = [p.error ? idErro : null, p.help ? idAjuda : null].filter(Boolean).join(' ');
    var comuns = {
      id: id,
      className: cx('ens-field__control', 'ens-focusable', p.error && 'ens-field__control--error'),
      placeholder: p.placeholder,
      disabled: p.disabled,
      defaultValue: p.defaultValue,
      required: p.required,
      'aria-invalid': p.error ? 'true' : undefined,
      'aria-describedby': descrito || undefined,
    };
    var controle;
    if (tipo === 'select') {
      controle = h('select', comuns, (p.options || []).map(function (o, i) {
        return h('option', { key: i, value: o.value }, o.label);
      }));
    } else if (tipo === 'textarea') {
      controle = h('textarea', Object.assign({ rows: p.rows || 4 }, comuns));
    } else {
      controle = h('input', Object.assign({ type: p.type || 'text', inputMode: p.inputMode }, comuns));
    }
    return h('div', { className: cx('ens-field', p.className) },
      p.label ? h('label', { key: 'l', className: 'ens-field__label', htmlFor: id },
        p.label,
        p.required ? h('span', { className: 'ens-field__req' }, ' (obrigatório)') : null) : null,
      controle,
      p.error ? h('p', { key: 'e', id: idErro, className: 'ens-field__error' }, p.error) : null,
      !p.error && p.help ? h('p', { key: 'h', id: idAjuda, className: 'ens-field__help' }, p.help) : null
    );
  }

  /* ──────────────────────────────────────────────────────────── Badge */
  var ROTULO_STATUS = { active: 'Ativo', pending: 'Pendente', canceled: 'Cancelado', neutral: 'Rascunho' };
  function Badge(props) {
    var p = props || {};
    var tom = p.tone || 'neutral';
    return h('span', { className: cx('ens-badge', 'ens-badge--' + tom, p.className) },
      p.dot === false ? null : h('span', { className: 'ens-badge__dot' }),
      p.children || ROTULO_STATUS[tom]
    );
  }

  /* ──────────────────────────────────────────────────────────── Cards */
  function Card(props) {
    var p = props || {};
    return h('div', { className: cx('ens-card', p.flat && 'ens-card--flat', p.className) }, p.children);
  }

  function KPICard(props) {
    var p = props || {};
    var d = typeof p.delta === 'number' ? p.delta : null;
    var dir = d === null ? 'flat' : (d > 0 ? 'up' : (d < 0 ? 'down' : 'flat'));
    var icone = dir === 'up' ? 'arrow-up' : (dir === 'down' ? 'arrow-down' : 'minus');
    var fmt = d === null ? null
      : (d > 0 ? '+' : '') + d.toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + '%';
    return h('div', { className: cx('ens-card', p.className) },
      h('div', { className: 'ens-kpi__head' },
        h('p', { className: 'ens-kpi__label' }, p.label),
        p.icon ? h('span', { className: 'ens-kpi__badge' }, h(Icon, { name: p.icon, size: 20 })) : null
      ),
      h('p', { className: 'ens-kpi__value' }, p.value),
      d === null ? null : h('p', { className: 'ens-kpi__delta ens-kpi__delta--' + dir },
        h(Icon, { name: icone, size: 16 }),
        fmt,
        h('span', null, p.deltaLabel || 'vs. período anterior')
      )
    );
  }

  function ListCard(props) {
    var p = props || {};
    return h('div', { className: cx('ens-listcard', p.className) },
      h('div', { className: 'ens-listcard__body' },
        h('p', { className: 'ens-listcard__title' }, p.title),
        p.meta ? h('p', { className: 'ens-listcard__meta' }, p.meta) : null
      ),
      p.status ? h(Badge, { tone: p.status }, p.statusLabel) : null,
      p.value ? h('span', { className: 'ens-listcard__value' }, p.value) : null
    );
  }

  function FeatureCard(props) {
    var p = props || {};
    return h('div', { className: cx('ens-feature', p.className) },
      h('p', { className: 'ens-feature__title' }, p.title),
      p.body ? h('p', { className: 'ens-feature__body' }, p.body) : null,
      p.cta ? h(Button, { variant: 'primary', size: 'md' }, p.cta) : null
    );
  }

  /* ──────────────────────────────────────────────────────── DataTable */
  function DataTable(props) {
    var p = props || {};
    var colunas = p.columns || [];
    var linhas = p.rows || [];
    return h('div', { className: cx('ens-table-wrap', p.className) },
      h('table', { className: 'ens-table' },
        h('thead', null, h('tr', null, colunas.map(function (c, i) {
          return h('th', {
            key: i,
            className: c.numeric ? 'ens-num' : undefined,
            scope: 'col',
            'aria-sort': c.sort ? (c.sort === 'asc' ? 'ascending' : 'descending') : undefined,
          }, c.sortable
            ? h('button', { type: 'button', className: 'ens-table__sort ens-focusable' },
                c.label, h(Icon, { name: 'chevron-down', size: 14 }))
            : c.label);
        }))),
        h('tbody', null, linhas.map(function (r, ri) {
          return h('tr', { key: ri }, colunas.map(function (c, ci) {
            var v = r[c.key];
            var conteudo = c.key === 'status'
              ? h(Badge, { tone: v, dot: false })
              : (c.key === 'acoes'
                  ? h(IconButton, { name: 'dots', label: 'Ações da linha' })
                  : v);
            return h('td', { key: ci, className: c.numeric ? 'ens-num' : undefined }, conteudo);
          }));
        }))
      ),
      p.footer === false ? null : h('div', { className: 'ens-table__foot' },
        h('span', null, p.range || ('1–' + linhas.length + ' de ' + linhas.length)),
        h('div', { className: 'ens-row', style: { gap: 'var(--space-2)' } },
          h(Button, { variant: 'secondary', size: 'sm', disabled: true }, 'Anterior'),
          h(Button, { variant: 'secondary', size: 'sm' }, 'Próxima')
        )
      )
    );
  }

  /* ──────────────────────────────────────────────────────────── Toast */
  var ICONE_TOM = { success: 'check', error: 'x', warning: 'alert', info: 'info' };
  function Toast(props) {
    var p = props || {};
    var tom = p.tone || 'info';
    return h('div', {
      className: cx('ens-toast', 'ens-toast--' + tom, p.className),
      role: tom === 'error' ? 'alert' : 'status',
    },
      h('span', { className: 'ens-toast__icon' }, h(Icon, { name: ICONE_TOM[tom], size: 20 })),
      h('div', { style: { flex: '1 1 auto', minWidth: 0 } },
        h('p', { className: 'ens-toast__title' }, p.title),
        p.children ? h('p', { className: 'ens-toast__body' }, p.children) : null
      ),
      h(IconButton, { name: 'x', label: 'Fechar', size: 16 })
    );
  }

  /* ───────────────────────────────────────────────── navegação do app */
  function BottomTabBar(props) {
    var p = props || {};
    var itens = p.items || [];
    var ativo = p.active || (itens[0] && itens[0].key);
    return h('nav', { className: cx('ens-tabbar', p.className), 'aria-label': 'Navegação principal' },
      itens.map(function (it) {
        var sel = it.key === ativo;
        return h('button', {
          key: it.key, type: 'button',
          className: cx('ens-tab', sel && 'ens-tab--active', 'ens-focusable'),
          'aria-current': sel ? 'page' : undefined,
        },
          sel ? h('span', { className: 'ens-tab__ind' }) : null,
          h(Icon, { name: it.icon, size: 24 }),
          h('span', null, it.label)
        );
      })
    );
  }

  function AppHeader(props) {
    var p = props || {};
    return h('header', { className: cx('ens-appheader', p.className) },
      p.onBack !== false && p.back ? h(IconButton, { name: 'chevron-left', label: 'Voltar' }) : null,
      h('div', { className: 'ens-appheader__body' },
        p.greeting ? h('p', { className: 'ens-appheader__greet' }, p.greeting) : null,
        h('p', { className: 'ens-appheader__title' }, p.title)
      ),
      p.action === false ? null : h(IconButton, { name: 'bell', label: 'Notificações' })
    );
  }

  /* ─────────────────────────────────────────────── navegação do admin */
  function Sidebar(props) {
    var p = props || {};
    var itens = p.items || [];
    var ativo = p.active || (itens[0] && itens[0].key);
    return h('nav', { className: cx('ens-sidebar', p.className), 'aria-label': 'Navegação do painel' },
      itens.map(function (it) {
        var sel = it.key === ativo;
        return h('a', {
          key: it.key, href: it.href || '#',
          className: cx('ens-navitem', sel && 'ens-navitem--active', 'ens-focusable'),
          'aria-current': sel ? 'page' : undefined,
        },
          sel ? h('span', { className: 'ens-navitem__bar', 'aria-hidden': 'true' }) : null,
          h(Icon, { name: it.icon, size: 20 }),
          h('span', { className: 'ens-navitem__label' }, it.label)
        );
      })
    );
  }

  global.Ensign = {
    Icon: Icon,
    Button: Button,
    IconButton: IconButton,
    Field: Field,
    Badge: Badge,
    Card: Card,
    KPICard: KPICard,
    ListCard: ListCard,
    FeatureCard: FeatureCard,
    DataTable: DataTable,
    Toast: Toast,
    BottomTabBar: BottomTabBar,
    AppHeader: AppHeader,
    Sidebar: Sidebar,
  };
})(typeof window !== 'undefined' ? window : this);
