import { capitalize } from "tsafe/capitalize";
import { muiComponentNameToFileName } from "./muiComponentNameToFileName";
import type { ICONS_DIR_BASENAME as ofType_ICONS_DIR_BASENAME } from "./bin/constants";
import { id } from "tsafe/id";

export function createGetIconUrl(params: { BASE_URL: string }) {
    const { BASE_URL } = params;

    function getIconUrl(iconName: string) {
        return `${BASE_URL.replace(/\/$/, "/")}${id<typeof ofType_ICONS_DIR_BASENAME>("onyxia-ui-icons")}/${muiComponentNameToFileName(
            // NOTE: All Mui component names are capitalized.
            // So if the user got confused we don't want to choke on it.
            capitalize(iconName)
        )}`;
    }

    return getIconUrl;
}
