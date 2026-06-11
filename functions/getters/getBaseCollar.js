/********* 
 * Gets the base collar type by ID. Returns the full collar object definition.
 * 
 *  - (string) type - the type of collar to retrieve
 **********/
function getBaseCollar(type) {
    return process.collartypes.find((c) => c.value == type)
}

exports.getBaseCollar = getBaseCollar;