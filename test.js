let replacewith = "he";
let outtext = `Good USER_TRY are chaste.`
outtext = outtext.replaceAll("USER_TRY", () => {
    if (replacewith == "she") { return "girls" }
    if (replacewith == "he") { return "boys" }
    return "toys"
});

console.log(outtext)