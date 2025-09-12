// Modular Color System
// This file allows you to change colors for specific UI elements across the entire app

export interface ColorSet {
  h: number;
  s: string;
  l: string;
  hex: string;
  gradientFrom?: string;
  gradientTo?: string;
  hoverHex?: string;
  hoverFrom?: string;
  hoverTo?: string;
}

export interface ModularColorTheme {
  titles: ColorSet;
  charts: ColorSet;
  buttons: ColorSet;
  links: ColorSet;
  icons: ColorSet;
  borders: ColorSet;
  tooltips: ColorSet;
}

// Default mint green theme
export const defaultTheme: ModularColorTheme = {
  titles: {
    h: 160,
    s: '60%',
    l: '55%',
    hex: '#3DDC97',
    gradientFrom: '#6EE7B7',
    gradientTo: '#059669'
  },
  charts: {
    h: 160,
    s: '60%',
    l: '55%',
    hex: '#3DDC97',
    gradientFrom: '#3DDC97',
    gradientTo: '#059669'
  },
  buttons: {
    h: 160,
    s: '60%',
    l: '55%',
    hex: '#3DDC97',
    gradientFrom: '#3DDC97',
    gradientTo: '#059669',
    hoverFrom: '#059669',
    hoverTo: '#047857'
  },
  links: {
    h: 160,
    s: '60%',
    l: '55%',
    hex: '#3DDC97',
    hoverHex: '#6EE7B7'
  },
  icons: {
    h: 160,
    s: '60%',
    l: '55%',
    hex: '#3DDC97'
  },
  borders: {
    h: 160,
    s: '60%',
    l: '55%',
    hex: '#3DDC97'
  },
  tooltips: {
    h: 160,
    s: '60%',
    l: '55%',
    hex: '#3DDC97',
    gradientFrom: '#3DDC97',
    gradientTo: '#059669'
  }
};

