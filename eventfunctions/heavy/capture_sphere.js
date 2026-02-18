const { removeHeavy, getHeavy } = require("../../functions/heavyfunctions")
const { messageSendChannel } = require("../../functions/messagefunctions")
const { getText } = require("../../functions/textfunctions")
const { getArousal } = require("../../functions/vibefunctions")

// Inputs a capture strength and params, outputs an array of 3 values depending on catch. 
// This heavy is all calculated in one go at the beginning of the function
// Implements catch formula described here: https://bulbapedia.bulbagarden.net/wiki/Catch_rate#Capture_method_(Generation_V)
function calculatecapture(userid, ballbonusnum = 1.0) {
    // The user's "health" will be based off of 50 arousal.
    let maxhealth = 50
    let currhealth = Math.min(getArousal(userid), 49.5) // Always clamp to 0.5 hp left - false swipe range if you will. 
    let darkgrass = 1 // Not used, but formula has this, so we'll add it
    let catchrate = 130 + (Math.floor(Math.random() * 125)) // catch rate between 130-255. Higher = more likely. Random chance
    let ballbonus = ballbonusnum;

    // Set array for catches
    let catches = [];

    // Calculate hp part first.
    let hpnum = ((3 * maxhealth) - (2 * currhealth)) / (3 * maxhealth)

    // Now the rest of the catchrate
    let modifiedcatchrate = hpnum * 4096 * darkgrass * catchrate * ballbonus;

    // If the modifiedcatchrate is higher than 1044480, then we can just return set of 3 trues, as this is guaranteed catch
    if (modifiedcatchrate >= 1044480) { return [true, true, true] }
    
    // Otherwise, we need to calculate shakes. We'll do 3 shakes. 
    else {
        let brokenfree = false;
        let shake_b = Math.floor(65536 / Math.sqrt(Math.sqrt(16711680 / modifiedcatchrate))); // fourth root
        for (let i = 0; i < 3; i++) {
            // Random number
            let randomnum = Math.floor(Math.random() * 65535)
            if ((randomnum >= shake_b) && !brokenfree) {
                catches.push(true)
            }
            else {
                catches.push(false);
                brokenfree = true;
            }
        }
    }

    return catches;
}

let functiontick = async (userID) => {
    if (process.userevents == undefined) { process.userevents = {} }
    if (process.userevents[userID] == undefined) { process.userevents[userID] = {} }
    if (process.userevents[userID].capturesphere == undefined) { 
        process.userevents[userID].capturesphere = { 
            capture: calculatecapture(userID, 1.0), 
            ballname: "Capture Sphere",
            captureprogress: -1,
            nextupdate: Date.now() + 2000
        } 
    }
    // If the last update was over 2 minutes ago, this was probably an orphaned ball. 
    if ((process.userevents[userID].capturesphere.nextupdate + 120000 ?? 0) < Date.now()) {
        delete process.userevents[userID].capturesphere
        return;
    }
    // Only update every 5 seconds
    if ((process.userevents[userID].capturesphere.nextupdate ?? 0) < Date.now()) {
        process.userevents[userID].capturesphere.nextupdate = Date.now() + 2000;
    }
    else { return };

    // If we dont know where the user is, lets just wait. 
    if (!(process.recentmessages && process.recentmessages[userID])) {
        return;
    }

    // get the user object, if it doesn't exist, go away
    let userobject = await process.client.users.fetch(userID); // The person that's been captured!
    let targetobject = await process.client.users.fetch(getHeavy(userID).origbinder ?? userID); // The cruel person who threw the pokeball!
    // Something's wrong. 
    if (!userobject || !targetobject || !(process.recentmessages && process.recentmessages[userID])) {
        return;
    }
    // Build data tree:
    let data = {
        textarray: "texts_eventfunctions",
        textdata: {
            interactionuser: userobject,
            targetuser: targetobject,
            c1: process.userevents[userID].capturesphere.ballname
        }
    }
    data.heavy = true;
    data.capturesphere = true;

    // -1 to force an initial delay after equipping the sphere. 
    if (process.userevents[userID].capturesphere.captureprogress == -1) {
        process.userevents[userID].capturesphere.captureprogress++;
        return;
    }
    else if (process.userevents[userID].capturesphere.captureprogress < 2) {
        if (process.userevents[userID].capturesphere.capture) {
            if (process.userevents[userID].capturesphere.capture[process.userevents[userID].capturesphere.captureprogress]) {
                // Successful wiggle!
                messageSendChannel(`*wiggle...*`, process.recentmessages[userID]);
            }
            else {
                data[`wigglefail${process.userevents[userID].capturesphere.captureprogress}`] = true
                messageSendChannel(getText(data), process.recentmessages[userID])
                removeHeavy(userID);
                delete process.userevents[userID].capturesphere;
                return;
            }
        }
        process.userevents[userID].capturesphere.captureprogress++;
        return;
    }
    // Last wiggle! Note, if the third check fails, we still wiggle for it and then break free on captureprogress 3.
    // Yes this could have been an if/else clause above, but this was broken down here for readability. 
    else if (process.userevents[userID].capturesphere.captureprogress == 2) {
        if (process.userevents[userID].capturesphere.capture) {
            if (process.userevents[userID].capturesphere.capture[process.userevents[userID].capturesphere.captureprogress]) {
                messageSendChannel(`*wiggle...*`, process.recentmessages[userID]);
            }
            else {
                messageSendChannel(`*wiggle...*`, process.recentmessages[userID])
            }
        }
        process.userevents[userID].capturesphere.captureprogress++
        return;
    }
    else if (process.userevents[userID].capturesphere.captureprogress == 3) {
        if (process.userevents[userID].capturesphere.capture) {
            if (process.userevents[userID].capturesphere.capture[process.userevents[userID].capturesphere.captureprogress - 1]) {
                // This was a successful capture! 
                if (userobject.id == targetobject.id) {
                    data.capturesuccess_self = true
                }
                else {
                    data.capturesuccess_other = true
                }
                messageSendChannel(getText(data), process.recentmessages[userID]);
            }
            else {
                // This broke free on the third wiggle. 
                data.wigglefail2 = true;
                messageSendChannel(getText(data), process.recentmessages[userID]);
                removeHeavy(userID);
                delete process.userevents[userID].capturesphere;
                return;
            }
        }
        process.userevents[userID].capturesphere.captureprogress++
        return;
    }
}

exports.calculatecapture = calculatecapture;
exports.functiontick = functiontick;