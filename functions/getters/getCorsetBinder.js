/**********
 * Gets the origbinder of someone's corset, if worn.
 * 
 * - (user id) user - The user wearing the corset
 * ---
 * ##### Returns the user ID of the person who put this corset on the wearer.
 **********/
function getCorsetBinder(user) {
    if (process.corset == undefined) process.corset = {};
	return process.corset[user]?.origbinder;
}

exports.getCorsetBinder = getCorsetBinder;