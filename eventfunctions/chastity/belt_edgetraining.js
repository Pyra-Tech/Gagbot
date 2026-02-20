const { data } = require("../../commands/letgo")
const { getUserVar, setUserVar } = require("../../functions/usercontext")
const { getArousal, addArousal } = require("../../functions/vibefunctions")


// Edge Training Belt 
exports.functiontick = async (userID) => {
    try 
    {
        // Cancel until the user has said AT LEAST 3 things then set flag for next message to print and reset counter
        if (getUserVar(userID, "edgeBeltMsgs") >= 3 && !getUserVar(userID, "edgeBeltActive")) 
        { 
            setUserVar(userID, "edgeBeltMsgs", 0)
            setUserVar(userID, "edgeBeltActive", true) 
        }

        // Trigger Edging Belt to bring user to Edge when timer expires. Then Set 10min default cooldown
        if(getUserVar(data.userID, "edgeBeltTimer") < Date.now()){
            setUserVar(data.userID, "edgeBeltMode", "Go2Edge")
            setUserVar(data.userID, "edgeBeltTimer", Date.now() + 600000)
        }

        // When Wearer Reaches Edge Range, Start Timer and Edge for 2 mins
        if(getUserVar(data.userID, "edgeBeltMode") == "Go2Edge" && getUserVar(data.userID, "edgeSessionTimer") < Date.now() && edgeCheck(data.userID)){
            setUserVar(data.userID, "edgeBeltMode", "Edging")
            setUserVar(data.userID, "edgeSessionTimer", Date.now() + 120000)
        }

        // When Wearer Finishes Edging, Increment Count and update Main Timer Cooldown to 10 mins before setting the Belt in Sleep Mode
        if(getUserVar(data.userID, "edgeBeltMode") == "Edging" && getUserVar(data.userID, "edgeSessionTimer") < Date.now()){
            setUserVar(data.userID, "edgeCount", getUserVar(data.userID, "edgeCount") + 1);
            setUserVar(data.userID, "edgeBeltTimer", Date.now() + 600000)
            setUserVar(data.userID, "edgeBeltMode", "Sleep")
        }
            
    }catch (err) {
        console.log(err);
    }
}


function fetchArousalThreshold(userID) {
    denialCoefficient = calcDenialCoefficient(userID);
    orgasmLimit = ORGASM_LIMIT;

    return targetorgasmthresh = orgasmLimit * denialCoefficient;
}

function edgeCheck(userID){
    threshold = fetchArousalThreshold(userID);
    arousal = getArousal(userID);

    if(arousal > threshold * 0.9){return true}
    return false
}

exports.msgfunction = (userid, data) => {
    setUserVar(userid, "edgeBeltMsgs", (getUserVar(userid, "edgeBeltMsgs") ?? 1) + 1); 
}
