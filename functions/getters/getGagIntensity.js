/********
 * Gets the intensity of the first worn gag. This function isn't used at all and should be removed.
 * 
 * - (user ID) userID - The user ID to retrieve the first gag for
 ********/
function getGagIntensity(userID) {
    if (process.gags == undefined) {
		process.gags = {};
	}
	if (process.gags[userID] && process.gags[userID].length > 0) {
		return process.gags[userID][0].intensity;
	} else {
		return undefined;
	}
}

exports.getGagIntensity = getGagIntensity;