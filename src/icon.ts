import type { MuiIconComponentName } from "./MuiIconComponentName";

/** The identity function that only accept valid icon name as parameter */
export function icon<IconName extends MuiIconComponentName>(iconName: IconName): IconName {
    return iconName;
}
