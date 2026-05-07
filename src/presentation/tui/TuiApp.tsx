import React, { useState, useEffect } from "react";
import { Box, useApp, useInput, useStdout } from "ink";
import { Header } from "./components/Header.js";
import { Footer } from "./components/Footer.js";
import { ScreenRouter } from "./ScreenRouter.js";
import { DEFAULT_SCREEN_INDEX } from "./ScreenDefinitions.js";

function useTerminalDimensions(): { columns: number; rows: number } {
  const { stdout } = useStdout();
  const [dimensions, setDimensions] = useState({
    columns: stdout.columns ?? 80,
    rows: stdout.rows ?? 24,
  });

  useEffect(() => {
    const onResize = () => {
      setDimensions({
        columns: stdout.columns ?? 80,
        rows: stdout.rows ?? 24,
      });
    };
    stdout.on("resize", onResize);
    return () => {
      stdout.off("resize", onResize);
    };
  }, [stdout]);

  return dimensions;
}

export function TuiApp(): React.ReactElement {
  const { exit } = useApp();
  const { columns, rows } = useTerminalDimensions();
  const [activeScreenIndex, setActiveScreenIndex] = useState(
    DEFAULT_SCREEN_INDEX,
  );

  useInput((input) => {
    if (input === "q") {
      exit();
    }
  });

  return (
    <Box flexDirection="column" width={columns} height={rows}>
      <Box flexShrink={0}>
        <Header
          activeScreenIndex={activeScreenIndex}
          onScreenChange={setActiveScreenIndex}
          terminalWidth={columns}
        />
      </Box>
      <Box flexGrow={1} flexDirection="column">
        <ScreenRouter activeScreenIndex={activeScreenIndex} />
      </Box>
      <Box flexShrink={0}>
        <Footer terminalWidth={columns} />
      </Box>
    </Box>
  );
}
