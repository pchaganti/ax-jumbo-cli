import React, { useCallback, useEffect, useState } from "react";
import { Box, Text, useInput } from "ink";
import AnimatedBillboard from "../billboard/AnimatedBillboard.js";
import type { AnimatedBillboardTriggerInput } from "../billboard/AnimatedBillboard.js";
import { Panel } from "../ui-primitives/Panel.js";
import { KeyBadge } from "../ui-primitives/KeyBadge.js";
import { BaseColors } from "../../shared/DesignTokens.js";
import { useSubprocessManager } from "../daemon-subprocesses/SubprocessManagerContext.js";
import type { ISettingsReader } from "../../../application/settings/ISettingsReader.js";
import type { ISubprocessManager, TuiDaemonConfig, TuiDaemonConfigs, TuiDaemonEventSnapshot, TuiDaemonEventStatus, TuiDaemonName, TuiSubprocessSnapshot } from "../daemon-subprocesses/ISubprocessManager.js";

interface GlyphStyle {
  color: string;
  dimColor?: boolean;
}

type GlyphColorMap = Readonly<Record<string, string>>;
type GlyphPalette = readonly string[];

interface GlyphCell {
  readonly glyph: string;
  readonly color: string;
}

interface RandomGlyphFrameConfig {
  readonly frameCount: number;
  readonly gridWidth: number;
  readonly gridHeight: number;
  readonly glyphs: readonly string[];
}

interface DaemonEventRow {
  readonly key: string;
  readonly source: string;
  readonly category: string;
  readonly timestampMs: number;
  readonly message: string;
  readonly color: string;
}

interface LaunchAnimationSize {
  readonly width: number;
  readonly height: number;
}

export type LaunchAnimationRenderer = (
  input: AnimatedBillboardTriggerInput,
) => React.ReactElement;

const RENDERED_DAEMON_EVENT_LIMIT = 10;
const RENDERED_DAEMON_FRAME_HEIGHT = 5;
const DAEMON_EVENT_SOURCE_WIDTH = 8;
const DAEMON_EVENT_CATEGORY_WIDTH = 12;
const DAEMON_PANEL_CONTENT_WIDTH = 35;
const RANDOM_GLYPH_GRID_HEIGHT = 10;
const REFINER_FRAME_COUNT = 9;
const REVIEWER_FRAME_COUNT = 6;
const CODIFIER_FRAME_COUNT = 6;
const CODIFIER_GRID_HEIGHT = 10;
const CODIFIER_GROUP_LENGTH = 4;
const CODIFIER_ROW_REPEAT_COUNT = 7;
const DEFAULT_REFINER_FRAME_DURATION_MS = 500;
const DEFAULT_REVIEWER_FRAME_DURATION_MS = 350;
const DEFAULT_CODIFIER_FRAME_DURATION_MS = 200;
const DEFAULT_CODIFIER_GLYPH_STYLE: GlyphStyle = {
  color: BaseColors.shade3,
  dimColor: false,
};
const AGENT_OPTIONS = ["codex", "claude", "gemini", "copilot", "cursor", "vibe"] as const;
const POLL_INTERVAL_OPTIONS_MS = [10_000, 30_000, 60_000, 120_000] as const;
const RETRY_OPTIONS = [1, 2, 3, 5] as const;
const DEFAULT_DAEMON_CONFIG: TuiDaemonConfig = {
  agentId: "codex",
  pollIntervalMs: 30_000,
  maxRetries: 3,
};
const DEFAULT_DAEMON_CONFIGS: TuiDaemonConfigs = {
  reviewer: DEFAULT_DAEMON_CONFIG,
  refiner: DEFAULT_DAEMON_CONFIG,
  codifier: DEFAULT_DAEMON_CONFIG,
};
const DAEMON_FOCUS_ORDER = ["refiner", "reviewer", "codifier"] as const satisfies readonly TuiDaemonName[];
const DAEMON_ACTIVE_VERBS = {
  reviewer: "reviewing",
  refiner: "refining",
  codifier: "codifying",
} as const satisfies Record<TuiDaemonName, string>;
const DAEMON_IDLE_VERBS = {
  reviewer: "awaiting submissions",
  refiner: "foraging",
  codifier: "awaiting approvals",
} as const satisfies Record<TuiDaemonName, string>;
const DAEMON_INFO_COPY = {
  reviewer: {
    title: "REVIEWER//",
    lines: [
      "Orchestrate background agents to automatically review goal implementations as soon as they submitted.",
      "",
      "Approved goals will get picked up by the codifier (if running).",
      "Rejected goals will get requeued with documented issues to be resolved."
    ],
  },
  refiner: {
    title: "REFINER//",
    lines: [
      "Automatically apply relevant memories to build goal context for the implementing agent.",
      "",
      "Goals are submitted when finished and ready for implementation."
    ],
  },
  codifier: {
    title: "CODIFIER//",
    lines: [
      "Codify implementation results automatically as soon as goals are approved.",
      "",
      "Missing decisions, components and documentation will be updated before goals are finally closed.",
    ],
  },
} as const satisfies Record<TuiDaemonName, { readonly title: string; readonly lines: readonly string[] }>;

const REFINER_GLYPHS = [
  "•",
] as const;

const REVIEWER_GLYPHS = [
  "+",
] as const;

const CODIFIER_ALPHANUMERIC_GLYPHS = [
  ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
] as const;

const DEFAULT_RANDOM_GLYPH_COLORS = [
  BaseColors.tint1,
  BaseColors.primary,
  BaseColors.shade1,
  BaseColors.shade2,
  BaseColors.shade3,
  BaseColors.shade4,
  BaseColors.shade5,
  BaseColors.shade6,
] as const;

