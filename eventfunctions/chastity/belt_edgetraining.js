const { getUserVar, setUserVar } = require("../../functions/usercontext")
const { getArousal, addArousal } = require("../../functions/vibefunctions")


// Edge Training Belt 
let functiontick = async function(userID) {
    try 
    {
        // Cancel until the user has said AT LEAST 3 things then set flag for next message to print and reset counter
        if (getUserVar(userID, "edgeBeltMsgs") >= 3 && !getUserVar(userID, "edgeBeltActive")) 
        { 
            setUserVar(userID, "edgeBeltMsgs", 0)
            setUserVar(userID, "edgeBeltActive", true) 
        }

        // Trigger Edging Belt to bring user to Edge when timer expires. Then Set 10min default cooldown
        if(getUserVar(userID, "edgeBeltTimer") < Date.now()){
            setUserVar(userID, "edgeBeltMode", "Go2Edge")
            setUserVar(userID, "edgeBeltTimer", Date.now() + 600000)
        }

        // When Wearer Reaches Edge Range, Start Timer and Edge for 2 mins
        if(getUserVar(userID, "edgeBeltMode") == "Go2Edge" && getUserVar(userID, "edgeSessionTimer") < Date.now() && edgeCheck(userID)){
            setUserVar(userID, "edgeBeltMode", "Edging")
            setUserVar(userID, "edgeSessionTimer", Date.now() + 120000)
        }

        // When Wearer Finishes Edging, Increment Count and update Main Timer Cooldown to 10 mins before setting the Belt in Sleep Mode
        if(getUserVar(userID, "edgeBeltMode") == "Edging" && getUserVar(userID, "edgeSessionTimer") < Date.now()){
            setUserVar(userID, "edgeCount", getUserVar(userID, "edgeCount") + 1);
            setUserVar(userID, "edgeBeltTimer", Date.now() + 600000)
            setUserVar(userID, "edgeBeltMode", "Sleep")
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

exports.functiontick = functiontick;
