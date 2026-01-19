const garbleText = (text, intensity) => {
	let curses = [
		"fuck",
        "fucking",
        "fuckin",
        "motherfucker",
        "damn",
        "dammit",
        "bitch",
        "shit",
        "bitchin'",
        "ass",
        "asshole",
        "arse",
        "goddammit",
        "piss",
        "dick",
        "dickhead",
        "damned",
        "bullshit",
        "fucked",
        "fucker",
        "crap",
        "hell",
        "cunt",
        "bollocks"
	];

    let cursemap = curses.join("|");
	let regexpattern = new RegExp(`\\b(${cursemap})\\b`, "gi");
    let textout = text.replaceAll(regexpattern, "🧼🧼🧼🧼")

	return textout;
};

exports.garbleText = garbleText;
exports.choicename = "Soap Gag";