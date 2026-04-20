/**
 * Refinery Display
 *
 * Display module for the `jumbo work refine` daemon.
 * Extends DaemonDisplay with refine-specific labels.
 */

import { DaemonDisplay, DaemonRuntimeConfig } from "../shared/DaemonDisplay.js";

export class RefineryDisplay extends DaemonDisplay {
  constructor(runtimeConfig: DaemonRuntimeConfig) {
    super(
      {
        title: "Jumbo Refinery",
        idleLabel: "foraging",
        activeLabel: "refining",
        completeStatus: "refined",
        daemonName: "Refinery",
      },
      runtimeConfig,
    );
  }
}
