import { getChastityBra } from "./getChastityBra.js";

/*********
 * Gets a list of users with secondary key access to the user's chastity bra.
 * 
 * - (user id) userID - The User ID wearing the collar
 * ---
 * ##### Returns an array of user IDs with secondary access to this collar.
 *********/
export function getClonedChastityBraKey(userID) {
	return getChastityBra(userID)?.clonedKeyholders ?? [];
}; 