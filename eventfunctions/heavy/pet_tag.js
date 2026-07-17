const { getChastity } = require("../../functions/getters/chastity/getChastity.js");
const { getChastityBra } = require("../../functions/getters/chastity/getChastityBra.js");
const { getChastityBraName } = require("../../functions/getters/chastity/getChastityBraName.js");
const { getChastityName } = require("../../functions/getters/chastity/getChastityName.js");
const { getCollar } = require("../../functions/getters/collar/getCollar.js");
const { getCollarName } = require("../../functions/getters/collar/getCollarName.js");
const { getGag } = require("../../functions/getters/gag/getGag.js");
const { convertGagText } = require("../../functions/getters/gag/getGagName.js");
const { getHeadwear } = require("../../functions/getters/headwear/getHeadwear.js");
const { getHeadwearName } = require("../../functions/getters/headwear/getHeadwearName.js");
const { getHeavy } = require("../../functions/getters/heavy/getHeavy.js");
const { getMitten } = require("../../functions/getters/mitten/getMitten.js");
const { getMittenName } = require("../../functions/getters/mitten/getMittenName.js");
const { getLockedWearable } = require("../../functions/getters/wearable/getLockedWearable.js");
const { getWearable } = require("../../functions/getters/wearable/getWearable.js");
const { getWearableName } = require("../../functions/getters/wearable/getWearableName.js");
const { messageSendChannel } = require("../../functions/messagefunctions.js");
const { addArousal } = require("../../functions/setters/arousal/addArousal.js");
const { assignChastity } = require("../../functions/setters/chastity/assignChastity.js");
const { assignChastityBra } = require("../../functions/setters/chastity/assignChastityBra.js");
const { assignCollar } = require("../../functions/setters/collar/assignCollar.js");
const { assignGag } = require("../../functions/setters/gag/assignGag.js");
const { assignHeadwear } = require("../../functions/setters/headwear/assignHeadwear.js");
const { assignHeavy } = require("../../functions/setters/heavy/assignHeavy.js");
const { removeHeavy } = require("../../functions/setters/heavy/removeHeavy.js");
const { assignMitten } = require("../../functions/setters/mitten/assignMitten.js");
const { assignWearable } = require("../../functions/setters/wearable/assignWearable.js");
const { deleteWearable } = require("../../functions/setters/wearable/removeWearable.js");
const { getText } = require("../../functions/textfunctions.js");

// File Containing Pet Costume Sets - Wearables, Headwear, Mittens, Gags, Heavy. For Static Heavies at the end of the outfit the type 'end' can be used to access specific texts.

// Validated 05/05/26
const ponygirl_outfit = [
    { category: "chastitybelt", itemtowear: "belt_silver", color: null },
    { category: "chastitybra", itemtowear: "bra_silver", color: null },
    { category: "collar", itemtowear: "collar_posture", color: null },
    { category: "mittens", itemtowear: "mittens_leather", color: null },
    { category: "wearable", itemtowear: "ponytack_leather", color: "Red" },
    { category: "heavy", itemtowear: "armbinder_leather", color: null },
    { category: "wearable", itemtowear: "ponyboots_leather", color: "Red" },
    { category: "heavy", itemtowear: "rope_hobble", color: null },
    { category: "headwear", itemtowear: "blindfold_leather", color: null },
    { category: "gag", itemtowear: "ball", color: null },
    { category: "wearable", itemtowear: "headharness_leather", color: "Red" },
    { category: "wearable", itemtowear: "blinkers_leather", color: "Red" },
    { category: "end", itemtowear: "leashing_post", color: null },
];


const petCostumes = {
    ponygirl_outfit: ponygirl_outfit,
};

//*/ Shuffler Application
function shuffleWearables(inputArray) {
    //Fisher-Yates Shuffle
    for (let i = inputArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [inputArray[i], inputArray[j]] = [inputArray[j], inputArray[i]];
    }

    return inputArray;
}
//*/

// Pet Transformation Event Function
// Rapidly strips the victim of all unprotected clothing and restraints
// Then it will slowly apply a random outfit and set of restraints!
// Then it will spit them out and apply a new heavy item at the end!

