import { MenuView } from '@expo/ui/community/menu';
import { Picker } from '@expo/ui/community/picker';
import { useState, type ComponentProps } from 'react';
import { Platform, Text, TextInput, View } from 'react-native';

import { px } from '@/shared/theme/layout';
import { cor, escalas, textoEstilos } from '@/shared/theme/tokens';

import { Icon } from './Icon';
import { AnelDeFoco } from './interacao';

/**
 * Field do Ensign, em React Native: input, textarea e select com rótulo acima,
 * ajuda, erro e borda border-strong.
 * Especificação: artifact Ensign, project/components/Field/README.md.
 *
 * O componente não valida nada: quem usa passa o erro (já em pt-BR, dizendo o
 * próximo passo), o teclado certo e a máscara quando o campo pede.
 *
 * Select: no iOS e no Android o campo tem o visual do Ensign e abre o menu
 * nativo do sistema (@expo/ui MenuView). Na web, onde o MenuView não dispara
 * ações, vira o <select> nativo (@expo/ui Picker).
 */
export type OpcaoField = { value: string; label: string };

type PropsTexto = Pick<
  ComponentProps<typeof TextInput>,
  'value' | 'defaultValue' | 'onChangeText' | 'keyboardType' | 'inputMode' | 'autoComplete' | 'secureTextEntry' | 'onBlur'
>;

export type FieldProps = PropsTexto & {
  as?: 'input' | 'textarea' | 'select';
  /** Sempre acima do campo. Placeholder não substitui rótulo. */
  label: string;
  /** Mensagem de erro: pinta a borda e substitui a ajuda. */
  error?: string;
  /** Texto de ajuda. Some enquanto houver erro, para não serem anunciados os dois. */
  help?: string;
  placeholder?: string;
  /** Escreve "(obrigatório)" em texto ao lado do rótulo. */
  required?: boolean;
  disabled?: boolean;
  /** textarea: linhas visíveis. Padrão 4. */
  rows?: number;
  /** select */
  options?: OpcaoField[];
  onValueChange?: (value: string) => void;
};

const ALTURA = px(escalas.size['size-control-lg']); // 48px no app
const LINHA = textoEstilos.body.lineHeight; // 22px
const PADDING_VERTICAL_TEXTAREA = px(escalas.spacing['space-3']);

export function Field({
  as = 'input',
  label,
  error,
  help,
  placeholder,
  required = false,
  disabled = false,
  rows = 4,
  options = [],
  onValueChange,
  value,
  ...propsTexto
}: FieldProps) {
  const [focado, setFocado] = useState(false);
  const mensagem = error ?? help;

  const caixa = [
    'rounded-control border',
    error ? 'border-feedback-error-border' : 'border-border-strong',
    disabled ? 'bg-surface-disabled' : 'bg-surface-input',
  ].join(' ');

  return (
    <View className="gap-2">
      <Text className="text-label text-content-secondary">
        {label}
        {required ? <Text className="text-label text-content-secondary"> (obrigatório)</Text> : null}
      </Text>

      <View>
        <View className={caixa}>
          {as === 'select' ? (
            <CampoSelect
              label={label}
              value={value}
              placeholder={placeholder}
              options={options}
              disabled={disabled}
              onValueChange={onValueChange}
              mensagem={mensagem}
            />
          ) : (
            <TextInput
              {...propsTexto}
              value={value}
              accessibilityLabel={label}
              accessibilityHint={mensagem}
              aria-invalid={Boolean(error)}
              aria-required={required}
              editable={!disabled}
              placeholder={placeholder}
              placeholderTextColor={cor['content-muted']}
              multiline={as === 'textarea'}
              textAlignVertical={as === 'textarea' ? 'top' : 'center'}
              onFocus={() => setFocado(true)}
              onBlur={(e) => {
                setFocado(false);
                propsTexto.onBlur?.(e);
              }}
              className={`px-4 text-body ${disabled ? 'text-content-disabled' : 'text-content-primary'}`}
              style={
                as === 'textarea'
                  ? { minHeight: rows * LINHA + 2 * PADDING_VERTICAL_TEXTAREA, paddingVertical: PADDING_VERTICAL_TEXTAREA }
                  : { height: ALTURA }
              }
            />
          )}
        </View>
        {focado ? <AnelDeFoco raio="control" /> : null}
      </View>

      {error ? (
        <Text accessibilityRole="alert" accessibilityLiveRegion="polite" className="text-body-sm text-feedback-error-fg">
          {error}
        </Text>
      ) : help ? (
        <Text className="text-body-sm text-content-muted">{help}</Text>
      ) : null}
    </View>
  );
}

type CampoSelectProps = {
  label: string;
  value?: string;
  placeholder?: string;
  options: OpcaoField[];
  disabled: boolean;
  onValueChange?: (value: string) => void;
  mensagem?: string;
};

/** Só web: o Picker repassa este estilo direto ao <select>, que aceita cor e fonte. */
const estiloSelectWeb = (disabled: boolean) => {
  const estilo = {
    height: ALTURA,
    paddingHorizontal: px(escalas.spacing['space-4']),
    backgroundColor: 'transparent',
    borderWidth: 0,
    color: cor[disabled ? 'content-disabled' : 'content-primary'],
    fontFamily: textoEstilos.body.fontFamily,
    fontSize: textoEstilos.body.fontSize,
  };
  return estilo;
};

function CampoSelect({ label, value, placeholder, options, disabled, onValueChange, mensagem }: CampoSelectProps) {
  const selecionada = options.find((o) => o.value === value);

  if (Platform.OS === 'web') {
    return (
      <Picker
        selectedValue={value ?? ''}
        enabled={!disabled}
        onValueChange={(v) => onValueChange?.(String(v))}
        style={estiloSelectWeb(disabled)}>
        {placeholder ? <Picker.Item label={placeholder} value="" enabled={false} /> : null}
        {options.map((o) => (
          <Picker.Item key={o.value} label={o.label} value={o.value} />
        ))}
      </Picker>
    );
  }

  const gatilho = (
    <View
      accessible
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityValue={{ text: selecionada?.label ?? placeholder ?? '' }}
      accessibilityHint={mensagem}
      accessibilityState={{ disabled }}
      className="flex-row items-center justify-between gap-2 px-4"
      style={{ height: ALTURA }}>
      <Text
        numberOfLines={1}
        className={`shrink text-body ${
          disabled ? 'text-content-disabled' : selecionada ? 'text-content-primary' : 'text-content-muted'
        }`}>
        {selecionada?.label ?? placeholder ?? ''}
      </Text>
      <Icon name="chevron-down" size={px(escalas.size['size-icon-md'])} cor="content-secondary" />
    </View>
  );

  if (disabled) return gatilho;

  return (
    <MenuView
      title={label}
      actions={options.map((o) => ({ id: o.value, title: o.label, state: o.value === value ? 'on' : 'off' }))}
      onPressAction={({ nativeEvent }) => onValueChange?.(nativeEvent.event)}>
      {gatilho}
    </MenuView>
  );
}
