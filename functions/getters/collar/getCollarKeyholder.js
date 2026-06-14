import { getCollar } from "./getCollar.js";

/**********
 * Gets the primary keyholder for a person's collar.
 * 
 * - (user id) user - The User ID to get the collar for
 * ---
 * ##### Returns a string with the user ID of the primary keyholder for the user's collar.
 **********/
export function getCollarKeyholder(user) {
	return getCollar(user)?.keyholder;
}