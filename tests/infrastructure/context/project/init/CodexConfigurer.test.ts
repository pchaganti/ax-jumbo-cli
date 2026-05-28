/**
 * Tests for CodexConfigurer infrastructure implementation
 */

import fs from "fs-extra";
import * as path from "path";
import os from "os";
import { CodexConfigurer } from "../../../../../src/infrastructure/context/project/init/CodexConfigurer";
import { jest } from "@jest/globals";

jest.setTimeout(30_000);

describe("CodexConfigurer", () => {
  let tmpDir: string;
  const configurer = new CodexConfigurer();

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "test-codex-configurer-"));
  });

  afterEach(async () => {
    await fs.remove(tmpDir);
  });

  describe("agent", () => {
    it("should have the correct agent identity", () => {
      expect(configurer.agent).toEqual({ id: "codex", name: "Codex" });
    });
  });

  describe("skillPlatforms", () => {
    it("should declare .codex/skills as the skill platform", () => {
      expect(configurer.skillPlatforms).toEqual([".codex/skills"]);
    });
  });

  describe("configure()", () => {
    it("should create .codex/hooks.json with Codex lifecycle hooks using text output", async () => {
      await configurer.configure(tmpDir);

      const hooksPath = path.join(tmpDir, ".codex", "hooks.json");
      expect(await fs.pathExists(hooksPath)).toBe(true);

      const hooks = JSON.parse(await fs.readFile(hooksPath, "utf-8"));

      expect(hooks).toEqual({
        hooks: {
          PreCompact: [
            {
              matcher: "auto",
              hooks: [
                {
                  type: "command",
                  command: "jumbo work pause --format text",
                },
              ],
            },
          ],
          SessionStart: [
            {
              matcher: "startup",
              hooks: [
                {
                  type: "command",
                  command: "jumbo session start --format text",
                },
              ],
            },
            {
              matcher: "compact",
              hooks: [
                {
                  type: "command",
                  command: "jumbo work resume --format text",
                },
              ],
            },
          ],
        },
      });
    });

    it("should preserve user hooks while replacing stale Jumbo commands", async () => {
      const hooksPath = path.join(tmpDir, ".codex", "hooks.json");
      await fs.ensureDir(path.join(tmpDir, ".codex"));
      await fs.writeFile(
        hooksPath,
        JSON.stringify(
          {
            hooks: {
              SessionStart: [
                {
                  matcher: "startup",
                  hooks: [
                    { type: "command", command: "echo user startup" },
                    { type: "command", command: "jumbo session start" },
                  ],
                },
                {
                  matcher: "compact",
                  hooks: [
                    { type: "command", command: "jumbo work resume" },
                  ],
                },
              ],
              PreCompact: [
                {
                  matcher: "auto",
                  hooks: [
                    { type: "command", command: "echo user compact" },
                    { type: "command", command: "jumbo work pause" },
                  ],
                },
              ],
              Stop: [
                {
                  matcher: "*",
                  hooks: [
                    { type: "command", command: "echo stop" },
                  ],
                },
              ],
            },
          },
          null,
          2
        ),
        "utf-8"
      );

      await configurer.configure(tmpDir);

      const hooks = JSON.parse(await fs.readFile(hooksPath, "utf-8"));
      expect(hooks.hooks.SessionStart).toEqual([
        {
          matcher: "startup",
          hooks: [
            { type: "command", command: "echo user startup" },
            { type: "command", command: "jumbo session start --format text" },
          ],
        },
        {
          matcher: "compact",
          hooks: [
            { type: "command", command: "jumbo work resume --format text" },
          ],
        },
      ]);
      expect(hooks.hooks.PreCompact).toEqual([
        {
          matcher: "auto",
          hooks: [
            { type: "command", command: "echo user compact" },
            { type: "command", command: "jumbo work pause --format text" },
          ],
        },
      ]);
      expect(hooks.hooks.Stop[0].hooks[0].command).toBe("echo stop");
    });

    it("should not duplicate Jumbo hooks across repeated configuration", async () => {
      await configurer.configure(tmpDir);
      await configurer.configure(tmpDir);

      const hooksPath = path.join(tmpDir, ".codex", "hooks.json");
      const hooks = JSON.parse(await fs.readFile(hooksPath, "utf-8"));

      expect(hooks.hooks.SessionStart[0].hooks).toHaveLength(1);
      expect(hooks.hooks.SessionStart[1].hooks).toHaveLength(1);
      expect(hooks.hooks.PreCompact[0].hooks).toHaveLength(1);
    });

    it("should handle errors gracefully without throwing", async () => {
      const invalidPath = path.join(tmpDir, "nonexistent", "deeply", "nested");
      await expect(configurer.configure(invalidPath)).resolves.not.toThrow();
    });
  });

  describe("repair()", () => {
    it("should replace stale Jumbo commands", async () => {
      const hooksPath = path.join(tmpDir, ".codex", "hooks.json");
      await fs.ensureDir(path.join(tmpDir, ".codex"));
      await fs.writeFile(
        hooksPath,
        JSON.stringify({
          hooks: {
            SessionStart: [
              {
                matcher: "startup",
                hooks: [
                  { type: "command", command: "jumbo session start" },
                ],
              },
            ],
          },
        }),
        "utf-8"
      );

      await configurer.repair!(tmpDir);

      const hooks = JSON.parse(await fs.readFile(hooksPath, "utf-8"));
      expect(hooks.hooks.SessionStart[0].hooks).toEqual([
        { type: "command", command: "jumbo session start --format text" },
      ]);
    });
  });

  describe("getPlannedFileChanges()", () => {
    it("should return planned changes for the Codex hooks file", async () => {
      const changes = await configurer.getPlannedFileChanges(tmpDir);

      expect(changes).toEqual([
        {
          path: ".codex/hooks.json",
          action: "create",
          description: "Add Codex lifecycle hooks using text-mode Jumbo output",
        },
      ]);
    });

    it("should report modify action when hooks file already exists", async () => {
      await configurer.configure(tmpDir);

      const changes = await configurer.getPlannedFileChanges(tmpDir);

      expect(changes[0].action).toBe("modify");
    });
  });
});
