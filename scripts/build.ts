import { join as pathJoin } from "path";
import chalk from "chalk";
import { getProjectRoot } from "./tools/getProjectRoot";
import { cleanup } from "./shared/cleanup";
import { run } from "./shared/run";

console.log(chalk.cyan(`Building @onyxia-ui/icons...`));

const startTime = Date.now();

const distDirPath = pathJoin(getProjectRoot(), "dist");

cleanup({ distDirPath });

run("npx tsc", { cwd: getProjectRoot() });

console.log(chalk.green(`✓ built in ${((Date.now() - startTime) / 1000).toFixed(2)}s`));
