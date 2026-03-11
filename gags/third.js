const { getOption } = require("../functions/configfunctions");
const { getPronouns } = require("../functions/pronounfunctions");
const nlp = require("compromise");

const selfreplacements = [
    { regex: "i am", replace: `this SUBJECT is`}, // "I am"
    { regex: "i have", replace: `this SUBJECT has` }, // "I am"
    { regex: "i'd", replace: `this SUBJECT'd` }, // "I'd"
    { regex: "i'?ve", replace: `this SUBJECT has` }, // "I've"
    { regex: "i'?ll", replace: `this SUBJECT'll` }, // "I've"
    { regex: "i'?m", replace: `this SUBJECT is` }, // "I'm"
    { regex: "i", replace: `this SUBJECT` }, // "I"
    { regex: "me", replace: `this SUBJECT`}, // "me"
    { regex: "myself", replace: `this SUBJECT's self`}, // "myself"
    { regex: "my", replace: `this SUBJECT's`}, // "my"
    { regex: "gimmie", replace: `give this SUBJECT`}, // "me"
];

const garbleText = (text, parent, intensity, msg) => {
    let outtext = text;

    let replacementstring = "toy";
    if (getPronouns(msg.author.id, "subject") == "he") { replacementstring = "boy" }
    if (getPronouns(msg.author.id, "subject") == "she") { replacementstring = "girl" }
    if (getOption(msg.author.id, "deferentialgagsubject").length > 0) { replacementstring = getOption(msg.author.id, "deferentialgagsubject") }

    selfreplacements.forEach((r) => {
        if (r.regex === "i") {
            // Find any "I" that starts at the beginning of a sentence. Mark it accordingly with ╪
            let regexpattern = new RegExp(`(?:^|(?:[.!?]\\s))\\b(I)\\b`, "ig");
            outtext = outtext.replace(regexpattern, "Iqhwriuawujahrfkuwrhakuhncjkaszn")
            // Compromise library can be used here to solve this!
            let doc = nlp(outtext);
            doc.replace("Iqhwriuawujahrfkuwrhakuhncjkaszn", `This ${replacementstring}`).update();
            doc.replace("i", `this ${replacementstring}`).update();
            console.log(doc.nouns());
            console.log(doc.verbs());
            doc.verbs().json().forEach((v) => {
                if (v.text == v.verb.infinitive) {
                    doc.replace(v.text, `${v.text}s`).update();
                }
            })
            console.log(outtext);
            console.log(doc.text());
            outtext = doc.text();
        }
        else {
            // I did not know replaceAll could take a function. 
            // First up, lets match all patterns at the beginning of a sentence.
            let regexpattern = new RegExp(`(?:^|(?:[.!?]\s))\\b(${r.regex})\\b`, "ig");
            outtext = outtext.replaceAll(regexpattern, (match) => {
                let rep = r.replace.replace('SUBJECT', replacementstring);
                //if (match[0] == match[0].toUpperCase()) {
                    rep = `${rep.charAt(0).toUpperCase()}${rep.slice(1)}`
                //}
                return rep;
            });
            // Now each form that isn't first. This won't be capitalized ever. 
            regexpattern = new RegExp(`\\b(${r.regex})\\b`, "ig");
            outtext = outtext.replaceAll(regexpattern, (match) => {
                let rep = r.replace.replace('SUBJECT', replacementstring);
                /*if (match[0] == match[0].toUpperCase()) {
                    rep = `${rep.charAt(0).toUpperCase()}${rep.slice(1)}`
                }*/
                return rep;
            });
        }
    })

    return outtext;
};

exports.garbleText = garbleText;
exports.choicename = "Deferential Gag";
