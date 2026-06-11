/*****
 * Gets the original binder for a gag by ID
 * 
 * - (user ID) userID - The user ID to retrieve a gag for
 * - (string) item - The string ID of the gag to get. 
 * ---
 * ##### Returns the user ID who put the gag on them
 *****/
function getGagBinder(userID, item) {
    if (process.gags == undefined) {
		process.gags = {};
	}
	return process.gags[userID]?.find((g) => g.gagtype == item)?.origbinder;
}

exports.getGagBinder = getGagBinder;