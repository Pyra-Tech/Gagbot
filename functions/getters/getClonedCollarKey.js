/*********
 * Gets a list of users with secondary key access to the collaruser.
 * 
 * - (user id) collaruser - The User ID wearing the collar
 * ---
 * ##### Returns an array of user IDs with secondary access to this collar.
 *********/
function getClonedCollarKey(collaruser) {
    if (process.collar == undefined) {
		process.collar = {};
	}
	let returnval = process.collar[userID]?.clonedKeyholders ?? [];
	return returnval;
}

exports.getClonedCollarKey = getClonedCollarKey;