/**********
 * Gets the primary keyholder for a person's collar.
 * 
 * - (user id) user - The User ID to get the collar for
 * ---
 * ##### Returns a string with the user ID of the primary keyholder for the user's collar.
 **********/
function getCollarKeyholder(user) {
    if (process.collar == undefined) {
		process.collar = {};
	}
	return process.collar[user]?.keyholder;
}

exports.getCollarKeyholder = getCollarKeyholder;