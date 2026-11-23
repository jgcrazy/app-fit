/* Ensign — preset do Tailwind (native). Gerado de tokens.json. Não edite. */
const plugin = require('tailwindcss/plugin');

const theme = {
  "extend": {
    "colors": {
      "surface": {
        "canvas": "#1B2340",
        "deep": "#12172B",
        "sunken": "#0C122B",
        "raised": "#263159",
        "raised-hover": "#313A59",
        "overlay": "#1B2340",
        "scrim": "#0C122BB3",
        "brand": "#1B2340",
        "brand-strong": "#12172B",
        "brand-hover": "#263159",
        "secondary": "#D8CBB0",
        "secondary-soft": "#D8CBB01F",
        "accent": "#FFCF14",
        "accent-hover": "#FFD758",
        "accent-soft": "#FFCF1424",
        "input": "#263159",
        "disabled": "#263159A6",
        "chart": "#12172B"
      },
      "content": {
        "primary": "#FFFFFF",
        "secondary": "#D8CBB0",
        "muted": "#B3A384",
        "disabled": "#818DAF",
        "inverse": "#1B2340",
        "accent": "#FFCF14",
        "on-accent": "#1B2340",
        "on-secondary": "#1B2340",
        "on-brand": "#FFFFFF",
        "link": "#7DD3FC",
        "link-hover": "#B9E6FE"
      },
      "border": {
        "subtle": "#FFFFFF14",
        "default": "#D8CBB038",
        "strong": "#D8CBB0",
        "focus": "#FFCF14",
        "focus-outline": "#12172B",
        "accent": "#FFCF14",
        "inverse": "#1B2340"
      },
      "action": {
        "primary-bg": "#FFCF14",
        "primary-bg-hover": "#FFD758",
        "primary-bg-active": "#DCB209",
        "primary-fg": "#1B2340",
        "secondary-bg": "#FFFFFF00",
        "secondary-bg-hover": "#D8CBB014",
        "secondary-fg": "#D8CBB0",
        "secondary-border": "#D8CBB0",
        "ghost-fg": "#D8CBB0",
        "ghost-bg-hover": "#FFFFFF0F",
        "danger-bg": "#D3252D",
        "danger-bg-hover": "#B91C22",
        "danger-fg": "#FFFFFF"
      },
      "feedback": {
        "success-fg": "#4ADE80",
        "success-bg": "#22C55E1F",
        "success-border": "#22C55E59",
        "error-fg": "#FF9A9A",
        "error-bg": "#EF44441F",
        "error-border": "#EF444459",
        "warning-fg": "#FFCF14",
        "warning-bg": "#FFCF141F",
        "warning-border": "#FFCF1459",
        "info-fg": "#7DD3FC",
        "info-bg": "#38BDF81F",
        "info-border": "#38BDF859"
      },
      "status": {
        "active-fg": "#4ADE80",
        "active-bg": "#22C55E1F",
        "pending-fg": "#FFCF14",
        "pending-bg": "#FFCF141F",
        "canceled-fg": "#FF9A9A",
        "canceled-bg": "#EF44441F",
        "neutral-fg": "#C3B597",
        "neutral-bg": "#D8CBB01F"
      },
      "chart": {
        "1": "#B29005",
        "2": "#6078D6",
        "3": "#05A7A7",
        "4": "#E5564A",
        "5": "#A54FC7",
        "6": "#2BB059",
        "grid": "#263159",
        "axis": "#495475",
        "seq-1": "#495475",
        "seq-2": "#646F91",
        "seq-3": "#818DAF",
        "seq-4": "#9EA8C7",
        "seq-5": "#BCC4DD",
        "seq-6": "#D5DBED",
        "diverge-mid": "#263159"
      }
    },
    "spacing": {
      "0": "0",
      "1": "4px",
      "2": "8px",
      "3": "12px",
      "4": "16px",
      "5": "20px",
      "6": "24px",
      "8": "32px",
      "10": "40px",
      "12": "48px",
      "16": "64px",
      "px": "1px",
      "touch": "44px",
      "control-sm": "32px",
      "control-md": "40px",
      "control-lg": "48px",
      "icon-sm": "16px",
      "icon-md": "20px",
      "icon-lg": "24px",
      "sidebar": "264px",
      "sidebar-collapsed": "72px",
      "content-max": "1280px",
      "stroke-icon": "1.75px"
    },
    "borderRadius": {
      "none": "0",
      "xs": "4px",
      "sm": "6px",
      "md": "8px",
      "lg": "12px",
      "xl": "16px",
      "2xl": "24px",
      "pill": "9999px",
      "card": "16px",
      "control": "12px",
      "button": "9999px"
    },
    "fontFamily": {
      "display": [
        "PlusJakartaSans_700Bold"
      ],
      "sans": [
        "Inter_400Regular"
      ],
      "mono": [
        "JetBrainsMono_400Regular"
      ]
    },
    "transitionDuration": {
      "instant": "0ms",
      "fast": "120ms",
      "base": "200ms",
      "slow": "320ms",
      "slower": "480ms"
    },
    "transitionTimingFunction": {
      "standard": "cubic-bezier(0.2,0,0,1)",
      "decelerate": "cubic-bezier(0,0,0,1)",
      "accelerate": "cubic-bezier(0.3,0,1,1)",
      "spring": "cubic-bezier(0.34,1.56,0.64,1)",
      "linear": "linear"
    },
    "zIndex": {
      "base": "0",
      "sticky": "10",
      "header": "20",
      "tabbar": "30",
      "dropdown": "40",
      "scrim": "50",
      "overlay": "60",
      "toast": "70"
    },
    "opacity": {
      "disabled": "0.45",
      "tab-inactive": "0.72",
      "scrim": "0.7",
      "press": "0.88"
    }
  }
};

