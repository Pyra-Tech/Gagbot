import { calcStaticVibeIntensity, calcFrustration } from "../../vibefunctions.js";
import { getArousal } from "../arousal/getArousal.js";
import { getOption } from "../config/getOption.js";

// the minimum arousal required for frustration to also impact speech
const STUTTER_LIMIT = 1;

/***********
 * Calculate the effective arousal for the user based on their current frustration
 * 
 * - (user id) user - The user that is aroused
 * ---
 * ##### Returns a value of arousal with their added frustration
 ***********/
export function getVibeEquivalent(user) {
	if (getOption(user, "arousalsystem") != 2) return calcStaticVibeIntensity(user) * 2;

	let intensity = getArousal(user);
	if (intensity >= STUTTER_LIMIT) intensity += calcFrustration(user) / 20;
	return intensity;
}