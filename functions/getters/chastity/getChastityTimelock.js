import { getChastity } from "./getChastity.js";

/***********
 * Returns UNIX timestring of the wearer's unlock time for their chastity belt if they are timelocked.
 * 
 * - (user id) user - The User ID wearing the chastity belt.
 * - (boolean) UNIXTimestring? - If true, returns a Discord UNIX timestring instead
 * ---
 * ##### Returns an integer with the unlockTime or a string with the unlock time for Discord.
 ***********/
export function getChastityTimelock(user, UNIXTimestring) {
	if (!UNIXTimestring) {
		return getChastity(user)?.unlockTime;
	} else {
		if (getChastity(user)?.unlockTime) {
			return `<t:${Math.floor(getChastity(user)?.unlockTime / 1000)}:f>`;
		} else {
			return null;
		}
	}
} 