/********
 * Get the person who applied heavy bondage to the user.
 * 
 * - (user id) user - The person wearing the heavy bondage
 * - (string) type - The specific heavy bondage ID. If unspecified, returns the first heavy bondage
 * ---
 * ##### Returns a user ID who put this heavy bondage on the user. 
 ********/
function getHeavyBinder(user, type) {
    if (process.heavy == undefined) {
		process.heavy = {};
	}
	if (process.heavy[user] == undefined) {
        process.heavy[user] = [];
    }
    if (process.heavy[user].length > 0) {
        if (type) {
            return process.heavy[user].find((h) => h.type === type)?.origbinder
        }
        else {
            return process.heavy[user][0]?.origbinder
        }
    };
}

exports.getHeavyBinder = getHeavyBinder;