import * as path from "path";
import * as fs from "fs";
import { IProjectRootResolver } from "../../../application/context/project/IProjectRootResolver.js";

export class ProjectRootResolver implements IProjectRootResolver {
  resolve(): string {
    const dir = process.cwd();
    const candidate = path.join(dir, ".jumbo");

    if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
      return dir;
    }

    throw new Error(
      "No Jumbo project found. Run `jumbo project init` from your project root."
    );
  }

  resolveOrDefault(): string {
    try {
      return this.resolve();
    } catch {
      return process.cwd();
    }
  }
}
