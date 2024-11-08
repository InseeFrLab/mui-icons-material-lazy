import { readReactSpaPublicDirPath } from "./tools/readReactSpaPublicDirPath";

export async function command(params: { projectDirPath: string }): Promise<void> {
    const { projectDirPath } = params;

    const publicDirPath = await readReactSpaPublicDirPath({ projectDirPath });
}
