import { calcDenialCoefficient } from "../../vibefunctions.js";
import { getOption } from "../config/getOption.js";
import { getArousal } from "./getArousal.js";

// the arousal needed for an unbelted user to orgasm
const ORGASM_LIMIT = 10;
// the arousal under which it is treated as 0
const RESET_LIMIT = 0.1;

/**********
 * Gets a description representing the user's arousal
 * 
 * - (user id) user - The user who is aroused
 * ---
 * ##### Returns a string representing their arousal
 **********/
export function getArousalDescription(user) {
	if (getOption(user, "arousalsystem") === 0) return null; // Disabled Arousal system

	const arousal = getArousal(user);
	const denialCoefficient = calcDenialCoefficient(user);
	const orgasmLimit = ORGASM_LIMIT * denialCoefficient;
	const orgasmProgress = arousal / orgasmLimit;
	// these numbers are mostly arbitrary
	if (orgasmProgress > 1.4) return "Overstimulated";
	if (orgasmProgress > 0.9) return "On edge";
	if (arousal < RESET_LIMIT) return "Not aroused";
	if (arousal < ORGASM_LIMIT * 0.3) return "A bit aroused";
	if (arousal < ORGASM_LIMIT * 0.8) return "Moderately aroused";
	if (arousal < ORGASM_LIMIT * 1.5) return "Very aroused";
	return "Extremely aroused";
}