/***************************
 * High-Security Ball Gag for Gagbot
 * ~ DollLia
 ***************************/

const ballGagCharMaps = require('./ball/ballCharMap.js')

// Object storing a one-to-one character mapping for lowercase only.
// > Code handles changing cases so we don't need to handle 'a' and 'A' separately here.
const highSecGagCharMap = new Map([
    ['a',"h"],
    ['b',"b"],
    ['c',"g"],
    ['d',"d"],
    ['e',"m"],
    ['f',"f"],
    ['g',"g"],
    ['h',"h"],
    ['i',"hm"],       // Unique two-char case
    ['j',"j"],
    ['k',"g"],
    ['l',"l"],
    ['m',"m"],
    ['n',"n"],
    ['o',"h"],
    ['p',"p"],
    ['q',"g"],
    ['r',"r"],
    ['s',"f"],
    ['t',"t"],
    ['u',"h"],
    ['v',"v"],
    ['w',"w"],
    ['x',"m"],
    ['y',"n"],
    ['z',"m"],
]);


// Helper function to garble a text segment.
const garbleText = (text) => {

    //console.log("Text Seg: " + text)

    let output = "";

    let itr = 0;

    // // Optional feature to handle escaping italicized text.
    // let escapedText = false;
    // let escapeChar = '*';       // Do NOT have an escapeChar in the character map above.

    for (const char of text){

        // Handle italicized text by toggling the escape on each instance of the escape character.
        // if(char == escapeChar){escapedText = !escapedText;}

        // Test for uppercase.
        let isUppercase = (char != char.toLowerCase())

        // Get the new character using the above map.
        let newChar = highSecGagCharMap.get(char.toLowerCase());

        // Edit the text if we are not escaped 
        if(newChar){ //(!escapedText && newChar){
            // Append the character with correct case. Only capitalize the first letter. (Ex: "I" becomes "Hm".)
            output += isUppercase ? newChar[0].toUpperCase() + ( newChar[1] ? newChar[1] : "") : newChar;
        }
        else{
            // Append an unmodified character.
            output += char;
        }
        itr++;
    }

    return output
}



exports.garbleText = garbleText;
exports.choicename = "High-Security Ball Gag"




// Unit Tests

// Test 1 - Basic RP Message
// let testMsg = "*Opens her mouth.* I love being gagged! *Twirls happily.* It's so much fun~ meow.com"
// console.log("Unit Test 1 - Basic RP Message:")
// console.log("Original: " + testMsg)
// console.log("Garbled:  " + garbleText(testMsg))

// // Test 2 - Handling BOLDED Text, inside italics, plus random website URLs stapled in.
// let testMsg2 = "Meow meow, I'm a cat! https://stackoverflow.com/questions  *She turns you into a https://stackoverflow.com/questions scratching post with her **CLAWS.*** Nyaaa~"
// console.log("\nUnit Test 2 - Bold Inside & Outside Italics:")
// console.log("Original: " + testMsg2)
// console.log("Garbled:  " + garbleText(testMsg2))

// console.log("\nUnit Test 3 - DollLia is in agony:")
// let testMsg3 = "Do I get to leave my chastity belt now?\nPlease please, http://meow.com PLEASE! *She squirms in agony.*  I CAN'T TAKE IT ANYMORE- *Also https://www.meow.com is a fake website I just came up with.*"
// console.log("Original: " + testMsg3)
// console.log("Garbled:  " + garbleText(testMsg3))

// console.log("\nUnit Test 4 - DollLia made a silly mistake:")
// let testMsg4 = "Meow"
// console.log("Original: " + testMsg4)
// console.log("Garbled:  " + garbleText(testMsg4))


// Test Gag Intensities
let intensityTestMsg = "This unit is a good doll, and will wear all possible ball gags for Mistress."

console.log(`Original: ${intensityTestMsg}\n`)
console.log(`Intensity 1:  ${garbleText(intensityTestMsg, 1)}`)
console.log(`Intensity 2:  ${garbleText(intensityTestMsg, 2)}`)
console.log(`Intensity 3:  ${garbleText(intensityTestMsg, 3)}`)
console.log(`Intensity 4:  ${garbleText(intensityTestMsg, 4)}`)
console.log(`Intensity 5:  ${garbleText(intensityTestMsg, 5)}`)