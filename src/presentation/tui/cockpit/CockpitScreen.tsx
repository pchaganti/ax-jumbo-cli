import React, { useState, useCallback, useMemo } from "react";
import { Box } from "ink";
import { AnimatedBanner } from "./AnimatedBanner.js";
import { generateCustomInfoBoxLines } from "../../cli/banner/AnimationFrames.js";
import { CockpitGreeterView } from "./CockpitGreeterView.js";
import { CockpitUnprimedView } from "./CockpitUnprimedView.js";
import { CockpitPrimedEmptyView } from "./CockpitPrimedEmptyView.js";
import { CockpitLaunchpadView } from "./CockpitLaunchpadView.js";
import type { ISettingsReader } from "../../../application/settings/ISettingsReader.js";

export type CockpitState =
  | "uninitialized"
  | "unprimed"
  | "primed-empty"
  | "primed";

const PLACEHOLDER_COCKPIT_STATE: CockpitState = "uninitialized";
const PLACEHOLDER_VERSION = "0.0.0";
const DEFAULT_TERMINAL_WIDTH = 80;
const DEFAULT_COCKPIT_BODY_HEIGHT = 22;

interface CockpitScreenProps {
  state?: CockpitState;
  shortcutsEnabled?: boolean;
  terminalWidth?: number;
  terminalHeight?: number;
  launchAnimationEnabled?: boolean;
  settingsReader?: Pick<ISettingsReader, "read" | "write">;
}

export function CockpitScreen({
  state = PLACEHOLDER_COCKPIT_STATE,
  shortcutsEnabled = true,
  terminalWidth = DEFAULT_TERMINAL_WIDTH,
  terminalHeight = DEFAULT_COCKPIT_BODY_HEIGHT,
  launchAnimationEnabled = true,
  settingsReader,
}: CockpitScreenProps = {}): React.ReactElement {
  const [bannerComplete, setBannerComplete] = useState(false);
  const bannerPersists = state === "uninitialized" || state === "unprimed";
  const shouldRenderBanner =
    state !== "primed" && (!bannerComplete || bannerPersists);
  const shouldRenderContent = state === "primed" || bannerComplete;
  const launchAnimationSize = useMemo(
    () => ({
      height: Math.max(1, Math.floor(terminalHeight)),
      width: Math.max(1, Math.floor(terminalWidth)),
    }),
    [terminalHeight, terminalWidth],
  );

  const handleBannerComplete = useCallback(() => {
    setBannerComplete(true);
  }, []);

  const infoBoxLines = useMemo(() => {
    if (state === "uninitialized") {
      return generateCustomInfoBoxLines([
        { label: "Directory", value: process.cwd() },
        { label: "Status", value: "Uninitialized" },
      ]);
    }
    if (state === "unprimed") {
      return generateCustomInfoBoxLines([
        { label: "Directory", value: process.cwd() },
        { label: "Status", value: "Ready" },
      ]);
    }
    return undefined;
  }, [state]);

  return (
    <Box flexDirection="column" flexGrow={1} width="100%">
      {shouldRenderBanner && (
        <Box alignSelf="center" marginTop={1} flexShrink={0}>
          <AnimatedBanner
            onComplete={handleBannerComplete}
            persist={bannerPersists}
            version={PLACEHOLDER_VERSION}
            infoBoxLines={infoBoxLines}
          />
        </Box>
      )}
      {shouldRenderContent && (
        <Box flexDirection="column" flexGrow={1} width="100%">
          {state === "uninitialized" && <CockpitGreeterView />}
          {state === "unprimed" && <CockpitUnprimedView />}
          {state === "primed-empty" && <CockpitPrimedEmptyView />}
          {state === "primed" && (
            <CockpitLaunchpadView
              shortcutsEnabled={shortcutsEnabled}
              launchAnimationSize={
                launchAnimationEnabled ? launchAnimationSize : undefined
              }
              settingsReader={settingsReader}
            />
          )}
        </Box>
      )}
    </Box>
  );
}
