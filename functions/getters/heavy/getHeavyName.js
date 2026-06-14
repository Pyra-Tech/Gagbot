import { heavytypes } from "../../heavyfunctions.js";

/**********
 * Gets the heavy bondage full name from its item ID
 * 
 * - (string) type - The string item ID to search
 * ---
 * ##### Returns a string with the heavy bondage's name
 **********/
export function getHeavyName(type) {
    return heavytypes.find((h) => h.value === type)?.name
}
// The original function that is mostly in use for this is convertheavy. 
// We should refactor that sometime.
export const convertheavy = getHeavyName;