// Alternative themes
export const colorThemes: Record<string, ModularColorTheme> = {
  mintgreen: defaultTheme,
  
  royalblue: {
    titles: {
      h: 225,
      s: '73%',
      l: '57%',
      hex: '#4169E1',
      gradientFrom: '#6495ED',
      gradientTo: '#1E3A8A'
    },
    charts: {
      h: 225,
      s: '73%',
      l: '57%',
      hex: '#4169E1',
      gradientFrom: '#4169E1',
      gradientTo: '#1E3A8A'
    },
    buttons: {
      h: 225,
      s: '73%',
      l: '57%',
      hex: '#4169E1',
      gradientFrom: '#4169E1',
      gradientTo: '#1E3A8A',
      hoverFrom: '#1E3A8A',
      hoverTo: '#1E40AF'
    },
    links: {
      h: 225,
      s: '73%',
      l: '57%',
      hex: '#4169E1',
      hoverHex: '#6495ED'
    },
    icons: {
      h: 225,
      s: '73%',
      l: '57%',
      hex: '#4169E1'
    },
    borders: {
      h: 225,
      s: '73%',
      l: '57%',
      hex: '#4169E1'
    },
    tooltips: {
      h: 225,
      s: '73%',
      l: '57%',
      hex: '#4169E1',
      gradientFrom: '#4169E1',
      gradientTo: '#1E3A8A'
    }
  },

  hotpink: {
    titles: {
      h: 325,
      s: '100%',
      l: '59%',
      hex: '#FF2D95',
      gradientFrom: '#FF69B4',
      gradientTo: '#E91E63'
    },
    charts: {
      h: 325,
      s: '100%',
      l: '59%',
      hex: '#FF2D95',
      gradientFrom: '#FF2D95',
      gradientTo: '#E91E63'
    },
    buttons: {
      h: 325,
      s: '100%',
      l: '59%',
      hex: '#FF2D95',
      gradientFrom: '#FF2D95',
      gradientTo: '#E91E63',
      hoverFrom: '#E91E63',
      hoverTo: '#C2185B'
    },
    links: {
      h: 325,
      s: '100%',
      l: '59%',
      hex: '#FF2D95',
      hoverHex: '#FF69B4'
    },
    icons: {
      h: 325,
      s: '100%',
      l: '59%',
      hex: '#FF2D95'
    },
    borders: {
      h: 325,
      s: '100%',
      l: '59%',
      hex: '#FF2D95'
    },
    tooltips: {
      h: 325,
      s: '100%',
      l: '59%',
      hex: '#FF2D95',
      gradientFrom: '#FF2D95',
      gradientTo: '#E91E63'
    }
  },

  lime: {
    titles: {
      h: 120,
      s: '61%',
      l: '50%',
      hex: '#32CD32',
      gradientFrom: '#90EE90',
      gradientTo: '#228B22'
    },
    charts: {
      h: 120,
      s: '61%',
      l: '50%',
      hex: '#32CD32',
      gradientFrom: '#32CD32',
      gradientTo: '#228B22'
    },
    buttons: {
      h: 120,
      s: '61%',
      l: '50%',
      hex: '#32CD32',
      gradientFrom: '#32CD32',
      gradientTo: '#228B22',
      hoverFrom: '#228B22',
      hoverTo: '#1B5E20'
    },
    links: {
      h: 120,
      s: '61%',
      l: '50%',
      hex: '#32CD32',
      hoverHex: '#90EE90'
    },
    icons: {
      h: 120,
      s: '61%',
      l: '50%',
      hex: '#32CD32'
    },
    borders: {
      h: 120,
      s: '61%',
      l: '50%',
      hex: '#32CD32'
    },
    tooltips: {
      h: 120,
      s: '61%',
      l: '50%',
      hex: '#32CD32',
      gradientFrom: '#32CD32',
      gradientTo: '#228B22'
    }
  },

  blue: {
    titles: {
      h: 210,
      s: '100%',
      l: '50%',
      hex: '#0066FF',
      gradientFrom: '#3399FF',
      gradientTo: '#0052CC'
    },
    charts: {
      h: 210,
      s: '100%',
      l: '50%',
      hex: '#0066FF',
      gradientFrom: '#0066FF',
      gradientTo: '#0052CC'
    },
    buttons: {
      h: 210,
      s: '100%',
      l: '50%',
      hex: '#0066FF',
      gradientFrom: '#0066FF',
      gradientTo: '#0052CC',
      hoverFrom: '#0052CC',
      hoverTo: '#003D99'
    },
    links: {
      h: 210,
      s: '100%',
      l: '50%',
      hex: '#0066FF',
      hoverHex: '#3399FF'
    },
    icons: {
      h: 210,
      s: '100%',
      l: '50%',
      hex: '#0066FF'
    },
    borders: {
      h: 210,
      s: '100%',
      l: '50%',
      hex: '#0066FF'
    },
    tooltips: {
      h: 210,
      s: '100%',
      l: '50%',
      hex: '#0066FF',
      gradientFrom: '#0066FF',
      gradientTo: '#0052CC'
    }
  },

  purple: {
    titles: {
      h: 270,
      s: '100%',
      l: '50%',
      hex: '#8000FF',
      gradientFrom: '#B366FF',
      gradientTo: '#6600CC'
    },
    charts: {
      h: 270,
      s: '100%',
      l: '50%',
      hex: '#8000FF',
      gradientFrom: '#8000FF',
      gradientTo: '#6600CC'
    },
    buttons: {
      h: 270,
      s: '100%',
      l: '50%',
      hex: '#8000FF',
      gradientFrom: '#8000FF',
      gradientTo: '#6600CC',
      hoverFrom: '#6600CC',
      hoverTo: '#4D0099'
    },
    links: {
      h: 270,
      s: '100%',
      l: '50%',
      hex: '#8000FF',
      hoverHex: '#B366FF'
    },
    icons: {
      h: 270,
      s: '100%',
      l: '50%',
      hex: '#8000FF'
    },
    borders: {
      h: 270,
      s: '100%',
      l: '50%',
      hex: '#8000FF'
    },
    tooltips: {
      h: 270,
      s: '100%',
      l: '50%',
      hex: '#8000FF',
      gradientFrom: '#8000FF',
      gradientTo: '#6600CC'
    }
  }
};

