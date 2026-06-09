import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const execFileMock = jest.fn();

jest.unstable_mockModule("node:child_process", () => ({
  execFile: execFileMock,
}));

const { NpmPackageUpgradeGateway } = await import(
  "../../../../src/infrastructure/cli-metadata/update/NpmPackageUpgradeGateway.js"
);
const { CliUpdateFailureReason } = await import(
  "../../../../src/application/cli-metadata/update/CliUpdateFailureReason.js"
);

describe("NpmPackageUpgradeGateway", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "jumbo-upgrade-"));
    execFileMock.mockReset();
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("reports self-upgrade feasible for a global npm package install", async () => {
    const packageRoot = path.join(tmpDir, "node_modules", "jumbo-cli");
    const entryPointPath = path.join(packageRoot, "dist", "cli.js");
    fs.mkdirSync(path.dirname(entryPointPath), { recursive: true });
    fs.writeFileSync(
      path.join(packageRoot, "package.json"),
      JSON.stringify({ name: "jumbo-cli" }),
    );
    fs.writeFileSync(entryPointPath, "");
    execFileMock.mockImplementation((_command, _args, _options, callback) => {
      callback(null, path.join(tmpDir, "node_modules"), "");
    });

    const gateway = new NpmPackageUpgradeGateway(entryPointPath);

    await expect(gateway.evaluate()).resolves.toMatchObject({
      feasible: true,
      args: ["install", "-g", "jumbo-cli@latest"],
    });
  });

  it("reports self-upgrade feasible when the entry point is reached through a symlinked package directory", async () => {
    const packageRoot = path.join(tmpDir, "node_modules", "jumbo-cli");
    const linkRoot = path.join(tmpDir, "bin", "jumbo-cli-link");
    const entryPointPath = path.join(linkRoot, "dist", "cli.js");
    fs.mkdirSync(path.join(packageRoot, "dist"), { recursive: true });
    fs.mkdirSync(path.dirname(linkRoot), { recursive: true });
    fs.writeFileSync(
      path.join(packageRoot, "package.json"),
      JSON.stringify({ name: "jumbo-cli" }),
    );
    fs.writeFileSync(path.join(packageRoot, "dist", "cli.js"), "");
    fs.symlinkSync(packageRoot, linkRoot, "junction");
    execFileMock.mockImplementation((_command, _args, _options, callback) => {
      callback(null, path.join(tmpDir, "node_modules"), "");
    });

    const gateway = new NpmPackageUpgradeGateway(entryPointPath);

    await expect(gateway.evaluate()).resolves.toMatchObject({
      feasible: true,
      args: ["install", "-g", "jumbo-cli@latest"],
    });
  });

  it("reports self-upgrade feasible when launched through an npm command shim", async () => {
    const packageRoot = path.join(tmpDir, "node_modules", "jumbo-cli");
    const shimPath = path.join(tmpDir, "jumbo.cmd");
    fs.mkdirSync(path.join(packageRoot, "dist"), { recursive: true });
    fs.writeFileSync(
      path.join(packageRoot, "package.json"),
      JSON.stringify({ name: "jumbo-cli" }),
    );
    fs.writeFileSync(path.join(packageRoot, "dist", "cli.js"), "");
    fs.writeFileSync(
      shimPath,
      '@ECHO off\r\nnode "%~dp0\\node_modules\\jumbo-cli\\dist\\cli.js" %*\r\n',
    );
    execFileMock.mockImplementation((_command, _args, _options, callback) => {
      callback(null, path.join(tmpDir, "node_modules"), "");
    });

    const gateway = new NpmPackageUpgradeGateway(shimPath);

    await expect(gateway.evaluate()).resolves.toMatchObject({
      feasible: true,
      args: ["install", "-g", "jumbo-cli@latest"],
    });
  });

  it("reports self-upgrade feasible when launched through a shim in a symlinked bin directory", async () => {
    const packageRoot = path.join(tmpDir, "node_modules", "jumbo-cli");
    const realBinRoot = path.join(tmpDir, "real-bin");
    const linkBinRoot = path.join(tmpDir, "bin");
    const shimPath = path.join(realBinRoot, "jumbo.cmd");
    const shimLinkPath = path.join(linkBinRoot, "jumbo.cmd");
    fs.mkdirSync(path.join(packageRoot, "dist"), { recursive: true });
    fs.mkdirSync(realBinRoot, { recursive: true });
    fs.writeFileSync(
      path.join(packageRoot, "package.json"),
      JSON.stringify({ name: "jumbo-cli" }),
    );
    fs.writeFileSync(path.join(packageRoot, "dist", "cli.js"), "");
    fs.writeFileSync(
      shimPath,
      '@ECHO off\r\nnode "%~dp0\\..\\node_modules\\jumbo-cli\\dist\\cli.js" %*\r\n',
    );
    fs.symlinkSync(realBinRoot, linkBinRoot, "junction");
    execFileMock.mockImplementation((_command, _args, _options, callback) => {
      callback(null, path.join(tmpDir, "node_modules"), "");
    });

    const gateway = new NpmPackageUpgradeGateway(shimLinkPath);

    await expect(gateway.evaluate()).resolves.toMatchObject({
      feasible: true,
      args: ["install", "-g", "jumbo-cli@latest"],
    });
  });

  it("reports manual guidance when the package is not globally installed", async () => {
    const packageRoot = path.join(tmpDir, "checkout");
    const entryPointPath = path.join(packageRoot, "dist", "cli.js");
    fs.mkdirSync(path.dirname(entryPointPath), { recursive: true });
    fs.writeFileSync(
      path.join(packageRoot, "package.json"),
      JSON.stringify({ name: "jumbo-cli" }),
    );
    fs.writeFileSync(entryPointPath, "");
    execFileMock.mockImplementation((_command, _args, _options, callback) => {
      callback(null, path.join(tmpDir, "node_modules"), "");
    });

    const gateway = new NpmPackageUpgradeGateway(entryPointPath);

    await expect(gateway.evaluate()).resolves.toMatchObject({
      feasible: false,
      reason: CliUpdateFailureReason.SelfUpgradeUnavailable,
      guidance: "Run npm install -g jumbo-cli@latest",
    });
  });

  it("runs npm install for upgrade attempts", async () => {
    execFileMock.mockImplementation((_command, _args, _options, callback) => {
      callback(null, "", "");
    });
    const gateway = new NpmPackageUpgradeGateway("");

    await expect(gateway.upgrade("1.3.0")).resolves.toMatchObject({
      ok: true,
    });
    expect(execFileMock).toHaveBeenCalledWith(
      expect.stringMatching(/^npm/),
      ["install", "-g", "jumbo-cli@1.3.0"],
      expect.objectContaining({ timeout: expect.any(Number) }),
      expect.any(Function),
    );
  });

  it("returns manual guidance when npm install fails", async () => {
    execFileMock.mockImplementation((_command, _args, _options, callback) => {
      callback(new Error("denied"), "", "");
    });
    const gateway = new NpmPackageUpgradeGateway("");

    await expect(gateway.upgrade("1.3.0")).resolves.toMatchObject({
      ok: false,
      reason: CliUpdateFailureReason.UpgradeFailed,
      guidance: "Run npm install -g jumbo-cli@latest",
    });
  });
});
