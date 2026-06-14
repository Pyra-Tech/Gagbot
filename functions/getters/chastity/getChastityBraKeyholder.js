import { getChastityBra } from "./getChastityBra.js";

/**********
 * Gets the primary keyholder for a person's chastity bra.
 * 
 * - (user id) user - The User ID to get the chastity bra for
 * ---
 * ##### Returns a string with the user ID of the primary keyholder for the user's chastity bra.
 **********/
export function getChastityBraKeyholder(user) {
	return getChastityBra(user)?.keyholder;
}