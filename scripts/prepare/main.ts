import { downloadMaterialIcons } from "./downloadMaterialIcons";
import { getProjectRoot } from "../tools/getProjectRoot";
import { join as pathJoin } from "path";
import { generateTypeDefinition } from "./generateTypeDefinition";
import { ICONS_DIR_BASENAME } from "../shared/constants";

(async () => {
    const start = Date.now();
    console.log("Downloading material icons...");

    const iconsDirPath = pathJoin(getProjectRoot(), ICONS_DIR_BASENAME);

    await downloadMaterialIcons({
        destDirPath: iconsDirPath
    });

    console.log(`Material icons downloaded in ${Date.now() - start}ms`);

    generateTypeDefinition({
        iconsDirPath,
        targetTsFilePath: pathJoin(getProjectRoot(), "src", "MuiIconComponentName.d.ts")
    });
})();
