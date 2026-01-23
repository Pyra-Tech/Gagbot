const honorifictitles = [
    "sorry",
    "sorries",
    "sowry",
    "sowwy",
    "my\ bad",
    "apologies"
];

const silenttitles = [
    `\nI am enough.\n`, 
    `\nI do fantastic work.\n`, 
    `\nMy actions are good enough\n`, 
    `\n*twiddles thumbs meekly*\n`, 
    `\n*pouts as the gag stops impolite speech*\n`, 
    `\n*goes mute without an honorific*\n`, 
    `\n*meeps but produces no audible words*\n`, 
    `\n*casts eyes downward, like a good sub*\n`, 
    `\n*blushes and mumbles something*\n`
];

const messagebegin = (msg, msgTree, msgTreeMods, intensity) => {

	let garblemode = false;
	let textout = silenttitles[Math.floor(Math.random() * silenttitles.length)];

    let messagetoselect = silenttitles.concat(`\n${convertPronounsText(`I am a good USER_PRAISEOBJECT!`, { interactionuser: msg.member, targetuser: msg.member })}\n`)

	let honorificsmap = honorifictitles.join("|");
	let regexpattern = new RegExp(`\\b(${honorificsmap})\\b`, "i");

	if (regexpattern.test(msg.content)) {
		// They were polite, don't touch it.
		return;
	} else {
		let silenced = {"isSilenced": false}					// Store a bool in an object to pass by reference.
		msgTree.callFunc(impoliteSub,true,"rawText",[silenced])	// Run a function on the tree.
		if(silenced.isSilenced){msgTreeMods.modified = true;}	// If the function caught anything, the message is modified.
		return;
	}
};

// Replace the first rawText field with a silenttitle, then purge all others.
const impoliteSub = (text, parent, silent) => {
	if(!silent.isSilenced){
		silent.isSilenced = true;
		return silenttitles[Math.floor(Math.random() * silenttitles.length)];
	}else{
		return "";
	}
}

//exports.garbleText = garbleText;
exports.messagebegin = messagebegin;
exports.choicename = "Sorry Gag";
