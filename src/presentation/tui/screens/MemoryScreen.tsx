import React from "react";
import { ScreenTitleCard } from "../components/ScreenTitleCard.js";

export function MemoryScreen(): React.ReactElement {
  return (
    <ScreenTitleCard
      title="Memory"
      subtitle="Decisions, invariants, components, dependencies, guidelines"
    />
  );
}
