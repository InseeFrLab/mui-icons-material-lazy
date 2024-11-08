import { downloadMaterialIcons } from "./downloadMaterialIcons";
import { getThisCodebaseRootDirPath } from "../../src/bin/tools/getThisCodebaseRootDirPath";
import { join as pathJoin } from "path";
import { generateTypeDefinition } from "./generateTypeDefinition";
import { ICONS_DIR_BASENAME } from "../shared/constants";

(async () => {
    const start = Date.now();
    console.log("Downloading material icons...");

    const iconsDirPath = pathJoin(getThisCodebaseRootDirPath(), ICONS_DIR_BASENAME);

    await downloadMaterialIcons({
        destDirPath: iconsDirPath
    });

    console.log(`Material icons downloaded in ${Date.now() - start}ms`);

    generateTypeDefinition({
        iconsDirPath,
        targetTsFilePath: pathJoin(getThisCodebaseRootDirPath(), "src", "MuiIconComponentName.d.ts")
    });
})();
