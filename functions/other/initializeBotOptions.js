import { configoptions } from "../../lists/configoptions.js";

/**********
 * Sets all options to the defaults for the bot.
 * 
 * ---
 * ##### *No return value*
 **********/
export function initializeBotOptions() {
    if (process.configs == undefined) {
        process.configs = {};
    }
    if (process.configs.botglobal == undefined) {
        process.configs.botglobal = {};
    }
    Object.keys(configoptions["Bot"]).forEach((k) => {
        process.configs.botglobal[k] = configoptions["Bot"][k].default;
    });
    if (process.readytosave == undefined) {
        process.readytosave = {};
    }
    process.readytosave.configs = true;
}