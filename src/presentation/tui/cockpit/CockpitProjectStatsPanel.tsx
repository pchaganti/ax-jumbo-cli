import React from "react";
import { Box, Text } from "ink";
import { useProjectStats } from "../state-reading/useProjectStats.js";

export function CockpitProjectStatsPanel(): React.ReactElement {
  const projectStats = useProjectStats();
  const snapshot = projectStats.data?.snapshot;

  if (projectStats.error !== null) {
    return (
      <Box width="100%" paddingBottom={1}>
        <Text color="red">STATS// unavailable</Text>
      </Box>
    );
  }

  if (snapshot === undefined) {
    return (
      <Box width="100%" paddingBottom={1}>
        <Text color="gray">STATS// loading</Text>
      </Box>
    );
  }

  const coveragePercent = Math.round(
    snapshot.contextCoverage.goalContextCoverageRatio * 100,
  );

  return (
    <Box flexDirection="column" width="100%" paddingBottom={1}>
      <Text color="cyan">STATS//</Text>
      <Box flexDirection="row" columnGap={2} flexWrap="wrap">
        <Text>goals {snapshot.memoryCounts.goals}</Text>
        <Text>refined {snapshot.goalFlow.refinedGoalsReady}</Text>
        <Text>blocked {snapshot.goalFlow.activeBlockers}</Text>
        <Text>components {snapshot.memoryCounts.components}</Text>
        <Text>dependencies {snapshot.memoryCounts.dependencies}</Text>
        <Text>decisions {snapshot.memoryCounts.decisions}</Text>
      </Box>
      <Box flexDirection="row" columnGap={2} flexWrap="wrap">
        <Text>relations {snapshot.contextCoverage.totalRelations}</Text>
        <Text>relation types {snapshot.contextCoverage.relationTypesRepresented}</Text>
        <Text>context coverage {coveragePercent}%</Text>
        <Text>sessions {snapshot.memoryCounts.sessions}</Text>
      </Box>
    </Box>
  );
}
