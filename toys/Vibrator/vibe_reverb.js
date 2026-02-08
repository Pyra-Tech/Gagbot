const { getUserVar, setUserVar } = require("../../functions/usercontext")

// This vibrator will only function if getUserVar(userID, "soundVibeEndTime") has any value
exports.vibescale = (data) => { 
    console.log(`${data.userID}`)
    return Math.max(0, Math.min(getUserVar(data.userID, "soundVibeIntensity")/10, 2));
} // Ranging between 0 and 2

exports.calcVibeEffect = (data) => { 
    return (getUserVar(data.userID, "soundVibeEndTime") ? data.intensity * this.vibescale() : 0)
}

exports.onUnequip = (data) => {
    setUserVar(data.userID, "soundVibeEndTime", undefined);
    setUserVar(data.userID, "soundVibeDecayTime", undefined);
    setUserVar(data.userID, "soundVibeIntensity", 0);
}

exports.onEquip = (data) => {
    setUserVar(data.userID, "soundVibeEndTime", undefined);
    setUserVar(data.userID, "soundVibeDecayTime", undefined);
    setUserVar(data.userID, "soundVibeIntensity", 0);
}

exports.toyname = "Reverb Vibe"