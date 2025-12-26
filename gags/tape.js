/*****************************
 * Tape Gag
 * Sealing the lips airtight does not leave any way
 *  to really enunciate anything.
 ***********************************/
// M - Common
// P - 
// H
// G - Hard consonants. [c, k, x, z]
const tapeCharMap = new Map([
    ['a',"n"],
    ['b',"h"],
    ['c',"g"],
    ['d',"n"],
    ['e',"m"],
    ['f',"f"],      // Default
    ['g',"g"],      // Default
    ['h',"h"],      // Default
    ['i',"m"],
    ['j',"n"],
    ['k',"g"],
    ['l',"l"],      // Default
    ['m',"m"],      // Default
    ['n',"n"],      // Default
    ['o',"m"],
    ['p',"f"],      // NOT Default
    ['q',"g"],
    ['r',"m"],
    ['s',"p"],
    ['t',"m"],
    ['u',"n"],
    ['v',"f"],
    ['w',"w"],
    ['x',"g"],
    ['y',"m"],
    ['z',"g"],
]);

const garbleText = (text, intensity) => {
    let output = "";

    // Split the string into words using ANY whitespace/control characters present. Double-spaces may occur, handle it gracefully with a '+'.
    let textParts = text.split(/[\u0000-\u0020]+/)

    // Go word by word.
    for(let x = 0; x < textParts.length; x++){
        let word = ""

        for(let itr = 0; itr < textParts[x].length; itr++){
            let isUppercase = (textParts[x][itr] != textParts[x][itr].toLowerCase())
            if(tapeCharMap.get(textParts[x][itr].toLowerCase())){
                word += isUppercase ? tapeCharMap.get(textParts[x][itr].toLowerCase()).toUpperCase() : tapeCharMap.get(textParts[x][itr].toLowerCase())
            }else{
                word += textParts[x][itr]
            }
        }

        /*****************************
         * Trawl backwards from the end of a word until we hit an alphabetical char.
         * Append "h" or "ph" as necessary.
         * Append "h" if the end is not h
         ***********************/

        //console.log(word)

        let ptr = word.length - 1;                      // Start on final character
        for(ptr; ptr >= 0; ptr--){                       // Iterate BACKWARDS
            if(word[ptr].match(/[a-zA-z]/)){break;}     // Break if we hit alphabetical
        }                                               //  IF we don't hit one, ptr == 0, don't do anything
        //console.log("WORD LEN: " + ptr)

        switch(ptr){
            default:
                // Words should always end in a suitable letter.
                if(ptr >= 0 && !word[ptr].match(/[fnh]/)){word = word.slice(0,ptr+1) + "h" + word.slice(ptr+1)}
                break;
            case 1:

                word = word.slice(0,ptr+1) + "h" + word.slice(ptr+1)
                break;
            case 0:
                word = word.slice(0,ptr+1) + "ph" + word.slice(ptr+1)
                break;
        }
        // console.log(ptr)
        // console.log(word)


        // if(word[word.length-1] != "h"){
        //     word += "h"
        // }

        if(x < textParts.length-1){word += " "}     // Trailing space after each word, EXCEPT the last.
        //console.log(word)
        output += word
    }

    // For high intensity, prepend "-#"

    return output
}


exports.garbleText = garbleText;
exports.choicename = "Tape Gag"




// Unit Tests

//Test Gag Intensities
let intensityTestMsg1   = "The quick brown fox jumps over the lazy dog."    // Classic pangram to test all letters.
let intensityTestMsg2   = "Help me! This crazy woman is trying to turn me into a doll!"
let intensityTestMsg3   = "This unit is a good doll, and   will wear all possible tape gags for its Adminstrator."
let intensityTestMsg4   = "Ha! I, in my brattiness, created  test-4, a test. . .  just to anger the Dollminatrix into domming me!!"

console.log(`Original:          ${intensityTestMsg1}`)
console.log(`Intensity 1-2:     ${garbleText(intensityTestMsg1, 1)}`)
console.log(`Intensity 3-4:     ${garbleText(intensityTestMsg1, 3)}`)
console.log(`Intensity 5-6:     ${garbleText(intensityTestMsg1, 5)}`)
console.log(`Intensity 7-8:     ${garbleText(intensityTestMsg1, 7)}`)
console.log(`Intensity 9-10:    ${garbleText(intensityTestMsg1, 9)}`)

console.log(`\nOriginal:          ${intensityTestMsg2}`)
console.log(`Intensity 1-2:     ${garbleText(intensityTestMsg2, 2)}`)
console.log(`Intensity 3-4:     ${garbleText(intensityTestMsg2, 4)}`)
console.log(`Intensity 5-6:     ${garbleText(intensityTestMsg2, 6)}`)
console.log(`Intensity 7-8:     ${garbleText(intensityTestMsg2, 8)}`)
console.log(`Intensity 9-10:    ${garbleText(intensityTestMsg2, 10)}`)

console.log(`\nOriginal:          ${intensityTestMsg3}`)
console.log(`Intensity 1-2:     ${garbleText(intensityTestMsg3, 2)}`)
console.log(`Intensity 3-4:     ${garbleText(intensityTestMsg3, 4)}`)
console.log(`Intensity 5-6:     ${garbleText(intensityTestMsg3, 6)}`)
console.log(`Intensity 7-8:     ${garbleText(intensityTestMsg3, 8)}`)
console.log(`Intensity 9-10:    ${garbleText(intensityTestMsg3, 10)}`)

console.log(`\nOriginal:          ${intensityTestMsg4}`)
console.log(`Intensity 1-2:     ${garbleText(intensityTestMsg4, 2)}`)
console.log(`Intensity 3-4:     ${garbleText(intensityTestMsg4, 4)}`)
console.log(`Intensity 5-6:     ${garbleText(intensityTestMsg4, 6)}`)
console.log(`Intensity 7-8:     ${garbleText(intensityTestMsg4, 8)}`)
console.log(`Intensity 9-10:    ${garbleText(intensityTestMsg4, 10)}`)