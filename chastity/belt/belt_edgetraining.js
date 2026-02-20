const { getHeavy } = require("../../functions/heavyfunctions");
const { messageSendChannel } = require("../../functions/messagefunctions");
const { getText } = require("../../functions/textfunctions");
const { getUserVar, setUserVar } = require("../../functions/usercontext");
const { getChastity, calcDenialCoefficient } = require("../../functions/vibefunctions");
const { getArousal, addArousal } = require("../../functions/vibefunctions")

const ORGASM_LIMIT = 10;
// Edge Training Belt
exports.denialCoefficient = (data) => { return 1 }
exports.growthCoefficient = (data) => { return 1.5 }

// Edge Control Functions
// Vibe Level
exports.vibelevel = (data) => { return 0
}
exports.minVibe = function(data) {
    threshold = fetchArousalThreshold(data.userID);
    arousal = getArousal(data.userID);
    console.log(arousal/threshold)
    if(getUserVar(data.userID, "edgeBeltMode") == "Go2Edge" || getUserVar(data.userID, "edgeBeltMode") == "Edging" && arousal/threshold < 1) { return 20; }
    return 0;
}

exports.onOrgasm = (data) => {
    // On Orgasm engage Punishment Mode
    //setUserVar(data.userID, "punishmentCount", 3)
    setUserVar(data.userID, "edgeBeltTimer", Date.now() + 1800000);
    getUserVar(data.userID, "edgeBeltMode") == "Punishment"
    setUserVar(data.userID, "edgeCount", 0);
}
exports.onFailedOrgasm = (data) => {
    
}
exports.onEquip = (data) => {
    if (!getUserVar(data.userID, "edgeBeltMsgs") || getUserVar(data.userID, "edgeBeltMsgs") == undefined) setUserVar(data.userID, "edgeBeltMsgs", 0);
    if (!getUserVar(data.userID, "edgeCount") || getUserVar(data.userID, "edgeCount") == undefined) setUserVar(data.userID, "edgeCount", 0);
    //if (!getUserVar(data.userID, "punishmentCount") || getUserVar(data.userID, "punishmentCount") == undefined) setUserVar(data.userID, "punishmentCount", 0);
    if (!getUserVar(data.userID, "edgeBeltMode") || getUserVar(data.userID, "edgeBeltMode") == undefined) setUserVar(data.userID, "edgeBeltMode", "Sleep");
    if (!getUserVar(data.userID, "edgeBeltTimer") || getUserVar(data.userID, "edgeBeltTimer") == undefined) setUserVar(data.userID, "edgeBeltTimer", Date.now());
    if (!getUserVar(data.userID, "edgeSessionTimer") || getUserVar(data.userID, "edgeSessionTimer") == undefined) setUserVar(data.userID, "edgeSessionTimer", Date.now() + 30000);
}
exports.onUnequip = (data) => {
    setUserVar(data.userID, "edgeBeltMsgs", undefined);
    setUserVar(data.userID, "edgeBeltTimer", undefined);
    setUserVar(data.userID, "edgeBeltMode", undefined); 
    setUserVar(data.userID, "edgeSessionTimer", undefined);   
    //setUserVar(data.userID, "punishmentCount", undefined);
}

function fetchArousalThreshold(userID) {
    denialCoefficient = calcDenialCoefficient(userID);
    orgasmLimit = ORGASM_LIMIT;

    return targetorgasmthresh = orgasmLimit * denialCoefficient;
}

// Name
exports.name = "Edge Training Belt" 
