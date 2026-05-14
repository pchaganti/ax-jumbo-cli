import React from "react";
import { ScreenTitleCard } from "../components/ScreenTitleCard.js";

export function SessionScreen(): React.ReactElement {
  return (
    <ScreenTitleCard
      title="Session"
      subtitle="Current session focus and history"
    />
  );
}
