import { join as pathJoin } from "path";
import chalk from "chalk";
import { getProjectRoot } from "./tools/getProjectRoot";
import { cleanup } from "./shared/cleanup";
import { run } from "./shared/run";
import { transformCodebase } from "./tools/transformCodebase";
import { ICONS_DIR_BASENAME } from "./shared/constants";
import * as fs from "fs";

console.log(chalk.cyan(`Building @onyxia-ui/icons...`));

const startTime = Date.now();

const distDirPath = pathJoin(getProjectRoot(), "dist");

cleanup({ distDirPath });

run("npx tsc", { cwd: getProjectRoot() });

transformCodebase({
    srcDirPath: pathJoin(getProjectRoot(), ICONS_DIR_BASENAME),
    destDirPath: pathJoin(distDirPath, ICONS_DIR_BASENAME)
});

{
    let modifiedPackageJsonContent = fs
        .readFileSync(pathJoin(getProjectRoot(), "package.json"))
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
