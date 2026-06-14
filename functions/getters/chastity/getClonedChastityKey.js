import { getChastity } from "./getChastity.js";

/*********
 * Gets a list of users with secondary key access to the user's chastity belt.
 * 
 * - (user id) userID - The User ID wearing the collar
 * ---
 * ##### Returns an array of user IDs with secondary access to this collar.
 *********/
export function getClonedChastityKey(userID) {
	return getChastity(userID)?.clonedKeyholders ?? [];
}; 