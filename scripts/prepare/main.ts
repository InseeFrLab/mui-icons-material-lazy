import { downloadMaterialIcons } from "./downloadMaterialIcons";
import { getProjectRoot } from "../tools/getProjectRoot";
import { join as pathJoin } from "path";
import { generateTypeDefinition } from "./generateTypeDefinition";

(async () => {
    const start = Date.now();
    console.log("Downloading material icons...");

    const iconsDirPath = pathJoin(getProjectRoot(), "icons");

    await downloadMaterialIcons({
        destDirPath: iconsDirPath
    });

    console.log(`Material icons downloaded in ${Date.now() - start}ms`);

    generateTypeDefinition({
        iconsDirPath,
        targetTsFilePath: pathJoin(getProjectRoot(), "src", "MuiIconComponentName.d.ts")
    });
})();
