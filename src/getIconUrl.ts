import { capitalize } from "tsafe/capitalize";
import { muiComponentNameToFileName } from "./muiComponentNameToFileName";
import type { ICONS_DIR_BASENAME as ofType_ICONS_DIR_BASENAME } from "./bin/constants";
import { id } from "tsafe/id";
import { MuiIconComponentName } from "./MuiIconComponentName";
import { is } from "tsafe";
import { assert } from "tsafe/assert";

export function createGetIconUrl(params: { BASE_URL: string }) {
    const { BASE_URL } = params;

    function getIconUrlByName(muiIconComponentName: MuiIconComponentName): string {
        return `${BASE_URL.replace(/^\/?/, "/").replace(/\/?$/, "/")}${id<typeof ofType_ICONS_DIR_BASENAME>("mui-icons-material")}/${muiComponentNameToFileName(muiIconComponentName)}`;
    }

    function getIconUrl(muiComponentNameOrUrl: string): string;
    function getIconUrl(muiComponentNameOrUrl: string | undefined): string | undefined;
    function getIconUrl(muiComponentNameOrUrl: string | undefined): string | undefined {
        if (muiComponentNameOrUrl === undefined) {
            return undefined;
        }

        if (
            muiComponentNameOrUrl.startsWith("http") ||
            muiComponentNameOrUrl.startsWith("/") ||
            muiComponentNameOrUrl.endsWith(".svg") ||
            muiComponentNameOrUrl.startsWith("data:image/svg")
        ) {
            return muiComponentNameOrUrl;
        }

        // NOTE: We capitalize in case the user got confused and passed a non capitalized name.
        // This is a noop if the name is already capitalized.
        const muiComponentName = capitalize(muiComponentNameOrUrl);

        // NOTE: We can't actually check that this is true because there is a ton of icons
        // and it would drastically increase the bundle size.
        assert(is<MuiIconComponentName>(muiComponentName));

        return getIconUrlByName(muiComponentName);
    }

    return { getIconUrlByName, getIconUrl };
}
