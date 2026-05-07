import React from "react";
import { SCREEN_DEFINITIONS } from "./ScreenDefinitions.js";
import { CockpitScreen } from "./screens/CockpitScreen.js";
import { GoalsScreen } from "./screens/GoalsScreen.js";
import { MemoryScreen } from "./screens/MemoryScreen.js";
import { SessionScreen } from "./screens/SessionScreen.js";

interface ScreenRouterProps {
  activeScreenIndex: number;
}

const SCREEN_COMPONENTS: Record<
  (typeof SCREEN_DEFINITIONS)[number]["key"],
  () => React.ReactElement
> = {
  cockpit: CockpitScreen,
  goals: GoalsScreen,
  memory: MemoryScreen,
  session: SessionScreen,
};

export function ScreenRouter({
  activeScreenIndex,
}: ScreenRouterProps): React.ReactElement {
  const definition = SCREEN_DEFINITIONS[activeScreenIndex];
  const ScreenComponent = definition
    ? SCREEN_COMPONENTS[definition.key]
    : SCREEN_COMPONENTS.cockpit;

  return <ScreenComponent />;
}
