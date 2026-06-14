import { configoptions } from "../../lists/configoptions.js";

/**********
 * Sets all options to the defaults for a server. 
 * 
 * - (server id) serverID - The server to set defaults for
 * ---
 * ##### *No return value*
 **********/
export function initializeServerOptions(serverID) {
    if (process.configs == undefined) {
        process.configs = {};
    }
    if (process.configs.servers == undefined) {
        process.configs.servers = {};
    }
    if (process.configs.servers[serverID] == undefined) {
        process.configs.servers[serverID] = {};
    }
    Object.keys(configoptions["Server"]).forEach((k) => {
        process.configs.servers[serverID][k] = configoptions["Server"][k].default;
    });
    if (process.readytosave == undefined) {
        process.readytosave = {};
    }
    process.readytosave.configs = true;
}