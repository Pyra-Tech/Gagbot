const { gagtypes } = require("../../gagfunctions");

/************
 * Gets the full gag name by ID
 * 
 * - (string) type - The gag ID to retrieve the gag name of
 * ---
 * ##### Returns a string with the user-facing display name of the gag.
 * ---
 * ###### Needs rework into getBaseGag
 ************/
function convertGagText(type) {
    let convertgagarr;
    for (let i = 0; i < gagtypes.length; i++) {
        if (convertgagarr == undefined) {
            convertgagarr = {};
        }
        convertgagarr[gagtypes[i].value] = gagtypes[i].name;
    }
    return convertgagarr[type];
};

exports.convertGagText = convertGagText;
exports.getGagName = convertGagText;