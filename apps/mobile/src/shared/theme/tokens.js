/**
 * Tokens do design system.
 *
 * PLACEHOLDER. Substituir pelos valores do design system do projeto --
 * este arquivo e o unico ponto de troca; nenhum componente deve ter cor,
 * espacamento ou tamanho de fonte literal.
 *
 * Dark mode e requisito, nao enfeite: academia e ambiente escuro e o celular
 * fica na mao suada. Todo token de cor precisa de par claro/escuro.
 */
module.exports = {
  colors: {
    bg: { DEFAULT: '#0B0F14', elevated: '#141A21', light: '#FFFFFF' },
    fg: { DEFAULT: '#E6EDF3', muted: '#8B98A5', light: '#0B0F14' },
    brand: { DEFAULT: '#208AEF', strong: '#1668C4' },
    success: '#2EA043',
    warning: '#D29922',
    danger: '#F85149',
    border: '#222B34',
  },
  spacing: {
    // Escala de 4pt. Nada fora dela.
    1: '4px', 2: '8px', 3: '12px', 4: '16px',
    5: '20px', 6: '24px', 8: '32px', 10: '40px', 12: '48px',
  },
  radius: { sm: '6px', md: '10px', lg: '16px', pill: '999px' },
  fontSize: {
    xs: '12px', sm: '14px', base: '16px',
    lg: '20px', xl: '24px', '2xl': '32px', '3xl': '40px',
  },
};