const estilosDeTexto = {
  ".text-display-xl": {
    "fontFamily": "PlusJakartaSans_700Bold",
    "fontSize": "40px",
    "lineHeight": "44px",
    "letterSpacing": "-0.8px"
  },
  ".text-display-lg": {
    "fontFamily": "PlusJakartaSans_700Bold",
    "fontSize": "32px",
    "lineHeight": "38px",
    "letterSpacing": "-0.64px"
  },
  ".text-display-md": {
    "fontFamily": "PlusJakartaSans_700Bold",
    "fontSize": "28px",
    "lineHeight": "34px",
    "letterSpacing": "-0.28px"
  },
  ".text-h1": {
    "fontFamily": "PlusJakartaSans_700Bold",
    "fontSize": "24px",
    "lineHeight": "30px",
    "letterSpacing": "-0.24px"
  },
  ".text-h2": {
    "fontFamily": "PlusJakartaSans_700Bold",
    "fontSize": "20px",
    "lineHeight": "26px"
  },
  ".text-h3": {
    "fontFamily": "PlusJakartaSans_600SemiBold",
    "fontSize": "18px",
    "lineHeight": "24px"
  },
  ".text-h4": {
    "fontFamily": "PlusJakartaSans_600SemiBold",
    "fontSize": "16px",
    "lineHeight": "22px"
  },
  ".text-body-lg": {
    "fontFamily": "Inter_400Regular",
    "fontSize": "17px",
    "lineHeight": "26px"
  },
  ".text-body": {
    "fontFamily": "Inter_400Regular",
    "fontSize": "15px",
    "lineHeight": "22px"
  },
  ".text-body-sm": {
    "fontFamily": "Inter_400Regular",
    "fontSize": "13px",
    "lineHeight": "19px"
  },
  ".text-body-strong": {
    "fontFamily": "Inter_600SemiBold",
    "fontSize": "15px",
    "lineHeight": "22px"
  },
  ".text-label": {
    "fontFamily": "Inter_600SemiBold",
    "fontSize": "13px",
    "lineHeight": "16px"
  },
  ".text-label-sm": {
    "fontFamily": "Inter_600SemiBold",
    "fontSize": "12px",
    "lineHeight": "15px"
  },
  ".text-overline": {
    "fontFamily": "Inter_700Bold",
    "fontSize": "11px",
    "lineHeight": "14px",
    "letterSpacing": "0.88px",
    "textTransform": "uppercase"
  },
  ".text-metric-xl": {
    "fontFamily": "Inter_700Bold",
    "fontSize": "32px",
    "lineHeight": "36px",
    "letterSpacing": "-0.32px"
  },
  ".text-metric": {
    "fontFamily": "Inter_700Bold",
    "fontSize": "20px",
    "lineHeight": "24px"
  },
  ".text-numeric": {
    "fontFamily": "Inter_500Medium",
    "fontSize": "15px",
    "lineHeight": "20px",
    "fontVariantNumeric": "tabular-nums"
  },
  ".text-code": {
    "fontFamily": "JetBrainsMono_400Regular",
    "fontSize": "13px",
    "lineHeight": "20px"
  },
  ".text-code-sm": {
    "fontFamily": "JetBrainsMono_400Regular",
    "fontSize": "12px",
    "lineHeight": "18px"
  }
};

module.exports = {
  theme,
  plugins: [plugin(({ addUtilities }) => addUtilities(estilosDeTexto))],
};
