import { capitalize } from "tsafe/capitalize";
import { muiComponentNameToFileName } from "./muiComponentNameToFileName";

export function createGetIconUrl(params: { BASE_URL: string }) {
    const { BASE_URL } = params;

    function getIconUrl(iconName: string) {
        return `${BASE_URL.replace(/\/$/, "/")}onyxia-ui-icons/${muiComponentNameToFileName(
            // NOTE: All Mui component names are capitalized.
            // So if the user got confused we don't want to choke on it.
            capitalize(iconName)
        )}`;
    }

    return getIconUrl;
}