const REFINER_GLYPH_FRAME_CONFIG = {
  frameCount: REFINER_FRAME_COUNT,
  gridWidth: DAEMON_PANEL_CONTENT_WIDTH,
  gridHeight: RANDOM_GLYPH_GRID_HEIGHT,
  glyphs: REFINER_GLYPHS,
} as const satisfies RandomGlyphFrameConfig;

const REVIEWER_GLYPH_FRAME_CONFIG = {
  frameCount: REVIEWER_FRAME_COUNT,
  gridWidth: DAEMON_PANEL_CONTENT_WIDTH,
  gridHeight: RANDOM_GLYPH_GRID_HEIGHT,
  glyphs: REVIEWER_GLYPHS,
} as const satisfies RandomGlyphFrameConfig;

const DEFAULT_CODIFIER_GLYPH_COLORS: GlyphColorMap = {
  "█": BaseColors.shade1,
  "░": BaseColors.shade2,
};
const DEFAULT_REVIEWER_GLYPH_COLORS: GlyphColorMap = {
  "⌈": BaseColors.primary,
  "⌉": BaseColors.tint1,
  "⌊": BaseColors.shade2,
  "⌋": BaseColors.shade3,
  "⏚": BaseColors.shade4,
  "⏛": BaseColors.shade5,
  "⏗": BaseColors.shade6,
};

interface CockpitLaunchpadViewProps {
  shortcutsEnabled?: boolean;
  launchAnimationSize?: LaunchAnimationSize;
  onLaunchAnimationDone?: () => void;
  launchAnimationRenderer?: LaunchAnimationRenderer;
  refinerGlyphPalette?: GlyphPalette;
  reviewerGlyphPalette?: GlyphPalette;
  reviewerGlyphColors?: GlyphColorMap;
  codifierGlyphColors?: GlyphColorMap;
  refinerFrameDurationMs?: number;
  reviewerFrameDurationMs?: number;
  codifierFrameDurationMs?: number;
  settingsReader?: Pick<ISettingsReader, "read" | "write">;
}

