// App Color Configuration
// Change these values to update the entire app's color scheme

export const APP_COLORS = {
  // HSL values for CSS variables
  primary: {
    h: 325,        // Hue (0-360)
    s: '100%',     // Saturation (0-100%)
    l: '59%',      // Lightness (0-100%)
  },
  darker: {
    h: 325,
    s: '100%',
    l: '45%',
  },
  lighter: {
    h: 325,
    s: '100%',
    l: '75%',
  },
  // Hex values for direct use in components
  hex: {
    primary: '#FF2D95',    // Hot Pink
    darker: '#E91E63',     // Pink
    lighter: '#FF69B4',    // Light Pink
  }
};

// Color presets for easy switching
export const COLOR_PRESETS = {
  hotpink: {
    primary: { h: 325, s: '100%', l: '59%' },
    darker: { h: 325, s: '100%', l: '45%' },
    lighter: { h: 325, s: '100%', l: '75%' },
    hex: { primary: '#FF2D95', darker: '#E91E63', lighter: '#FF69B4' }
  },
  lime: {
    primary: { h: 120, s: '61%', l: '50%' },
    darker: { h: 120, s: '61%', l: '40%' },
    lighter: { h: 120, s: '61%', l: '60%' },
    hex: { primary: '#32CD32', darker: '#228B22', lighter: '#90EE90' }
  },
  blue: {
    primary: { h: 210, s: '100%', l: '50%' },
    darker: { h: 210, s: '100%', l: '40%' },
    lighter: { h: 210, s: '100%', l: '60%' },
    hex: { primary: '#0066FF', darker: '#0052CC', lighter: '#3399FF' }
  },
  purple: {
    primary: { h: 270, s: '100%', l: '50%' },
    darker: { h: 270, s: '100%', l: '40%' },
    lighter: { h: 270, s: '100%', l: '60%' },
    hex: { primary: '#8000FF', darker: '#6600CC', lighter: '#9933FF' }
  },
  orange: {
    primary: { h: 30, s: '100%', l: '50%' },
    darker: { h: 30, s: '100%', l: '40%' },
    lighter: { h: 30, s: '100%', l: '60%' },
    hex: { primary: '#FF8000', darker: '#CC6600', lighter: '#FF9933' }
  },
  red: {
    primary: { h: 0, s: '100%', l: '50%' },
    darker: { h: 0, s: '100%', l: '40%' },
    lighter: { h: 0, s: '100%', l: '60%' },
    hex: { primary: '#FF0000', darker: '#CC0000', lighter: '#FF3333' }
  }
};

// Function to apply a color preset
export const applyColorPreset = (preset: keyof typeof COLOR_PRESETS) => {
  const colors = COLOR_PRESETS[preset];
  
  // Update CSS variables
  const root = document.documentElement;
  root.style.setProperty('--app-primary-h', colors.primary.h.toString());
  root.style.setProperty('--app-primary-s', colors.primary.s);
  root.style.setProperty('--app-primary-l', colors.primary.l);
  root.style.setProperty('--app-primary-darker-h', colors.darker.h.toString());
  root.style.setProperty('--app-primary-darker-s', colors.darker.s);
  root.style.setProperty('--app-primary-darker-l', colors.darker.l);
  root.style.setProperty('--app-primary-lighter-h', colors.lighter.h.toString());
  root.style.setProperty('--app-primary-lighter-s', colors.lighter.s);
  root.style.setProperty('--app-primary-lighter-l', colors.lighter.l);
  root.style.setProperty('--app-primary-hex', colors.hex.primary);
  root.style.setProperty('--app-primary-darker-hex', colors.hex.darker);
  root.style.setProperty('--app-primary-lighter-hex', colors.hex.lighter);
};

// Function to set custom colors
export const setCustomColors = (h: number, s: string, l: string, hex: string) => {
  const root = document.documentElement;
  root.style.setProperty('--app-primary-h', h.toString());
  root.style.setProperty('--app-primary-s', s);
  root.style.setProperty('--app-primary-l', l);
  root.style.setProperty('--app-primary-darker-h', h.toString());
  root.style.setProperty('--app-primary-darker-s', s);
  root.style.setProperty('--app-primary-darker-l', (parseInt(l) - 10).toString() + '%');
  root.style.setProperty('--app-primary-lighter-h', h.toString());
  root.style.setProperty('--app-primary-lighter-s', s);
  root.style.setProperty('--app-primary-lighter-l', (parseInt(l) + 10).toString() + '%');
  root.style.setProperty('--app-primary-hex', hex);
  root.style.setProperty('--app-primary-darker-hex', hex);
  root.style.setProperty('--app-primary-lighter-hex', hex);
};
