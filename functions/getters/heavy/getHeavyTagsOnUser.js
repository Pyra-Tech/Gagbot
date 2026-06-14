import { getBaseHeavy } from "./getBaseHeavy.js";
import { getHeavyList } from "./getHeavyList.js";

/*********
 * Gets a list of heavy tags affecting a user
 * 
 * - (user id) user - The user wearing the heavy bondage
 * ---
 * ##### Returns an array of "arms", "legs", or "container"
 *********/
export function getHeavyTagsOnUser(user) {
    if (getHeavyList(user) == undefined) {
        return []; // They're not bound by anything lol
    }
    else {
        let tags = [];
        getHeavyList(user).forEach((heavy) => {
            getBaseHeavy(heavy.type).heavytags.forEach((t) => {
                tags.push(t);
            })
        })
        return tags;
    }
}