export function CockpitLaunchpadView({
  shortcutsEnabled = true,
  launchAnimationSize,
  onLaunchAnimationDone,
  launchAnimationRenderer = AnimatedBillboard.trigger,
  refinerGlyphPalette = DEFAULT_RANDOM_GLYPH_COLORS,
  reviewerGlyphPalette = DEFAULT_RANDOM_GLYPH_COLORS,
  codifierGlyphColors = DEFAULT_CODIFIER_GLYPH_COLORS,
  refinerFrameDurationMs = DEFAULT_REFINER_FRAME_DURATION_MS,
  reviewerFrameDurationMs = DEFAULT_REVIEWER_FRAME_DURATION_MS,
  codifierFrameDurationMs = DEFAULT_CODIFIER_FRAME_DURATION_MS,
  settingsReader,
}: CockpitLaunchpadViewProps = {}): React.ReactElement {
  const subprocessManager = useSubprocessManager();
  const [launchAnimationDone, setLaunchAnimationDone] = useState(
    launchAnimationSize === undefined,
  );
  const [reviewerFrameIndex, setReviewerFrameIndex] = useState(0);
  const [refinerFrameIndex, setRefinerFrameIndex] = useState(0);
  const [codifierFrameIndex, setCodifierFrameIndex] = useState(0);
  const [selectedDaemon, setSelectedDaemon] = useState<TuiDaemonName>("refiner");
  const [configuredDaemon, setConfiguredDaemon] = useState<TuiDaemonName | undefined>(undefined);
  const [infoDaemon, setInfoDaemon] = useState<TuiDaemonName | undefined>(undefined);
  const [welcomeVisible, setWelcomeVisible] = useState<boolean | undefined>(
    settingsReader === undefined ? true : undefined,
  );
  const [daemonConfigs, setDaemonConfigs] = useState<TuiDaemonConfigs>(DEFAULT_DAEMON_CONFIGS);
  const [daemonStatuses, setDaemonStatuses] = useState<readonly TuiSubprocessSnapshot[]>(
    subprocessManager.getAllStatuses(),
  );
  const [daemonEventRows, setDaemonEventRows] = useState<readonly DaemonEventRow[]>(() =>
    getDaemonEventRows(subprocessManager.getAllStatuses(), Date.now())
  );
  const launchAnimationActive =
    launchAnimationSize !== undefined && !launchAnimationDone;

  useEffect(() => {
    if (launchAnimationSize === undefined) {
      setLaunchAnimationDone(true);
    }
  }, [launchAnimationSize]);

  const handleLaunchAnimationDone = useCallback(() => {
    setLaunchAnimationDone(true);
    onLaunchAnimationDone?.();
  }, [onLaunchAnimationDone]);

  useEffect(() => {
    let mounted = true;

    if (settingsReader === undefined) {
      setWelcomeVisible(true);
      return () => {
        mounted = false;
      };
    }

    setWelcomeVisible(undefined);
    void settingsReader.read()
      .then((settings) => {
        if (mounted) {
          setWelcomeVisible(settings.tui?.showLaunchpadWelcome ?? true);
        }
      })
      .catch(() => {
        if (mounted) {
          setWelcomeVisible(true);
        }
      });

    return () => {
      mounted = false;
    };
  }, [settingsReader]);

  const hideWelcome = useCallback(async () => {
    setWelcomeVisible(false);

    if (settingsReader === undefined) {
      return;
    }

    try {
      const settings = await settingsReader.read();
      await settingsReader.write({
        ...settings,
        tui: {
          ...settings.tui,
          showLaunchpadWelcome: false,
        },
      });
    } catch {
      // Keep the in-memory dismissal even if persistence is unavailable.
    }
  }, [settingsReader]);

  useEffect(() => {
    if (reviewerFrameDurationMs <= 0) return;

    const timer = setInterval(() => {
      setReviewerFrameIndex((previousFrameIndex) =>
        (previousFrameIndex + 1) % REVIEWER_FRAME_COUNT
      );
    }, reviewerFrameDurationMs);

    return () => clearInterval(timer);
  }, [reviewerFrameDurationMs]);

  useEffect(() => {
    if (REFINER_FRAME_COUNT <= 1 || refinerFrameDurationMs <= 0) return;

    const timer = setInterval(() => {
      setRefinerFrameIndex((previousFrameIndex) =>
        (previousFrameIndex + 1) % REFINER_FRAME_COUNT
      );
    }, refinerFrameDurationMs);

    return () => clearInterval(timer);
  }, [refinerFrameDurationMs]);

  useEffect(() => {
    if (codifierFrameDurationMs <= 0) return;

    const timer = setInterval(() => {
      setCodifierFrameIndex((previousFrameIndex) =>
        (previousFrameIndex + 1) % CODIFIER_FRAME_COUNT
      );
    }, codifierFrameDurationMs);

    return () => clearInterval(timer);
  }, [codifierFrameDurationMs]);

  useEffect(() => {
    const timer = setInterval(() => {
      const snapshots = subprocessManager.getAllStatuses();
      setDaemonStatuses(snapshots);
      setDaemonEventRows((currentRows) =>
        appendDaemonEventRows(currentRows, getDaemonEventRows(snapshots, Date.now()))
      );
    }, 500);

    return () => clearInterval(timer);
  }, [subprocessManager]);

  useInput(
    (input, key) => {
      if (key.tab || input === "\t") {
        setSelectedDaemon((currentDaemon) => {
          const nextDaemon = getNextFocusedDaemon(currentDaemon);
          setInfoDaemon((currentInfoDaemon) =>
            currentInfoDaemon === undefined ? undefined : nextDaemon
          );
          return nextDaemon;
        });
      }
      if (input === "s" || input === "S") {
        void toggleDaemon(selectedDaemon, subprocessManager, daemonConfigs[selectedDaemon], setDaemonStatuses, setDaemonEventRows);
      }
      if (input === "@") {
        setConfiguredDaemon((currentDaemon) =>
          currentDaemon === selectedDaemon ? undefined : selectedDaemon
        );
      }
      if (input === "i" || input === "I") {
        setInfoDaemon((currentDaemon) =>
          currentDaemon === selectedDaemon ? undefined : selectedDaemon
        );
      }
      if (
        (input === "x" || input === "X") &&
        welcomeVisible === true &&
        configuredDaemon === undefined
      ) {
        void hideWelcome();
        return;
      }
      if (input === "a" || input === "A") {
        if (configuredDaemon !== undefined) {
          setDaemonConfigs((configs) => nextDaemonConfigs(configs, configuredDaemon, nextAgentConfig));
        }
      }
      if (input === "p" || input === "P") {
        if (configuredDaemon !== undefined) {
          setDaemonConfigs((configs) => nextDaemonConfigs(configs, configuredDaemon, nextPollConfig));
        }
      }
      if (input === "x" || input === "X") {
        if (configuredDaemon !== undefined) {
          setDaemonConfigs((configs) => nextDaemonConfigs(configs, configuredDaemon, nextRetryConfig));
        }
      }
    },
    { isActive: shortcutsEnabled },
  );

  const reviewerStatus = findDaemonStatus(daemonStatuses, "reviewer");
  const refinerStatus = findDaemonStatus(daemonStatuses, "refiner");
  const codifierStatus = findDaemonStatus(daemonStatuses, "codifier");
  const renderedRefinerFrameIndex = getRenderedFrameIndex(refinerStatus, refinerFrameIndex);
  const renderedReviewerFrameIndex = getRenderedFrameIndex(reviewerStatus, reviewerFrameIndex);
  const renderedCodifierFrameIndex = getRenderedFrameIndex(codifierStatus, codifierFrameIndex);

  if (launchAnimationActive) {
    return (
      <Box flexDirection="column" flexGrow={1} width="100%" height="100%">
        {launchAnimationRenderer({
          height: launchAnimationSize.height,
          width: launchAnimationSize.width,
          onDone: handleLaunchAnimationDone,
        })}
      </Box>
    );
  }

  return (
    <Box flexDirection="column" width="100%" height="100%" paddingX={1}>
      {welcomeVisible === true && (
        <WelcomeBox />
      )}
      <Box flexDirection="row" flexShrink={0} height={13} width="100%" gap={1} marginY={1}>
        <DaemonPanel
          title="REFINER//"
          selected={selectedDaemon === "refiner"}
          configuring={configuredDaemon === "refiner"}
          infoVisible={infoDaemon === "refiner"}
          snapshot={refinerStatus}
          pendingConfig={daemonConfigs.refiner}
        >
          <GlyphCellDaemonFrame
            frame={getRefinerFrame(renderedRefinerFrameIndex, refinerGlyphPalette)}
            frameIndex={renderedRefinerFrameIndex}
            snapshot={refinerStatus}
          />
        </DaemonPanel>
        <DaemonPanel
          title="REVIEWER//"
          selected={selectedDaemon === "reviewer"}
          configuring={configuredDaemon === "reviewer"}
          infoVisible={infoDaemon === "reviewer"}
          snapshot={reviewerStatus}
          pendingConfig={daemonConfigs.reviewer}
        >
          <GlyphCellDaemonFrame
            frame={getReviewerFrame(renderedReviewerFrameIndex, reviewerGlyphPalette)}
            frameIndex={renderedReviewerFrameIndex}
            snapshot={reviewerStatus}
          />
        </DaemonPanel>
        <DaemonPanel
          title="CODIFIER//"
          selected={selectedDaemon === "codifier"}
          configuring={configuredDaemon === "codifier"}
          infoVisible={infoDaemon === "codifier"}
          snapshot={codifierStatus}
          pendingConfig={daemonConfigs.codifier}
        >
          <Box flexDirection="column" flexWrap="nowrap" width={DAEMON_PANEL_CONTENT_WIDTH}>
            {getRenderedDaemonFrame(getCodifierFrame(renderedCodifierFrameIndex)).map((line, lineIndex) => (
              <Text key={`${renderedCodifierFrameIndex}-${lineIndex}`}>
                {getStyledGlyphSegments(getGlyphLinePrefix(line, codifierStatus, lineIndex), codifierGlyphColors, codifierStatus).map((segment, segmentIndex) => (
                  <Text
                    key={`${renderedCodifierFrameIndex}-${lineIndex}-prefix-${segmentIndex}`}
                    color={segment.color}
                    dimColor={segment.dimColor}>
                    {segment.text}
                  </Text>
                ))}
                {isDaemonStatusLine(lineIndex) && (
                  <Text color={getDaemonStatusColor(codifierStatus)} bold>
                    {getDaemonPanelStatusLabel(codifierStatus)}
                  </Text>
                )}
                {getStyledGlyphSegments(getGlyphLineSuffix(line, codifierStatus, lineIndex), codifierGlyphColors, codifierStatus).map((segment, segmentIndex) => (
                  <Text
                    key={`${renderedCodifierFrameIndex}-${lineIndex}-suffix-${segmentIndex}`}
                    color={segment.color}
                    dimColor={segment.dimColor}>
                    {segment.text}
                  </Text>
                ))}
              </Text>
            ))}
          </Box>
        </DaemonPanel>
      </Box>
      <Box flexDirection="column" flexGrow={1} flexBasis={0} width="100%" paddingY={1}>
        {infoDaemon !== undefined && (
          <DaemonInfoOverlay name={infoDaemon} />
        )}
        <Text color={BaseColors.shade2} bold>
          EVENTS//
        </Text>
        <Box flexDirection="column" marginTop={1}>
          {daemonEventRows.map((row) => (
            <Text key={row.key} color={row.color}>
              {formatDaemonEventRow(row)}
            </Text>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

function WelcomeBox(): React.ReactElement {
  return (
    <Box
      flexDirection="column"
      flexShrink={0}
      paddingX={1}
      marginY={1}
      borderColor={BaseColors.brandBlue}
      borderStyle="round"
    >
      <Box flexDirection="row">
        <Text color={BaseColors.brandBlue}>
          Welcome//
        </Text>
      </Box>
      <Box flexDirection="row">
        <Text color={BaseColors.shade1}>
          Run Jumbo worker daemons to keep goal workflows moving. 
          Each worker watches Jumbo state, starts your configured agent when a goal is ready, 
          and prompts it through the next CLI step: refinement, review, or codification.
        </Text>
        <Text color={BaseColors.shade1}>
          You define and prioritize the work; Jumbo handles the repeatable agent handoffs.
        </Text>
      </Box>
      <Box width="100%" justifyContent="flex-end">
        <KeyBadge
          char="x"
          label="hide"
          color={BaseColors.brandBlue}
          labelColor={BaseColors.shade4}
        />
      </Box>
    </Box>
  );
}

function DaemonPanel({
  title,
  snapshot,
  pendingConfig,
  selected,
  configuring,
  infoVisible,
  children,
}: {
  readonly title: string;
  readonly snapshot: TuiSubprocessSnapshot;
  readonly pendingConfig: TuiDaemonConfig;
  readonly selected: boolean;
  readonly configuring: boolean;
  readonly infoVisible: boolean;
  readonly children: React.ReactNode;
}): React.ReactElement {
  return (
    <Panel
      title={title}
      titleColor={selected ? BaseColors.brandBlue : BaseColors.shade3}
      borderColor={selected ? BaseColors.brandBlue : BaseColors.shade5}
      flexGrow={3}
      flexBasis={0}
      height="100%"
      bordered={false}
    >
      <Box alignItems="center" flexDirection="column">
        {children}
        <DaemonActionLine
          snapshot={snapshot}
          selected={selected}
          infoVisible={infoVisible}
        />
        {configuring && (
          <DaemonConfigWizard
            snapshot={snapshot}
            pendingConfig={pendingConfig}
            selected={selected}
          />
        )}
      </Box>
    </Panel>
  );
}

function getRenderedDaemonFrame<T>(frame: readonly T[]): readonly T[] {
  return frame.slice(0, RENDERED_DAEMON_FRAME_HEIGHT);
}

function GlyphCellDaemonFrame({
  frame,
  frameIndex,
  snapshot,
}: {
  readonly frame: readonly (readonly GlyphCell[])[];
  readonly frameIndex: number;
  readonly snapshot: TuiSubprocessSnapshot;
}): React.ReactElement {
  return (
    <Box flexDirection="column" flexWrap="nowrap" width={DAEMON_PANEL_CONTENT_WIDTH}>
      {getRenderedDaemonFrame(frame).map((line, lineIndex) => (
        <Text key={`${frameIndex}-${lineIndex}`}>
          {getGlyphCellSegments(
            getGlyphCellLinePrefix(line, snapshot, lineIndex),
            snapshot,
          ).map((segment, segmentIndex) => (
            <Text
              key={`${frameIndex}-${lineIndex}-prefix-${segmentIndex}`}
              color={segment.color}>
              {segment.text}
            </Text>
          ))}
          {isDaemonStatusLine(lineIndex) && (
            <Text color={getDaemonStatusColor(snapshot)} bold>
              {getDaemonPanelStatusLabel(snapshot)}
            </Text>
          )}
          {getGlyphCellSegments(
            getGlyphCellLineSuffix(line, snapshot, lineIndex),
            snapshot,
          ).map((segment, segmentIndex) => (
            <Text
              key={`${frameIndex}-${lineIndex}-suffix-${segmentIndex}`}
              color={segment.color}>
              {segment.text}
            </Text>
          ))}
        </Text>
      ))}
    </Box>
  );
}

function getRenderedFrameIndex(
  snapshot: TuiSubprocessSnapshot,
  animatedFrameIndex: number,
): number {
  return snapshot.status === "running" ? animatedFrameIndex : 0;
}

function DaemonActionLine({
  snapshot,
  selected,
  infoVisible,
}: {
  readonly snapshot: TuiSubprocessSnapshot;
  readonly selected: boolean;
  readonly infoVisible: boolean;
}): React.ReactElement {
  const action = snapshot.status === "running" ? "stop" : "start";
  const badgeColor = getDaemonShortcutBadgeColor(selected);

  return (
    <Box width={DAEMON_PANEL_CONTENT_WIDTH} marginTop={1} gap={1}>
      <KeyBadge
        char="s"
        label={action}
        color={badgeColor}
        labelColor={BaseColors.shade4}
      />
      <KeyBadge
        char="@"
        label="config"
        color={badgeColor}
        labelColor={BaseColors.shade4}
      />
      <KeyBadge
        char="i"
        label={infoVisible ? "info open" : "info"}
        color={badgeColor}
        labelColor={BaseColors.shade4}
      />
    </Box>
  );
}

function DaemonInfoOverlay({
  name,
}: {
  readonly name: TuiDaemonName;
}): React.ReactElement {
  const info = DAEMON_INFO_COPY[name];

  return (
    <Box
      borderStyle="round"
      borderColor={BaseColors.brandBlue}
      flexDirection="column"
      marginBottom={1}
      paddingX={1}
      width="100%"
    >
      <Text color={BaseColors.brandBlue} bold>
        {info.title}
      </Text>
      {info.lines.map((line) => (
        <Text key={line} color={BaseColors.shade2}>
          {line}
        </Text>
      ))}
      <Text color={BaseColors.shade4}>
        [i] close
      </Text>
    </Box>
  );
}

function DaemonConfigWizard({
  snapshot,
  pendingConfig,
  selected,
}: {
  readonly snapshot: TuiSubprocessSnapshot;
  readonly pendingConfig: TuiDaemonConfig;
  readonly selected: boolean;
}): React.ReactElement {
  const config = snapshot.status === "running" ? snapshot.config : pendingConfig;
  const badgeColor = getDaemonShortcutBadgeColor(selected);

  return (
    <Box width={DAEMON_PANEL_CONTENT_WIDTH} flexDirection="column">
      <Text color={BaseColors.shade4}>
        pid {snapshot.pid ?? "-"}
      </Text>
      <Box gap={1}>
        <KeyBadge
          char="a"
          label={config.agentId}
          color={badgeColor}
          labelColor={BaseColors.shade4}
        />
        <KeyBadge
          char="p"
          label={`${Math.round(config.pollIntervalMs / 1000)}s`}
          color={badgeColor}
          labelColor={BaseColors.shade4}
        />
        <KeyBadge
          char="x"
          label={String(config.maxRetries)}
          color={badgeColor}
          labelColor={BaseColors.shade4}
        />
      </Box>
    </Box>
  );
}

function getDaemonShortcutBadgeColor(selected: boolean): string {
  return selected ? BaseColors.brandBlue : BaseColors.shade4;
}

function getDaemonPanelStatusLabel(snapshot: TuiSubprocessSnapshot): string {
  const latestEvent = getLatestDaemonActivityEvent(snapshot);
  if (snapshot.status === "running" && latestEvent?.status === "idle") {
    return `[ ${DAEMON_IDLE_VERBS[snapshot.name]} ]`;
  }

  const status = snapshot.status === "running"
    ? DAEMON_ACTIVE_VERBS[snapshot.name]
    : snapshot.status;

  return `[ ${status} ]`;
}

function getDaemonStatusColor(_snapshot: TuiSubprocessSnapshot): string {
  return BaseColors.shade3;
}

function isDaemonStatusLine(lineIndex: number): boolean {
  return lineIndex === Math.floor(RENDERED_DAEMON_FRAME_HEIGHT / 2);
}

function getGlyphCellLinePrefix(
  line: readonly GlyphCell[],
  snapshot: TuiSubprocessSnapshot,
  lineIndex: number,
): readonly GlyphCell[] {
  if (!isDaemonStatusLine(lineIndex)) {
    return line;
  }

  return line.slice(0, getDaemonStatusOverlayStart(line.length, snapshot));
}

function getGlyphCellLineSuffix(
  line: readonly GlyphCell[],
  snapshot: TuiSubprocessSnapshot,
  lineIndex: number,
): readonly GlyphCell[] {
  if (!isDaemonStatusLine(lineIndex)) {
    return [];
  }

  return line.slice(getDaemonStatusOverlayEnd(line.length, snapshot));
}

function getGlyphLinePrefix(
  line: string,
  snapshot: TuiSubprocessSnapshot,
  lineIndex: number,
): string {
  if (!isDaemonStatusLine(lineIndex)) {
    return line;
  }

  return line.slice(0, getDaemonStatusOverlayStart(line.length, snapshot));
}

function getGlyphLineSuffix(
  line: string,
  snapshot: TuiSubprocessSnapshot,
  lineIndex: number,
): string {
  if (!isDaemonStatusLine(lineIndex)) {
    return "";
  }

  return line.slice(getDaemonStatusOverlayEnd(line.length, snapshot));
}

function getDaemonStatusOverlayStart(
  lineLength: number,
  snapshot: TuiSubprocessSnapshot,
): number {
  return Math.max(0, Math.floor((lineLength - getDaemonPanelStatusLabel(snapshot).length) / 2));
}

function getDaemonStatusOverlayEnd(
  lineLength: number,
  snapshot: TuiSubprocessSnapshot,
): number {
  return Math.min(lineLength, getDaemonStatusOverlayStart(lineLength, snapshot) + getDaemonPanelStatusLabel(snapshot).length);
}

function getNextFocusedDaemon(currentDaemon: TuiDaemonName): TuiDaemonName {
  const currentIndex = DAEMON_FOCUS_ORDER.indexOf(currentDaemon);
  const nextIndex = currentIndex === -1
    ? 0
    : (currentIndex + 1) % DAEMON_FOCUS_ORDER.length;

  return DAEMON_FOCUS_ORDER[nextIndex];
}

async function toggleDaemon(
  name: TuiDaemonName,
  manager: ISubprocessManager,
  config: TuiDaemonConfig,
  setDaemonStatuses: (statuses: readonly TuiSubprocessSnapshot[]) => void,
  setDaemonEventRows: (update: (currentRows: readonly DaemonEventRow[]) => readonly DaemonEventRow[]) => void,
): Promise<void> {
  const snapshot = manager.getStatus(name);
  if (snapshot.status === "running") {
    await manager.terminate(name);
  } else {
    await manager.spawn(name, config);
  }
  const snapshots = manager.getAllStatuses();
  setDaemonStatuses(snapshots);
  setDaemonEventRows((currentRows) =>
    appendDaemonEventRows(currentRows, getDaemonEventRows(snapshots, Date.now()))
  );
}

function findDaemonStatus(
  statuses: readonly TuiSubprocessSnapshot[],
  name: TuiDaemonName,
): TuiSubprocessSnapshot {
  return statuses.find((status) => status.name === name) ?? {
    name,
    status: "stopped",
    config: DEFAULT_DAEMON_CONFIG,
    stdout: [],
    stderr: [],
    events: [],
  };
}

function getDaemonEventRows(
  snapshots: readonly TuiSubprocessSnapshot[],
  observedAtMs: number,
): readonly DaemonEventRow[] {
  const rows = snapshots.flatMap((snapshot) => getSnapshotEventRows(snapshot, observedAtMs));

  return rows
    .sort((left, right) => right.timestampMs - left.timestampMs)
    .slice(0, RENDERED_DAEMON_EVENT_LIMIT);
}

function appendDaemonEventRows(
  currentRows: readonly DaemonEventRow[],
  nextRows: readonly DaemonEventRow[],
): readonly DaemonEventRow[] {
  const currentKeys = new Set(currentRows.map((row) => row.key));
  const appendedRows = nextRows.filter((row) => !currentKeys.has(row.key));

  if (appendedRows.length === 0) {
    return currentRows;
  }

  return [...currentRows, ...appendedRows]
    .sort((left, right) => right.timestampMs - left.timestampMs)
    .slice(0, RENDERED_DAEMON_EVENT_LIMIT);
}

function getSnapshotEventRows(
  snapshot: TuiSubprocessSnapshot,
  observedAtMs: number,
): readonly DaemonEventRow[] {
  const eventRows = snapshot.events
    .map((event, eventIndex) =>
      toDaemonEventRow(snapshot, event, eventIndex, observedAtMs)
    );
  const lifecycleRow = getLifecycleEventRow(snapshot, eventRows.length, observedAtMs);

  if (lifecycleRow === undefined) {
    return eventRows;
  }

  return [...eventRows, lifecycleRow];
}

function getLifecycleEventRow(
  snapshot: TuiSubprocessSnapshot,
  eventIndex: number,
  observedAtMs: number,
): DaemonEventRow | undefined {
  if (snapshot.status === "running" && snapshot.stopRequested === true) {
    return createDaemonEventRow(snapshot, "stopping", eventIndex, observedAtMs);
  }
  if (snapshot.status === "running" && snapshot.events.length === 0) {
    return createDaemonEventRow(snapshot, "starting", eventIndex, observedAtMs);
  }
  if (snapshot.status === "failed") {
    return createDaemonEventRow(snapshot, "failed", eventIndex, observedAtMs);
  }
  if (
    snapshot.status === "stopped"
    && (snapshot.stopRequested === true || snapshot.exitCode !== undefined || snapshot.exitSignal !== undefined)
  ) {
    return createDaemonEventRow(snapshot, "stopped", eventIndex, observedAtMs);
  }
  return undefined;
}

function createDaemonEventRow(
  snapshot: TuiSubprocessSnapshot,
  status: TuiDaemonEventStatus,
  eventIndex: number,
  observedAtMs: number,
): DaemonEventRow {
  return toDaemonEventRow(
    snapshot,
    {
      daemon: snapshot.name,
      status,
      errorMessage: snapshot.stderr[snapshot.stderr.length - 1],
      exitCode: snapshot.exitCode ?? undefined,
    },
    eventIndex,
    observedAtMs,
  );
}

function toDaemonEventRow(
  snapshot: TuiSubprocessSnapshot,
  event: TuiDaemonEventSnapshot,
  eventIndex: number,
  observedAtMs: number,
): DaemonEventRow {
  const status = normalizeDaemonEventStatus(event.status);
  const timestampMs = event.timestampMs ?? observedAtMs;
  const key = event.timestampMs === undefined
    ? `${snapshot.name}-lifecycle-${status}-${snapshot.pid ?? "none"}-${snapshot.exitCode ?? "none"}-${snapshot.stopRequested ?? false}`
    : `${snapshot.name}-${eventIndex}-${event.status}-${event.goalId ?? "none"}-${timestampMs}`;

  return {
    key,
    source: normalizeDaemonEventSource(snapshot, event),
    category: normalizeDaemonEventCategory(event, status),
    timestampMs,
    message: formatDaemonEventMessage(snapshot, event),
    color: getDaemonEventColor(status),
  };
}

function normalizeDaemonEventStatus(status: string): TuiDaemonEventStatus {
  if (status === "starting" || status === "stopping" || status === "stopped" || status === "failed" || status === "idle" || status === "processing" || status === "completed" || status === "skipped" || status === "exhausted" || status === "codifying") {
    return status;
  }

  return "processing";
}

function formatDaemonEventRow(row: DaemonEventRow): string {
  const message = row.message.length > 0 ? ` ${row.message}` : "";

  return `${formatEventTimestamp(row.timestampMs)} ${row.source.padEnd(DAEMON_EVENT_SOURCE_WIDTH)} ${row.category.padEnd(DAEMON_EVENT_CATEGORY_WIDTH)}${message}`;
}

function formatEventTimestamp(timestampMs: number): string {
  const date = new Date(timestampMs);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}

function normalizeDaemonEventSource(
  snapshot: TuiSubprocessSnapshot,
  event: TuiDaemonEventSnapshot,
): string {
  return truncateTail(event.source ?? event.daemon ?? snapshot.name, 8);
}

function normalizeDaemonEventCategory(
  event: TuiDaemonEventSnapshot,
  status: TuiDaemonEventStatus,
): string {
  return truncateTail(event.category ?? status, DAEMON_EVENT_CATEGORY_WIDTH);
}

function formatDaemonEventMessage(
  snapshot: TuiSubprocessSnapshot,
  event: TuiDaemonEventSnapshot,
): string {
  const parts = [
    event.message === undefined || event.message.trim().length === 0 ? undefined : event.message.trim(),
    event.goalId === undefined ? undefined : shortGoalId(event.goalId),
    formatAttemptDetails(event),
    formatExitDetails(event),
    event.errorMessage ?? snapshot.stderr[snapshot.stderr.length - 1],
  ].filter((part): part is string => part !== undefined && part.length > 0);

  return truncateTail(parts.join(" "), 52);
}

function formatAttemptDetails(event: TuiDaemonEventSnapshot): string | undefined {
  if (event.attempt === undefined && event.maxRetries === undefined) {
    return undefined;
  }

  return `${event.attempt ?? "-"}/${event.maxRetries ?? "-"}`;
}

function formatExitDetails(event: TuiDaemonEventSnapshot): string | undefined {
  return event.exitCode === undefined ? undefined : `exit ${event.exitCode}`;
}

function getDaemonEventColor(status: TuiDaemonEventStatus): string {
  if (status === "failed") {
    return BaseColors.brandRed;
  }
  if (status === "completed") {
    return BaseColors.brandGreen;
  }
  if (status === "skipped" || status === "exhausted") {
    return BaseColors.brandYellow;
  }
  if (status === "processing" || status === "codifying" || status === "starting" || status === "stopping") {
    return BaseColors.brandBlue;
  }

  return BaseColors.shade4;
}

function getLatestDaemonActivityEvent(
  snapshot: TuiSubprocessSnapshot,
): TuiDaemonEventSnapshot | undefined {
  return snapshot.events[snapshot.events.length - 1];
}

function shortGoalId(goalId: string | undefined): string {
  if (goalId === undefined) {
    return "-";
  }
  return goalId.length > 8 ? goalId.slice(0, 8) : goalId;
}

function nextAgentConfig(config: TuiDaemonConfig): TuiDaemonConfig {
  const currentIndex = AGENT_OPTIONS.indexOf(config.agentId as typeof AGENT_OPTIONS[number]);
  const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % AGENT_OPTIONS.length;
  return { ...config, agentId: AGENT_OPTIONS[nextIndex] };
}

function nextPollConfig(config: TuiDaemonConfig): TuiDaemonConfig {
  const currentIndex = POLL_INTERVAL_OPTIONS_MS.indexOf(config.pollIntervalMs as typeof POLL_INTERVAL_OPTIONS_MS[number]);
  const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % POLL_INTERVAL_OPTIONS_MS.length;
  return { ...config, pollIntervalMs: POLL_INTERVAL_OPTIONS_MS[nextIndex] };
}

function nextRetryConfig(config: TuiDaemonConfig): TuiDaemonConfig {
  const currentIndex = RETRY_OPTIONS.indexOf(config.maxRetries as typeof RETRY_OPTIONS[number]);
  const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % RETRY_OPTIONS.length;
  return { ...config, maxRetries: RETRY_OPTIONS[nextIndex] };
}

function nextDaemonConfigs(
  configs: TuiDaemonConfigs,
  selectedDaemon: TuiDaemonName,
  nextConfig: (config: TuiDaemonConfig) => TuiDaemonConfig,
): TuiDaemonConfigs {
  return {
    ...configs,
    [selectedDaemon]: nextConfig(configs[selectedDaemon]),
  };
}

function truncateTail(text: string, max = 35): string {
  return text.length <= max ? text : text.slice(0, max - 3) + "...";
}

export function getCodifierFrame(index: number): string[] {
  if (index < 0 || index >= CODIFIER_FRAME_COUNT) {
    return ["error"];
  }

  const random = createSeededRandom(createSeed(
    index + CODIFIER_FRAME_COUNT,
    DAEMON_PANEL_CONTENT_WIDTH * CODIFIER_GRID_HEIGHT,
  ));

  return Array.from({ length: CODIFIER_GRID_HEIGHT }, () => {
    const groups = new Set<string>();

    while (groups.size < CODIFIER_ROW_REPEAT_COUNT) {
      groups.add(
        Array.from({ length: CODIFIER_GROUP_LENGTH }, () =>
          pickRandomValue(CODIFIER_ALPHANUMERIC_GLYPHS, random)
        ).join("")
      );
    }

    return Array.from(groups).map((group) => `${group}.`).join("");
  });
}

export function getReviewerFrame(
  index: number,
  glyphPalette: GlyphPalette,
): GlyphCell[][] {
  return getRandomGlyphFrame(index, glyphPalette, REVIEWER_GLYPH_FRAME_CONFIG);
}

function getRefinerFrame(
  index: number,
  glyphPalette: GlyphPalette,
): GlyphCell[][] {
  return getRandomGlyphFrame(index, glyphPalette, REFINER_GLYPH_FRAME_CONFIG);
}

function getRandomGlyphFrame(
  index: number,
  glyphPalette: GlyphPalette,
  config: RandomGlyphFrameConfig,
): GlyphCell[][] {
  if (index < 0 || index >= config.frameCount) {
    return [[{ glyph: "error", color: DEFAULT_CODIFIER_GLYPH_STYLE.color }]];
  }

  const glyphGrid = createRandomGlyphGrid(index, glyphPalette, config);

  return Array.from({ length: config.gridHeight }, (_, rowIndex) => {
    const start = rowIndex * config.gridWidth;
    return glyphGrid.slice(start, start + config.gridWidth);
  });
}

function getGlyphCellSegments(
  line: readonly GlyphCell[],
  snapshot: TuiSubprocessSnapshot,
): Array<{ text: string; color: string }> {
  const segments: Array<{ text: string; color: string }> = [];

  for (const cell of line) {
    const color = getDaemonGlyphColor(snapshot, cell.color);
    const previousSegment = segments[segments.length - 1];

    if (previousSegment !== undefined && previousSegment.color === color) {
      previousSegment.text += cell.glyph;
      continue;
    }

    segments.push({ text: cell.glyph, color });
  }

  return segments;
}

function getStyledGlyphSegments(
  line: string,
  glyphColors: GlyphColorMap,
  snapshot: TuiSubprocessSnapshot,
): Array<GlyphStyle & { text: string }> {
  const segments: Array<GlyphStyle & { text: string }> = [];

  for (const character of line) {
    const glyphStyle = getGlyphStyle(character, glyphColors, snapshot);
    const previousSegment = segments[segments.length - 1];

    if (
      previousSegment !== undefined
      && previousSegment.color === glyphStyle.color
      && previousSegment.dimColor === glyphStyle.dimColor
    ) {
      previousSegment.text += character;
      continue;
    }

    segments.push({
      text: character,
      color: glyphStyle.color,
      dimColor: glyphStyle.dimColor,
    });
  }

  return segments;
}

function getGlyphStyle(
  character: string,
  glyphColors: GlyphColorMap,
  snapshot: TuiSubprocessSnapshot,
): GlyphStyle {
  const color = glyphColors[character];

  if (color === undefined) {
    return {
      ...DEFAULT_CODIFIER_GLYPH_STYLE,
      color: getDaemonGlyphColor(snapshot, DEFAULT_CODIFIER_GLYPH_STYLE.color),
    };
  }

  return { color: getDaemonGlyphColor(snapshot, color) };
}

function getDaemonGlyphColor(
  snapshot: TuiSubprocessSnapshot,
  animatedColor: string,
): string {
  return snapshot.status === "running" ? animatedColor : BaseColors.shade6;
}

function createRandomGlyphGrid(
  frameIndex: number,
  glyphPalette: GlyphPalette,
  config: RandomGlyphFrameConfig,
): GlyphCell[] {
  const gridSize = config.gridWidth * config.gridHeight;
  const random = createSeededRandom(createSeed(frameIndex, gridSize));

  return Array.from({ length: gridSize }, () => ({
    glyph: pickRandomValue(config.glyphs, random),
    color: pickRandomValue(glyphPalette, random),
  }));
}

function createSeed(frameIndex: number, gridSize: number): number {
  return (frameIndex + 1) * 1009 + gridSize * 9176;
}

function createSeededRandom(seed: number): () => number {
  let state = seed >>> 0;

  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

function pickRandomValue<T>(values: readonly T[], random: () => number): T {
  return values[Math.floor(random() * values.length)];
}
