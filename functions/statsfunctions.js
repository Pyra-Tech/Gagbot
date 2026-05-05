



/**********
 * Adds a point to a counter by name in user's stats. Specify amount for custom amount.
 * 
 * - (user id) user - User to increment for
 * - (string) countername - ID of the counter to increment
 * - (number) amount - Amount to increment the counter by. Default to 1
 **********/
function statsAddCounter(user, countername, amount = 1) {
    if (process.userstats == undefined) { process.userstats = {} }
    if (process.userstats[user] == undefined) { process.userstats[user] = {} }
    let newcount = (process.userstats[user][countername] ?? 0) + amount;
    process.userstats[user][countername] = newcount;
    if (process.readytosave == undefined) {
        process.readytosave = {};
    }
    process.readytosave.userstats = true;
}

/**********
 * Get the counter for a user by name.
 * 
 * - (user id) user - User to increment for
 * - (string) countername - ID of the counter to increment
 **********/
function statsGetCounter(user, countername) {
    if (process.userstats == undefined) { process.userstats = {} }
    if (process.userstats[user] == undefined) { process.userstats[user] = {} }
    return process.userstats[user][countername];
}

/**********
 * Set the counter for a user by name. Specify Value
 * 
 * - (user id) user - User to increment for
 * - (string) countername - ID of the counter to increment
 * - (any) value - Value to store in countername
 **********/
function statsSetCounter(user, countername, value) {
    if (process.userstats == undefined) { process.userstats = {} }
    if (process.userstats[user] == undefined) { process.userstats[user] = {} }
    process.userstats[user][countername] = value;
    if (process.readytosave == undefined) {
        process.readytosave = {};
    }
    process.readytosave.userstats = true;
}

/*********
 * Generates a text list for the Inspect window display with all of the tracked stats. 
 * 
 * - (user id) user - User to generate stats for
 *********/
function statsGeneratePage(user) {
    let statstogenerate = {
        headpats: [
            {
                name: "Headpats Given",
                stat: "headpatsgiven"
            },
            {
                name: "Headpats Received",
                stat: "headpatsreceived"
            },
            {
                name: "Headpats on Self",
                stat: "headpatsself"
            },
            {
                name: "Headpat Crits",
                stat: "headpatcrits"
            },
            {
                name: "Headpat Double Crits",
                stat: "headpatdoublecrits"
            },
            {
                name: "Headpat Triple Crits",
                stat: "headpattriplecrits"
            },
        ]
    }

    let outtext = `### Headpats\n`

    statstogenerate["headpats"].forEach((textstat) => {
        outtext = `${outtext}-# • ${textstat.name}: **${statsGetCounter(user, textstat.stat) ?? 0}**\n`
    })

    return outtext;
}

exports.statsAddCounter = statsAddCounter;
exports.statsGetCounter = statsGetCounter;
exports.statsSetCounter = statsSetCounter;
exports.statsGeneratePage = statsGeneratePage;