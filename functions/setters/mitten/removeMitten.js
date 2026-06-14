/**********
 * Removes mittens from the user.
 * 
 * - (user id) userID - The person wearing the mittens
 * ---
 * ##### *No return value*
 **********/
export function deleteMitten(userID) {
	if (process.mitten == undefined) {
		process.mitten = {};
	}
	delete process.mitten[userID];
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.mitten = true;
};

export const deleteMitten = removeMitten;