let tick = async (userID, datain) => {
    if (process.userevents == undefined) { process.userevents = {} }
    if (process.userevents[userID] == undefined) { process.userevents[userID] = {} }
    if (process.userevents[userID].pet_tag == undefined) { process.userevents[userID].pet_tag = { stage: 0 } }
    if (process.userevents[userID].pet_tag.costumeidx == undefined) { process.userevents[userID].pet_tag.costumeidx = 0 }
    if (process.userevents[userID].pet_tag.origbinder == undefined) { process.userevents[userID].pet_tag.origbinder = getHeavy(userID).origbinder }

    // Randomly select an outfit from mimicCostumes.js
    if (process.userevents[userID].pet_tag.outfit == undefined) { process.userevents[userID].pet_tag.outfit = Object.keys(mimicCostumes)[Math.floor(Math.random() * Object.keys(mimicCostumes).length)]; }
    let currclothes = getWearable(userID).filter((f) => (!getLockedWearable(userID).includes(f))); // Current clothes that can be removed
    let shuffledclothes = shuffleWearables(currclothes); // I admittedly dont think a big shuffler's necessary but its fine
    // Capture length of initial Removable Wearables array
    if (process.userevents[userID].pet_tag.removableclothes == undefined) { process.userevents[userID].pet_tag.removableclothes = shuffledclothes.length }
    let consumeperpass = Math.round(process.userevents[userID].pet_tag.removableclothes / 4);

    // get the user object, if it doesn't exist, go away
    let userobject = await process.client.users.fetch(userID); // The person in the processing terminal!
    let targetobject = await process.client.users.fetch(getHeavy(userID).origbinder ?? userID); // The cruel person who threw this person in the terminal!
    // Something's wrong. 
    if (!userobject || !targetobject || !(process.recentmessages && process.recentmessages[userID])) {
        return;
    }

    // Only update a max of once every 20 seconds. 
    if ((process.userevents[userID].pet_tag.nextupdate ?? 0) < Date.now()) {
        //process.userevents[userID].pet_tag.nextupdate = Date.now() + 2000; // Test Speed
        process.userevents[userID].pet_tag.nextupdate = Date.now() + 20000;
    }
    else { return };

    // Build data tree:
    let data = {
        textarray: "texts_eventfunctions",
        textdata: {
            interactionuser: userobject,
            targetuser: targetobject,
        }
    }

    // The Mimic is teasing the Victim during the entire event~ (Arousal Gain can be increased or decreased as desired)
    addArousal(userID, 1);

    console.log(process.userevents[userID].pet_tag)

    // Select Item from Chosen Outfit based in index
    let nextitem = mimicCostumes[process.userevents[userID].pet_tag.outfit][process.userevents[userID].pet_tag.costumeidx];
    let itemtoequipcolored = null;
    let nom_idx = 0;
    let itemsconsumed = "";

    console.log("Consume: ", consumeperpass, ", Total: ", getWearable(userID).filter((f) => (!getLockedWearable(userID).includes(f))).length, ", Stage: ", process.userevents[userID].pet_tag.stage);

    // Initial Text Formatting
    data.heavy = true;
    data.costumer_mimic = true;

    // Stripping Clothes
    if (process.userevents[userID].pet_tag.stage < 3) {
        if (shuffledclothes.length > consumeperpass && consumeperpass >= 2) {
            while (nom_idx < consumeperpass && shuffledclothes[nom_idx] != null) {
                // Fetch Wearable name and concatenate onto string
                if (nom_idx != consumeperpass - 1) {
                    itemsconsumed += getWearableName(undefined, shuffledclothes[nom_idx]) + ", ";
                } else {
                    itemsconsumed += "and " + getWearableName(undefined, shuffledclothes[nom_idx]);
                }
                // remove it 
                deleteWearable(userID, shuffledclothes[nom_idx]);
                nom_idx++;
            }
            data.textdata.c1 = itemsconsumed;
            console.log(itemsconsumed);
            data.removeclothing = true;

            // Send a message saying it stripped things off the wearer <3
            messageSendChannel(getText(data), process.recentmessages[userID])
            process.userevents[userID].pet_tag.stage++
            return;

        } else if (shuffledclothes.length <= consumeperpass && shuffledclothes.length > 0) {
            console.log("Not enough Clothes remaining for a full cycle! Skipping to stage 3!")
            // Skip to Stage 4 and consume all remaining items
            process.userevents[userID].pet_tag.stage = 3
        } else if (shuffledclothes.length == 0) {
            // Victim Stripped of all unprotected clothing unexpectedly, progress to next stage
            console.log("Unexpectedly Naked! Skipping to Dress Up!")
            process.userevents[userID].pet_tag.stage = 4;
            data.textdata.c1 = "Naked";
            data.donestripping = true;
            data.noneremaining = true;
            messageSendChannel(getText(data), process.recentmessages[userID])
            return;
        } else {
            console.log("Initial Clothes count less than 4! Skipping to stage 3!")
            // Skip to Stage 4 and consume all remaining items
            process.userevents[userID].pet_tag.stage = 3
        }
    }

    if (process.userevents[userID].pet_tag.stage == 3) {
        console.log("Entering Final Consumption!")
        // Handle all remaining Wearables
        data.donestripping = true;
        let remainingwearables = getWearable(userID).filter((f) => (!getLockedWearable(userID).includes(f)))
        let concat = []
        remainingwearables.forEach((w) => {
            concat.push(getWearableName(undefined, w));
            deleteWearable(userID, w);
        })
        if (concat.length > 0) {
            data.textdata.c1 = concat.join(", ")
            data.remainingitems = true;
            if (concat.length > 1) {
                data.multiple = true;
            }
            else {
                data.single = true;
            }
        }
        else {
            data.textdata.c1 = "Nothing Worn!"
            data.noneremaining = true;
        }

        // Send a message saying it has consumed all remaining wearables
        messageSendChannel(getText(data), process.recentmessages[userID])

        process.userevents[userID].pet_tag.stage++
        return;
    }

    // Apply Outfit Items once stripped until last index of array is reached or a heavy item is found
    if (process.userevents[userID].pet_tag.stage >= 4 && process.userevents[userID].pet_tag.costumeidx < mimicCostumes[process.userevents[userID].pet_tag.outfit].length && nextitem.category != "end") {

        data.applyingOutfit = true;
        switch (nextitem.category) {
            case "wearable":
                data.wearable = true;
                itemtoequipcolored = colourItem(nextitem.itemtowear, nextitem.color);
                if (itemtoequipcolored != null) {
                    data.textdata.c1 = getWearableName(undefined, itemtoequipcolored)
                    assignWearable(userID, itemtoequipcolored);
                    data.add = true;
                    messageSendChannel(getText(data), process.recentmessages[userID])
                }
                else {
                    data.textdata.c1 = getWearableName(undefined, nextitem.itemtowear)
                    assignWearable(userID, itemtoequipcolored);
                    data.add = true;
                    messageSendChannel(getText(data), process.recentmessages[userID])
                }
                // Increment Costume Index
                process.userevents[userID].pet_tag.costumeidx++;
                break;

            case "headwear":
                if (!getHeadwear(userID) || (getHeadwear(userID) && (getHeadwear(userID).getHeadwearName != nextitem.itemtowear))) {
                    data.headwear = true;
                    data.textdata.c1 = getHeadwearName(undefined, nextitem.itemtowear), // headwear name

                        // Apply the headwear    
                        assignHeadwear(userID, nextitem.itemtowear, targetobject.id)

                    data.add = true;
                    messageSendChannel(getText(data), process.recentmessages[userID])
                }
                // Increment Costume Index
                process.userevents[userID].pet_tag.costumeidx++;
                break;

            case "gag":
                if (!getGag(userID) || (getGag(userID) && (getGag(userID).getGagName != nextitem.itemtowear))) {
                    data.gag = true;
                    data.textdata.c1 = convertGagText(nextitem.itemtowear), // gag name
                        // Apply the gag    
                        assignGag(userID, nextitem.itemtowear, Math.floor(Math.random() * 10) + 1, process.userevents[userID].pet_tag.origbinder)
                    data.add = true;
                    messageSendChannel(getText(data), process.recentmessages[userID])
                }
                // Increment Costume Index
                process.userevents[userID].pet_tag.costumeidx++;
                break;

            case "mittens":
                if (!getMitten(userID) || (getMitten(userID) && (getMitten(userID).getMittenName != nextitem.itemtowear))) {
                    data.mitten = true;
                    if (getMitten(userID)) {
                        data.textdata.c1 = getMittenName(undefined, getMitten(userID).mittenname) ?? "mittens", // mitten name
                            data.textdata.c2 = getMittenName(undefined, nextitem.itemtowear), // new mitten name
                            assignMitten(userID, nextitem.itemtowear, getMitten(userID).origbinder)

                        data.replace = true;
                    }
                    else {
                        data.textdata.c1 = getMittenName(undefined, nextitem.itemtowear), // mitten name
                            assignMitten(userID, nextitem.itemtowear, process.userevents[userID].pet_tag.origbinder)
                        data.add = true;
                    }
                    messageSendChannel(getText(data), process.recentmessages[userID]);

                }
                // Increment Costume Index
                process.userevents[userID].pet_tag.costumeidx++;
                break;

            case "chastitybelt":
                if (!getChastity(userID) || (getChastity(userID) && (getChastity(userID).getChastityName != nextitem.itemtowear))) {
                    data.chastitybelt = true;
                    if (getChastity(userID)) {
                        data.textdata.c1 = getChastityName(undefined, getChastity(userID).getChastityName) ?? "chastity belt", // chastity name
                            data.textdata.c2 = getChastityName(undefined, nextitem.itemtowear), // new chastity name

                            // Update Chastity Belt Name with new type
                            process.chastity[userID].chastitytype = nextitem.itemtowear

                        data.replace = true;
                    }
                    else {
                        data.textdata.c2 = getChastityName(undefined, nextitem.itemtowear), // chastity name
                            assignChastity(userID, process.userevents[userID].pet_tag.origbinder, nextitem.itemtowear)
                        data.add = true;
                    }
                    messageSendChannel(getText(data), process.recentmessages[userID]);

                }
                // Increment Costume Index
                process.userevents[userID].pet_tag.costumeidx++;
                break;

            case "chastitybra":
                if (!getChastityBra(userID) || (getChastityBra(userID) && (getChastityBra(userID).getChastityBraName != nextitem.itemtowear))) {
                    data.chastitybra = true;
                    if (getChastityBra(userID)) {
                        data.textdata.c1 = getChastityBraName(undefined, getChastityBra(userID).getChastityBraName) ?? "chastity bra", // chastity bra name
                            data.textdata.c2 = getChastityBraName(undefined, nextitem.itemtowear), // new chastity bra name

                            // Update Chastity Bra Name with new type
                            process.chastitybra[userID].chastitytype = nextitem.itemtowear

                        data.replace = true;
                    }
                    else {
                        data.textdata.c2 = getChastityBraName(undefined, nextitem.itemtowear), // chastity bra name
                            assignChastityBra(userID, process.userevents[userID].pet_tag.origbinder, nextitem.itemtowear)
                        data.add = true;
                    }
                    messageSendChannel(getText(data), process.recentmessages[userID]);

                }
                // Increment Costume Index
                process.userevents[userID].pet_tag.costumeidx++;
                break;

            case "collar":
                if (!getCollar(userID) || (getCollar(userID) && (getCollar(userID).getCollarName != nextitem.itemtowear))) {
                    data.collar = true;
                    if (getCollar(userID)) {
                        data.textdata.c1 = getCollarName(undefined, getCollar(userID).getCollarName) ?? "collar", // collar name
                            data.textdata.c2 = getCollarName(undefined, nextitem.itemtowear), // new collar name

                            // Update Collar Name with new type
                            process.collar[userID].collartype = nextitem.itemtowear

                        data.replace = true;
                    }
                    else {
                        data.textdata.c2 = getCollarName(undefined, nextitem.itemtowear), // collar name
                            assignCollar(userID, process.userevents[userID].pet_tag.origbinder, {}, false, nextitem.itemtowear)
                        data.add = true;
                    }
                    messageSendChannel(getText(data), process.recentmessages[userID]);

                }
                // Increment Costume Index
                process.userevents[userID].pet_tag.costumeidx++;
                break;

            case "heavy":
                if (!getHeavy(userID, nextitem.itemtowear)) {
                    // Apply the Heavy Restraint 
                    assignHeavy(userID, nextitem.itemtowear, process.userevents[userID].pet_tag.origbinder);

                    // Configure Message Parameters                    
                    data.heavyrestraint = true;
                    data.textdata.c1 = getHeavy(userID, nextitem.itemtowear).displayname; // heavy name
                    data.add = true;

                    //Send Message to Channel
                    messageSendChannel(getText(data), process.recentmessages[userID]);
                }
                // Increment Costume Index
                process.userevents[userID].pet_tag.costumeidx++;
                break;

            case "toy":
                if (!getToys(userID).find((t) => t.type === nextitem.itemtowear)) {
                    // Assign the Toy at a random power between 1 and 5
                    assignToy(userID, getHeavy(userID).origbinder, Math.max(Math.round(Math.random() * 5), 1), nextitem.itemtowear, getHeavy(userID).origbinder);
                    
                    // Configure Message Parameters                    
                    data.toy = true;
                    data.textdata.c1 = getBaseToy(nextitem.itemtowear)?.toyname;
                    data.add = true;
                    
                    //Send Message to Channel
                    messageSendChannel(getText(data), process.recentmessages[userID]);
                }
                // Increment Costume Index
                process.userevents[userID].pet_tag.costumeidx++;
                break;
            default:
                // Unknown Item Category in Outfit
                data.unknown = true;
                data.textdata.c1 = nextitem.itemtowear; // item name
                messageSendChannel(getText(data), process.recentmessages[userID]);

                // Increment Costume Index to bypass unknown item
                process.userevents[userID].pet_tag.costumeidx++;
                break;
        }

        if (process.userevents[userID].pet_tag.costumeidx >= mimicCostumes[process.userevents[userID].pet_tag.outfit].length) {
            // Remove Current Heavy (Mimic) if end of Costume Array Reached Without End Marker
            let data = {
                textarray: "texts_eventfunctions",
                textdata: {
                    interactionuser: userobject,
                    targetuser: targetobject,
                }
            }
            data.heavy = true;
            data.costumer_mimic = true;
            removeHeavy(userID, "costumer_mimic");
            data.spitout = true;
            data.none = true;
            messageSendChannel(getText(data), process.recentmessages[userID]);
        }


    } else if (nextitem.category == "end" || process.userevents[userID].pet_tag.costumeidx >= mimicCostumes[process.userevents[userID].pet_tag.outfit].length) {
        // Final Stage - Remove Mimic Heavy and spit them out, then apply Closing Heavy!
        // End of Outfit Marker Reached!        

        // Remove Current Heavy (Mimic)
        removeHeavy(userID, "costumer_mimic");
        data.spitout = true;

        // Apply New Heavy
        if (nextitem.itemtowear && nextitem.category == "end") {
            assignHeavy(userID, nextitem.itemtowear, process.userevents[userID].pet_tag.origbinder);
            data.textdata.c1 = getHeavy(userID, nextitem.itemtowear).displayname; // heavy name
            data.add = true;
            messageSendChannel(getText(data), process.recentmessages[userID]);
        } else {
            data.none = true;
            messageSendChannel(getText(data), process.recentmessages[userID]);
        }

        // Remove Event and exit (Does this automatically go to Garbage Collector?)
        delete process.userevents[userID].pet_tag;
    }
}

const colourItem = (itemtowear, color) => {
    if (color && getWearableName(undefined, `${itemtowear}_${color.toLowerCase()}`)) {
        return `${itemtowear}_${color.toLowerCase()}`;
    }
    else {
        return `${itemtowear}`
    }
}

exports.tick = tick;
