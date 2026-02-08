const { messageSendChannel } = require("../../functions/messagefunctions");
const { setUserVar, getUserVar } = require("../../functions/usercontext");

function msgfunction(userid, data) {

    // Catch Message, Update End Time and Increment Vibe Intensity    
    setUserVar(userid, "soundVibeEndTime", Date.now() + 180000);
    setUserVar(userid, "soundVibeDecayTime", Date.now() + 30000);
    setUserVar(userid, "soundVibeIntensity", Math.min(getUserVar(userid, "soundVibeIntensity") + 1, 20));
    return;
}

async function functiontick(userID) {
    if (getUserVar(userID, "soundVibeEndTime") < Date.now()) {
        console.log(`${userID}'s Sound Vibe has stopped`)
        setUserVar(userID, "soundVibeEndTime", undefined)
    }

    // Decay Intensity until 0
    if (getUserVar(userID, "soundVibeDecayTime") < Date.now() && getUserVar(userID, "soundVibeDecayTime") != null)
    {
        setUserVar(userID, "soundVibeIntensity", Math.max(getUserVar(userID, "soundVibeIntensity") - 1, 0));
        setUserVar(userID, "soundVibeDecayTime", Date.now() + 30000);
    }
}

exports.functiontick = functiontick;
exports.msgfunction = msgfunction;