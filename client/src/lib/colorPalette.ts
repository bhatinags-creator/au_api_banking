// Dynamic Color Palette Generator for AU Bank Developer Portal
// Generates brand-consistent color schemes based on primary brand colors

export interface ColorHSL {
  h: number; // Hue (0-360)
  s: number; // Saturation (0-100)
  l: number; // Lightness (0-100)
}

export interface ColorRGB {
  r: number; // Red (0-255)
  g: number; // Green (0-255)
  b: number; // Blue (0-255)
}

export interface ColorPalette {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  shades: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
  };
}

// AU Bank brand colors
export const AU_BRAND_COLORS = {
  primary: '#603078', // AU Bank signature purple
  secondary: '#8B5CF6', // Complementary purple
  accent: '#06B6D4', // Cyan accent
  neutral: '#64748B', // Slate gray
};

// Color conversion utilities
export function hexToHsl(hex: string): ColorHSL {
  const rgb = hexToRgb(hex);
  return rgbToHsl(rgb);
}

export function hexToRgb(hex: string): ColorRGB {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

export function rgbToHsl(rgb: ColorRGB): ColorHSL {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

export function hslToHex(hsl: ColorHSL): string {
  const h = hsl.h / 360;
  const s = hsl.s / 100;
  const l = hsl.l / 100;

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  let r, g, b;
  
  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  const toHex = (c: number) => {
    const hex = Math.round(c * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Generate color shades from base color
export function generateShades(baseColor: string): ColorPalette['shades'] {
  const hsl = hexToHsl(baseColor);
  
  return {
    50: hslToHex({ ...hsl, l: 97 }),
    100: hslToHex({ ...hsl, l: 94 }),
    200: hslToHex({ ...hsl, l: 86 }),
    300: hslToHex({ ...hsl, l: 73 }),
    400: hslToHex({ ...hsl, l: 64 }),
    500: baseColor, // Base color
    600: hslToHex({ ...hsl, l: Math.max(hsl.l - 10, 20) }),
    700: hslToHex({ ...hsl, l: Math.max(hsl.l - 20, 15) }),
    800: hslToHex({ ...hsl, l: Math.max(hsl.l - 30, 10) }),
    900: hslToHex({ ...hsl, l: Math.max(hsl.l - 40, 8) }),
    950: hslToHex({ ...hsl, l: Math.max(hsl.l - 50, 5) }),
  };
}

// Color scheme generators
export function generateComplementaryPalette(baseColor: string = AU_BRAND_COLORS.primary): ColorPalette {
  const baseHsl = hexToHsl(baseColor);
  const complementaryHue = (baseHsl.h + 180) % 360;
  const complementaryColor = hslToHex({ ...baseHsl, h: complementaryHue });
  
  return {
    name: 'AU Complementary',
    primary: baseColor,
    secondary: complementaryColor,
    accent: hslToHex({ h: (baseHsl.h + 90) % 360, s: 70, l: 50 }),
    background: '#FFFFFF',
    surface: '#F8FAFC',
    text: '#1E293B',
    textSecondary: '#64748B',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    shades: generateShades(baseColor),
  };
}

export function generateAnalogousPalette(baseColor: string = AU_BRAND_COLORS.primary): ColorPalette {
  const baseHsl = hexToHsl(baseColor);
  const analogous1 = hslToHex({ ...baseHsl, h: (baseHsl.h + 30) % 360 });
  const analogous2 = hslToHex({ ...baseHsl, h: (baseHsl.h - 30 + 360) % 360 });
  
  return {
    name: 'AU Analogous',
    primary: baseColor,
    secondary: analogous1,
    accent: analogous2,
    background: '#FFFFFF',
    surface: '#F8FAFC',
    text: '#1E293B',
    textSecondary: '#64748B',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    shades: generateShades(baseColor),
  };
}

export function generateTriadicPalette(baseColor: string = AU_BRAND_COLORS.primary): ColorPalette {
  const baseHsl = hexToHsl(baseColor);
  const triadic1 = hslToHex({ ...baseHsl, h: (baseHsl.h + 120) % 360 });
  const triadic2 = hslToHex({ ...baseHsl, h: (baseHsl.h + 240) % 360 });
  
  return {
    name: 'AU Triadic',
    primary: baseColor,
    secondary: triadic1,
    accent: triadic2,
    background: '#FFFFFF',
    surface: '#F8FAFC',
    text: '#1E293B',
    textSecondary: '#64748B',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    shades: generateShades(baseColor),
  };
}

export function generateMonochromaticPalette(baseColor: string = AU_BRAND_COLORS.primary): ColorPalette {
  const baseHsl = hexToHsl(baseColor);
  const lighter = hslToHex({ ...baseHsl, l: Math.min(baseHsl.l + 20, 80) });
  const darker = hslToHex({ ...baseHsl, l: Math.max(baseHsl.l - 20, 20) });
  
  return {
    name: 'AU Monochromatic',
    primary: baseColor,
    secondary: lighter,
    accent: darker,
    background: '#FFFFFF',
    surface: '#F8FAFC',
    text: '#1E293B',
    textSecondary: '#64748B',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    shades: generateShades(baseColor),
  };
}

export function generateSplitComplementaryPalette(baseColor: string = AU_BRAND_COLORS.primary): ColorPalette {
  const baseHsl = hexToHsl(baseColor);
  const splitComp1 = hslToHex({ ...baseHsl, h: (baseHsl.h + 150) % 360 });
  const splitComp2 = hslToHex({ ...baseHsl, h: (baseHsl.h + 210) % 360 });
  
  return {
    name: 'AU Split-Complementary',
    primary: baseColor,
    secondary: splitComp1,
    accent: splitComp2,
    background: '#FFFFFF',
    surface: '#F8FAFC',
    text: '#1E293B',
    textSecondary: '#64748B',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    shades: generateShades(baseColor),
  };
}

// Generate all palette variations
export function generateAllPalettes(baseColor: string = AU_BRAND_COLORS.primary): ColorPalette[] {
  return [
    generateComplementaryPalette(baseColor),
    generateAnalogousPalette(baseColor),
    generateTriadicPalette(baseColor),
    generateMonochromaticPalette(baseColor),
    generateSplitComplementaryPalette(baseColor),
  ];
}

// Accessibility utilities
export function getContrastRatio(color1: string, color2: string): number {
  const getLuminance = (color: string): number => {
    const rgb = hexToRgb(color);
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (brighter + 0.05) / (darker + 0.05);
}

export function isAccessible(foreground: string, background: string, level: 'AA' | 'AAA' = 'AA'): boolean {
  const contrast = getContrastRatio(foreground, background);
  return level === 'AA' ? contrast >= 4.5 : contrast >= 7;
}

// Export utilities
export function paletteToCSS(palette: ColorPalette): string {
  return `
/* ${palette.name} Color Palette */
:root {
  --color-primary: ${palette.primary};
  --color-secondary: ${palette.secondary};
  --color-accent: ${palette.accent};
  --color-background: ${palette.background};
  --color-surface: ${palette.surface};
  --color-text: ${palette.text};
  --color-text-secondary: ${palette.textSecondary};
  --color-success: ${palette.success};
  --color-warning: ${palette.warning};
  --color-error: ${palette.error};
  --color-info: ${palette.info};
  
  /* Shades */
  --color-primary-50: ${palette.shades[50]};
  --color-primary-100: ${palette.shades[100]};
  --color-primary-200: ${palette.shades[200]};
  --color-primary-300: ${palette.shades[300]};
  --color-primary-400: ${palette.shades[400]};
  --color-primary-500: ${palette.shades[500]};
  --color-primary-600: ${palette.shades[600]};
  --color-primary-700: ${palette.shades[700]};
  --color-primary-800: ${palette.shades[800]};
  --color-primary-900: ${palette.shades[900]};
  --color-primary-950: ${palette.shades[950]};
}`.trim();
}

export function paletteToJSON(palette: ColorPalette): string {
  return JSON.stringify(palette, null, 2);
}

export function paletteToTailwind(palette: ColorPalette): string {
  return `
// Tailwind CSS Configuration for ${palette.name}
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '${palette.shades[50]}',
          100: '${palette.shades[100]}',
          200: '${palette.shades[200]}',
          300: '${palette.shades[300]}',
          400: '${palette.shades[400]}',
          500: '${palette.primary}',
          600: '${palette.shades[600]}',
          700: '${palette.shades[700]}',
          800: '${palette.shades[800]}',
          900: '${palette.shades[900]}',
          950: '${palette.shades[950]}',
          DEFAULT: '${palette.primary}',
        },
        secondary: '${palette.secondary}',
        accent: '${palette.accent}',
        success: '${palette.success}',
        warning: '${palette.warning}',
        error: '${palette.error}',
        info: '${palette.info}',
      }
    }
  }
}`.trim();
}