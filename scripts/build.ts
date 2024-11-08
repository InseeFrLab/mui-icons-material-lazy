import * as fs from "fs";
import { join as pathJoin } from "path";
import { transformCodebase } from "../src/bin/tools/transformCodebase";
import chalk from "chalk";
import { run } from "./shared/run";
import { cleanup } from "./shared/cleanup";
import { getThisCodebaseRootDirPath } from "../src/bin/tools/getThisCodebaseRootDirPath";
import { ICONS_DIR_BASENAME } from "../src/bin/constants";

(async () => {
    console.log(chalk.cyan("Building mui-icons-material-lazy..."));

    const startTime = Date.now();

    const distDirPath = pathJoin(getThisCodebaseRootDirPath(), "dist");

    cleanup({ distDirPath });

    run(`npx tsc -p ${pathJoin(getThisCodebaseRootDirPath(), "src", "bin", "tsconfig.json")}`);

    run(
        `npx ncc build ${pathJoin(distDirPath, "bin", "main.js")} -o ${pathJoin(distDirPath, "bin", "ncc_out")}`
    );

    transformCodebase({
        srcDirPath: pathJoin(distDirPath, "bin", "ncc_out"),
        destDirPath: pathJoin(distDirPath, "bin"),
        transformSourceCode: ({ fileRelativePath, sourceCode }) => {
            if (fileRelativePath === "index.js") {
                return {
                    newFileName: "main.js",
                    modifiedSourceCode: sourceCode
                };
            }

            return { modifiedSourceCode: sourceCode };
        }
    });

    fs.rmSync(pathJoin(distDirPath, "ncc_out"), { recursive: true });

    fs.chmodSync(
        pathJoin(distDirPath, "bin", "main.js"),
        fs.statSync(pathJoin(distDirPath, "bin", "main.js")).mode |
            fs.constants.S_IXUSR |
            fs.constants.S_IXGRP |
            fs.constants.S_IXOTH
    );

    run(`npx tsc -p ${pathJoin(getThisCodebaseRootDirPath(), "src", "tsconfig.json")}`);

    transformCodebase({
        srcDirPath: pathJoin(getThisCodebaseRootDirPath(), ICONS_DIR_BASENAME),
        destDirPath: pathJoin(distDirPath, ICONS_DIR_BASENAME)
    });

    console.log(chalk.green(`✓ built in ${((Date.now() - startTime) / 1000).toFixed(2)}s`));
})();
