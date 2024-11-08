import { join as pathJoin } from "path";
import * as fs from "fs";
import { getThisCodebaseRootDirPath } from "../../src/bin/tools/getThisCodebaseRootDirPath";
import { downloadAndUnzip } from "../tools/downloadAndUnzip";
import { transformCodebase } from "../../src/bin/tools/transformCodebase";

export async function downloadMaterialIcons(params: { destDirPath: string }) {
    const { destDirPath: materialIconsDirPath } = params;

    if (fs.existsSync(materialIconsDirPath)) {
        fs.rmSync(materialIconsDirPath, { recursive: true, force: true });
    }
    fs.mkdirSync(materialIconsDirPath, { recursive: true });

    const version = "5.14.15";

    await downloadAndUnzip({
        "url": `https://github.com/mui/material-ui/archive/refs/tags/v${version}.zip`,
        destDirPath: materialIconsDirPath,
        specificDirsToExtract: [`material-ui-${version}/packages/mui-icons-material/material-icons`],
        doUseCache: true,
        projectDirPath: getThisCodebaseRootDirPath()
    });

    transformCodebase({
        srcDirPath: pathJoin(__dirname, "extra-icons"),
        destDirPath: materialIconsDirPath
    });
}
