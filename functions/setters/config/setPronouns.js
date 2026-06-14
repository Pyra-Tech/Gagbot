import { setOption } from "./setOption.js";

/*********
 * Sets pronouns for a user
 * 
 * - (user id) user - The person setting pronouns
 * - (string) pronouns - "she/her", "he/him", "they/them", "it/its"
 * ---
 * ##### *No return value*
 *********/
export function setPronouns(user, pronouns) {
	if (process.pronouns == undefined) {
		process.pronouns = {};
	}

	process.pronouns[user] = pronounsMap.get(pronouns);
    setOption(user, "pronouns", (pronouns.split("/")[0]))

	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.pronouns = true;
};