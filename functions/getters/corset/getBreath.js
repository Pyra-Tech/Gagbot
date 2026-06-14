import { calcBreath } from "../../corsetfunctions.js";


/*********
 * Gets the current breath of the user
 * 
 * - (user id) user - The user wearing the corset
 * ---
 * ##### Returns the calculated breath of the user
 *********/
export function getBreath(user) {
    const corset = calcBreath(user);
    if (process.readytosave == undefined) {
        process.readytosave = {};
    }
    process.readytosave.corset = true;
    return corset.breath;
}