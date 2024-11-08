import { readReactSpaPublicDirPath } from "./tools/readReactSpaPublicDirPath";
import * as fs from "fs";
import { join as pathJoin } from "path";
import { ICONS_DIR_BASENAME } from "./constants";
import { getThisCodebaseRootDirPath } from "./tools/getThisCodebaseRootDirPath";
import { readThisNpmPackageVersion } from "./tools/readThisNpmPackageVersion";
import { z } from "zod";
import { assert, type Equals } from "tsafe/assert";
import { is } from "tsafe/is";
import { transformCodebase } from "./tools/transformCodebase";
import { id } from "tsafe/id";

export async function command(params: { projectDirPath: string }): Promise<void> {
    const { projectDirPath } = params;

    const publicDirPath = await readReactSpaPublicDirPath({ projectDirPath });

    const iconDirPath_dest = pathJoin(publicDirPath, ICONS_DIR_BASENAME);

    const version = readThisNpmPackageVersion();

    const readIconCount = () =>
        fs.readdirSync(iconDirPath_dest).filter(basename => basename.endsWith(".svg")).length;

    skip_condition: {
        if (!fs.existsSync(iconDirPath_dest)) {
            break skip_condition;
        }

        const metaPath = pathJoin(iconDirPath_dest, "meta.json");

        if (!fs.existsSync(metaPath)) {
            break skip_condition;
        }

        const meta = (() => {
            let meta: unknown;

            {
                const content = fs.readFileSync(metaPath).toString("utf8");

                try {
                    meta = JSON.parse(content);
                } catch {
                    return undefined;
                }
            }

            try {
                zMeta.parse(meta);
            } catch {
                return undefined;
            }

            assert(is<Meta>(meta));

            return meta;
        })();

        if (meta === undefined) {
            break skip_condition;
        }

        if (meta.version !== version) {
            break skip_condition;
        }

        if (readIconCount() !== meta.iconCount) {
            break skip_condition;
        }

        return;
    }

    if (!fs.existsSync(iconDirPath_dest)) {
        fs.mkdirSync(iconDirPath_dest, { recursive: true });
    }

    fs.writeFileSync(pathJoin(iconDirPath_dest, ".gitignore"), "*");

    const iconDirPath_src = pathJoin(getThisCodebaseRootDirPath(), ICONS_DIR_BASENAME);

    transformCodebase({
        srcDirPath: iconDirPath_src,
        destDirPath: iconDirPath_dest
    });

    fs.writeFileSync(
        pathJoin(iconDirPath_dest, "meta.json"),
        JSON.stringify(
            id<Meta>({
                version,
                iconCount: readIconCount()
            }),
            null,
            2
        )
    );
}

type Meta = {
    version: string;
    iconCount: number;
};

const zMeta = (() => {
    type TargetType = Meta;

    const zTargetType = z.object({
        version: z.string(),
        iconCount: z.number()
    });

    type Got = z.infer<typeof zTargetType>;

    assert<Equals<Got, TargetType>>();

    return id<z.ZodSchema<Meta>>(zTargetType);
})();
