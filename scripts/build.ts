import { join as pathJoin } from "path";
import chalk from "chalk";
import { getThisCodebaseRootDirPath } from "../src/bin/tools/getThisCodebaseRootDirPath";
import { cleanup } from "./shared/cleanup";
import { run } from "./shared/run";
import { transformCodebase } from "./tools/transformCodebase";
import { ICONS_DIR_BASENAME } from "./shared/constants";
import * as fs from "fs";

console.log(chalk.cyan(`Building mui-icons-material-lazy...`));

const startTime = Date.now();

const distDirPath = pathJoin(getThisCodebaseRootDirPath(), "dist");

cleanup({ distDirPath });

run("npx tsc", { cwd: getThisCodebaseRootDirPath() });

transformCodebase({
    srcDirPath: pathJoin(getThisCodebaseRootDirPath(), ICONS_DIR_BASENAME),
    destDirPath: pathJoin(distDirPath, ICONS_DIR_BASENAME)
});

{
    let modifiedPackageJsonContent = fs
        .readFileSync(pathJoin(getThisCodebaseRootDirPath(), "package.json"))
        .toString("utf8");

    modifiedPackageJsonContent = (() => {
        const o = JSON.parse(modifiedPackageJsonContent);

        delete o.files;

        return JSON.stringify(o, null, 2);
    })();

    modifiedPackageJsonContent = modifiedPackageJsonContent
        .replace(/"dist\//g, '"')
        .replace(/"\.\/dist\//g, '"./')
        .replace(/"!dist\//g, '"!')
        .replace(/"!\.\/dist\//g, '"!./');

    fs.writeFileSync(
        pathJoin(distDirPath, "package.json"),
        Buffer.from(modifiedPackageJsonContent, "utf8")
    );
}

console.log(chalk.green(`✓ built in ${((Date.now() - startTime) / 1000).toFixed(2)}s`));