// Function to apply a modular color theme
export function applyModularColorTheme(theme: ModularColorTheme) {
  const root = document.documentElement;
  
  // Apply title colors
  root.style.setProperty('--title-primary-h', theme.titles.h.toString());
  root.style.setProperty('--title-primary-s', theme.titles.s);
  root.style.setProperty('--title-primary-l', theme.titles.l);
  root.style.setProperty('--title-primary-hex', theme.titles.hex);
  root.style.setProperty('--title-gradient-from', theme.titles.gradientFrom || theme.titles.hex);
  root.style.setProperty('--title-gradient-to', theme.titles.gradientTo || theme.titles.hex);
  
  // Apply chart colors
  root.style.setProperty('--chart-primary-h', theme.charts.h.toString());
  root.style.setProperty('--chart-primary-s', theme.charts.s);
  root.style.setProperty('--chart-primary-l', theme.charts.l);
  root.style.setProperty('--chart-primary-hex', theme.charts.hex);
  root.style.setProperty('--chart-darker-hex', theme.charts.gradientTo || theme.charts.hex);
  root.style.setProperty('--chart-lighter-hex', theme.charts.gradientFrom || theme.charts.hex);
  
  // Apply button colors
  root.style.setProperty('--button-primary-h', theme.buttons.h.toString());
  root.style.setProperty('--button-primary-s', theme.buttons.s);
  root.style.setProperty('--button-primary-l', theme.buttons.l);
  root.style.setProperty('--button-primary-hex', theme.buttons.hex);
  root.style.setProperty('--button-gradient-from', theme.buttons.gradientFrom || theme.buttons.hex);
  root.style.setProperty('--button-gradient-to', theme.buttons.gradientTo || theme.buttons.hex);
  root.style.setProperty('--button-hover-from', theme.buttons.hoverFrom || theme.buttons.hex);
  root.style.setProperty('--button-hover-to', theme.buttons.hoverTo || theme.buttons.hex);
  
  // Apply link colors
  root.style.setProperty('--link-primary-h', theme.links.h.toString());
  root.style.setProperty('--link-primary-s', theme.links.s);
  root.style.setProperty('--link-primary-l', theme.links.l);
  root.style.setProperty('--link-primary-hex', theme.links.hex);
  root.style.setProperty('--link-hover-hex', theme.links.hoverHex || theme.links.hex);
  
  // Apply icon colors
  root.style.setProperty('--icon-primary-h', theme.icons.h.toString());
  root.style.setProperty('--icon-primary-s', theme.icons.s);
  root.style.setProperty('--icon-primary-l', theme.icons.l);
  root.style.setProperty('--icon-primary-hex', theme.icons.hex);
  
  // Apply border colors
  root.style.setProperty('--border-primary-h', theme.borders.h.toString());
  root.style.setProperty('--border-primary-s', theme.borders.s);
  root.style.setProperty('--border-primary-l', theme.borders.l);
  root.style.setProperty('--border-primary-hex', theme.borders.hex);
  
  // Apply tooltip colors
  root.style.setProperty('--tooltip-primary-h', theme.tooltips.h.toString());
  root.style.setProperty('--tooltip-primary-s', theme.tooltips.s);
  root.style.setProperty('--tooltip-primary-l', theme.tooltips.l);
  root.style.setProperty('--tooltip-primary-hex', theme.tooltips.hex);
  root.style.setProperty('--tooltip-gradient-from', theme.tooltips.gradientFrom || theme.tooltips.hex);
  root.style.setProperty('--tooltip-gradient-to', theme.tooltips.gradientTo || theme.tooltips.hex);
}

// Function to apply a preset theme by name
export function applyPresetTheme(themeName: string) {
  const theme = colorThemes[themeName];
  if (theme) {
    applyModularColorTheme(theme);
    localStorage.setItem('modular-color-theme', themeName);
  }
}

// Function to get current theme from localStorage
export function getCurrentTheme(): string {
  return localStorage.getItem('modular-color-theme') || 'mintgreen';
}

// Function to initialize theme on app load
export function initializeModularTheme() {
  const currentTheme = getCurrentTheme();
  applyPresetTheme(currentTheme);
}
