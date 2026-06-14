import { getBaseHeavy } from "./getBaseHeavy.js";

/*********
 * Get a Heavy Bondage's denial coefficient
 * 
 * - (string) type - The item ID of the heavy
 * ---
 * ##### Returns the number representing that heavy bondage's denial coefficient
 *********/
export function getHeavyDenialCoefficient(type) {
    return getBaseHeavy(type)?.denialCoefficient;
}

export const heavyDenialCoefficient = getHeavyDenialCoefficient;