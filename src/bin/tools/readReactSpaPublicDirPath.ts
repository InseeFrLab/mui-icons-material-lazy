import { join as pathJoin } from "path";
import * as fs from "fs";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";
import { getThisCodebaseRootDirPath } from "./getThisCodebaseRootDirPath";

export async function readReactSpaPublicDirPath(params: { projectDirPath: string }) {
    const { projectDirPath } = params;

    const viteConfigFilePath = (() => {
        for (const ext of [".js", ".ts"]) {
            const candidateFilePath = pathJoin(projectDirPath, `vite.config${ext}`);

            if (!fs.existsSync(candidateFilePath)) {
                continue;
            }

            return candidateFilePath;
        }

        return undefined;
    })();

    const publicDirPath =
        viteConfigFilePath !== undefined
            ? await (async function getVitePublicDirPath() {
                  const viteConfig = fs.readFileSync(viteConfigFilePath).toString("utf8");

                  if (!viteConfig.includes("publicDir")) {
                      return pathJoin(projectDirPath, "public");
                  }

                  const [, afterPublicDir] = viteConfig.split(/\s["']?publicDir["']?\s*:/);

                  for (let indexEnd = 0; indexEnd < afterPublicDir.length; indexEnd++) {
                      const {
                          default: path,
                          basename,
                          dirname,
                          delimiter,
                          extname,
                          format,
                          isAbsolute,
                          join,
                          normalize,
                          parse,
                          posix,
                          relative,
                          resolve,
                          sep,
                          toNamespacedPath,
                          win32,
                          matchesGlob,
                          ...rest
                      } = await import("path");
                      assert<Equals<keyof typeof rest, never>>();

                      const part = afterPublicDir
                          .substring(0, indexEnd)
                          .replace(/__dirname/g, `"${projectDirPath}"`);

                      let candidate: string;

                      try {
                          candidate = eval(part);
                      } catch {
                          continue;
                      }

                      if (typeof candidate !== "string") {
                          continue;
                      }

                      return candidate;
                  }

                  console.error(
                      `Can't parse the vite configuration please open an issue about it ${getRepoIssueUrl()}`
                  );

                  process.exit(-1);
              })()
            : pathJoin(projectDirPath, "public");

    if (!fs.existsSync(publicDirPath)) {
        if (viteConfigFilePath === undefined) {
            console.error(
                [
                    "There is no public/ directory in the current working directory, we don't know your framework",
                    "you are not calling this script at the right location or we don't know your React framework",
                    `please submit an issue about it here ${getRepoIssueUrl()}`
                ].join(" ")
            );

            process.exit(-1);
        }

        fs.mkdirSync(publicDirPath, { recursive: true });
    }

    return publicDirPath;
}

function getRepoIssueUrl() {
    const repoUrl = JSON.parse(
        fs.readFileSync(pathJoin(getThisCodebaseRootDirPath(), "package.json")).toString("utf8")
    )
        ["repository"]["url"].replace(/^git/, "https:")
        .replace(/\.git$/, "");

    return `${repoUrl}/issues`;
}
