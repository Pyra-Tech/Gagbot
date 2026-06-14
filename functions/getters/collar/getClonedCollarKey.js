import { getCollar } from "./getCollar.js";

/*********
 * Gets a list of users with secondary key access to the collaruser.
 * 
 * - (user id) collaruser - The User ID wearing the collar
 * ---
 * ##### Returns an array of user IDs with secondary access to this collar.
 *********/
export function getClonedCollarKey(collaruser) {
	return getCollar(collaruser)?.clonedKeyholders ?? [];
}