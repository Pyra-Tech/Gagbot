import { getChastity } from "../../getters/chastity/getChastity.js";

/*******
 * Removes a cloned key from a chastity belt
 * 
 * - (user id) chastityuser - The user wearing the chastity belt
 * - (user id) newKeyholder - The user to remove from the cloned key list
 * ---
 * ##### *No return value*
 *******/
export function revokeChastityKey(chastityuser, newKeyholder) {
    let chastity = getChastity(chastityuser);
    if (!chastity.clonedKeyholders) {
        chastity.clonedKeyholders = [];
    }
    if (chastity.clonedKeyholders.includes(newKeyholder)) {
        chastity.clonedKeyholders.splice(chastity.clonedKeyholders.indexOf(newKeyholder), 1);
    }
    if (process.readytosave == undefined) {
        process.readytosave = {};
    }
    process.readytosave.chastity = true;
};