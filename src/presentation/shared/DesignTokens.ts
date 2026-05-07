export const TuiColors = {
  primary: "#ebebeb",
  secondary: "#808080",
  accent: "#40c8c8",
  headline: "#f0c040",

  success: "#40c840",
  error: "#e54040",
  warning: "#f0c040",
  info: "#c8c0a0",

  muted: "#808080",

  brand: "#66b4f4",
  highlight: "#4080f0",

  gradientA: "#ff5b15",
  gradientB: "#66b2ff",
  gradientC: "#dbfbeb",
} as const;

export const TuiSpacing = {
  headerHeight: 1,
  footerHeight: 1,
  padding: {
    small: 1,
    medium: 2,
    large: 4,
  },
} as const;

export const TuiGlyphs = {
  accentBar: "│",
  bullet: "•",
  arrow: "→",
  dot: "·",
  check: "✓",
  cross: "✗",
  filledCircle: "●",
  selector: "▸",
  divider: "─",
} as const;
