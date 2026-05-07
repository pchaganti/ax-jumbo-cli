export const SCREEN_DEFINITIONS = [
  { key: "cockpit", label: "Cockpit", shortcut: "1" },
  { key: "goals", label: "Goals", shortcut: "2" },
  { key: "memory", label: "Memory", shortcut: "3" },
  { key: "session", label: "Session", shortcut: "4" },
] as const;

export type ScreenKey = (typeof SCREEN_DEFINITIONS)[number]["key"];

export const DEFAULT_SCREEN_INDEX = 0;
