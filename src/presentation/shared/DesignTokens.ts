export const BaseColors = {
  primary: "#ebebeb",
  secondary: "#808080",
  accent: "#40c8c8",
  muted: "#808080",
  brandBlue: "#66b4f4",
  brandBlue50: "#0a528c",
  brandBlue10: "#031c30",
  brandPurple: "#aa00d4",
  brandRed: "#ff2a2a",
  brandOrange: "#ff8307",
  brandYellow: "#ffcc00",
  brandGreen: "#44aa00",
  brandMagenta: "#ff00aa",
} as const;

export const SemanticColors = {
  primary: BaseColors.primary,
  secondary: BaseColors.secondary,
  accent: BaseColors.brandMagenta,
  muted: BaseColors.muted,
  headline: BaseColors.brandBlue,
  success: BaseColors.brandGreen,
  error: BaseColors.brandRed,
  warning: BaseColors.brandYellow,
  info: BaseColors.brandBlue,
  panelBorder: BaseColors.brandBlue,
  label: BaseColors.brandBlue,
  keyBadge: BaseColors.brandBlue,
  keyBadgeBackground: BaseColors.brandBlue10,
} as const;

export const TuiLayout = {
  bannerWidth: 105,
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
