const { ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, PermissionsBitField } = require("discord.js")


const configoptions = {
    "Arousal": {
        "arousalsystem": {
            name: "Arousal System",
            desc: "Which Arousal system to use?",
            choices: [
                {
                    name: "Off",
                    helptext: "*Arousal disabled*",
                    select_function: (userID) => { 
                        removeVibe(userID) // Delete vibes when disabling arousal
                    },
                    value: 0,
                    style: ButtonStyle.Danger
                },
                {
                    name: "Static Arousal",
                    helptext: "Static Arousal (when vibed)",
                    select_function: (userID) => { return false },
                    value: 1,
                    style: ButtonStyle.Secondary
                },
                {
                    name: "Dynamic Arousal",
                    helptext: "Dynamic Arousal",
                    select_function: (userID) => { return false },
                    value: 2,
                    style: ButtonStyle.Secondary
                }
            ],
            default: 2,
            disabled: () => { return false } // if true, button is greyed out
        },
        "fumbling": {
            name: "Key Fumbling",
            desc: "Who can fumble your keys (from Arousal) and fail to unlock you?",
            choices: [
                {
                    name: "Disabled",
                    helptext: "*Fumbling is disabled*",
                    select_function: (userID) => { return false },
                    value: "disabled",
                    style: ButtonStyle.Danger
                },
                {
                    name: "Self Only",
                    helptext: "Can fumble your own keys",
                    select_function: (userID) => { return false },
                    value: "self",
                    style: ButtonStyle.Secondary
                },
                {
                    name: "Self and Others",
                    helptext: "You and others can fumble your keys",
                    select_function: (userID) => { return false },
                    value: "everyone",
                    style: ButtonStyle.Secondary
                }
            ],
            default: "self",
        },
        "keyloss": {
            name: "Key Loss",
            desc: "Can fumbling keys cause the keys to be lost?",
            choices: [
                {
                    name: "Disabled",
                    helptext: "*Key Loss is disabled*",
                    select_function: (userID) => { return false },
                    value: "disabled",
                    style: ButtonStyle.Danger
                },
                {
                    name: "Enabled",
                    helptext: "**Your keys can be lost**",
                    select_function: (userID) => { return false },
                    value: "enabled",
                    style: ButtonStyle.Secondary
                }
            ],
            default: "disabled",
            disabled: (userID) => { return (getOption(userID,"fumbling") == "disabled") } // if true, button is greyed out
        },
        "blessed_luck": {
            name: "Blessed Luck",
            desc: "Should failed rolls from fumbling contribute to future rolls?",
            choices: [
                {
                    name: "No",
                    helptext: "*Blessed Luck is disabled*",
                    select_function: (userID) => { return false },
                    value: "disabled",
                    style: ButtonStyle.Danger
                },
                {
                    name: "Yes",
                    helptext: "Failed rolls add to future success chance",
                    select_function: (userID) => { return false },
                    value: "enabled",
                    style: ButtonStyle.Secondary
                },
            ],
            default: "enabled",
            disabled: (userID) => { return (getOption(userID,"fumbling") == "disabled") }
        }
    },
    "General": {
        "keygiving": {
            name: "Key Giving",
            desc: "Are keyholders allowed to give your keys to others?",
            choices: [
                {
                    name: "No",
                    helptext: "*Key giving is disabled*",
                    select_function: (userID) => { return false },
                    value: "disabled",
                    style: ButtonStyle.Danger
                },
                {
                    name: "Prompt",
                    helptext: "You will be prompted for key transfers",
                    select_function: (userID) => { return false },
                    value: "prompt",
                    style: ButtonStyle.Secondary
                },
                {
                    name: "Automatic",
                    helptext: "⚠️ **You will accept keygiving requests automatically**",
                    select_function: (userID) => { return false },
                    value: "prompt",
                    style: ButtonStyle.Secondary
                },
            ],
            default: "prompt",
            disabled: () => { return false }
        },
        "removebondage": {
            name: "Prompt to Remove Non-keyed",
            desc: "Should you be prompted for others to /ungag you, etc?",
            choices: [
                {
                    name: "Everyone",
                    helptext: "Prompt for anyone to remove non-keyed bondage",
                    select_function: (userID) => { return false },
                    value: "all",
                    style: ButtonStyle.Secondary
                },
                {
                    name: "Everyone except Binder",
                    helptext: "Prompt for anyone besides who put something on you",
                    select_function: (userID) => { return false },
                    value: "all_binder",
                    style: ButtonStyle.Secondary
                },
                {
                    name: "Everyone except Binder and Keyholder(s)",
                    helptext: "Prompt for anyone besides who put something on you or keyholders",
                    select_function: (userID) => { return false },
                    value: "all_binder_and_keyholder",
                    style: ButtonStyle.Secondary
                },
                {
                    name: "Disabled",
                    helptext: "Automatically allow bondage to be removed",
                    select_function: (userID) => { return false },
                    value: "accept",
                    style: ButtonStyle.Secondary
                },
            ],
            default: "accept",
            disabled: () => { return false }
        }
    }
} 

function generateConfigModal(interaction, menuset = "General", page) {
    // Construct the list of options for a given menu set
    let pageoptions = [];
    Object.keys(configoptions[menuset]).forEach((k) => {
        let buttonsection = new SectionBuilder()
            .addTextDisplayComponents(
                (textdisplay) => textdisplay.setContent(`## ${configoptions[menuset][k].name}`),
                (textdisplay) => textdisplay.setContent(`${configoptions[menuset][k].desc}`),
                (textdisplay) => textdisplay.setContent(`-# ${configoptions[menuset][k].choices.find((f) => f.value == getOption(userID,k))?.helptext}`)
            )
            .setButtonAccessory((button) =>
                button.setCustomId(`pageopt_${k}`)
                    .setLabel(configoptions[menuset][k].choices.find((f) => f.value == getOption(userID,k))?.name)
                    .setStyle(configoptions[menuset][k].choices.find((f) => f.value == getOption(userID,k))?.style)
                    .setDisabled(configoptions[menuset][k].disabled(interaction.user.id))
            )
        pageoptions.push(buttonsection)
    })

    // Construct the menu selector
    let menupageoptions = new StringSelectMenuBuilder()
        .setCustomId('menuselector')
        .setPlaceholder('Choose Menu Section')
    
    let menupageoptionsarr = []
    Object.keys(configoptions).forEach((k) => {
        let opt = new StringSelectMenuOptionBuilder()
            .setLabel(k)
            .setValue(`menuopt_${k}`)
        menupageoptionsarr.push(opt)
    })

    // If the user is a moderator on that server, allow configuration of that server
    // Note, they must have global manage messages permission.
    if (interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
        let opt = new StringSelectMenuOptionBuilder()
            .setLabel("Server")
            .setValue(`menuopt_Server`)
    }

    // If the user is the owner of the bot
    if (interaction.user.id == interaction.client.application.owner.id) {
        let opt = new StringSelectMenuOptionBuilder()
            .setLabel("Server")
            .setValue(`menuopt_Server`)
    }

    let menunavigationactionrow = new ActionRowBuilder()
        .addComponents()

    {
        type: ComponentType.ActionRow,
        components: [
            {
            type: ComponentType.StringSelect,
            custom_id: `list-select-${page}-${+details}`,
            options: restraintOptions,
            placeholder: "Change restraint type...",
            },
        ],
    },
        {
        type: ComponentType.ActionRow,
        components: [
            {
            type: ComponentType.Button,
            custom_id: `list-${type}-${page - 1}-${+details}`,
            label: "← Prev",
            disabled: page == 0,
            style: ButtonStyle.Secondary,
            },
            {
            type: ComponentType.Button,
            custom_id: `list-${type}-${page}-${+details}`,
            label: `Page ${page + 1} of ${maxPage + 1}`,
            disabled: true,
            style: ButtonStyle.Secondary,
            },
            {
            type: ComponentType.Button,
            custom_id: `list-${type}-${page + 1}-${+details}`,
            label: "Next →",
            disabled: page == maxPage,
            style: ButtonStyle.Secondary,
            },
            {
            type: ComponentType.Button,
            custom_id: `list-${type}-${page}-${+!details}`,
            label: details ? "Hide details" : "Show details",
            style: ButtonStyle.Secondary,
            },
        ],
        },
}

function setOption(userID, option, choice) {
    if (process.configs == undefined) { process.configs = {} } 
    if (process.configs.users == undefined) { process.configs.users = {} } 
    if (process.configs.users[userID] == undefined) { process.configs.users[userID] = {} } 
    process.configs.users[userID][option] = choice;
}

function getOption(userID, option) {
    if (process.configs == undefined) { process.configs = {} } 
    if (process.configs.users == undefined) { process.configs.users = {} } 
    if (process.configs.users[userID] == undefined) { 
        process.configs.users[userID] = {} 
        initializeOptions(userID)
    } 
    return process.configs.users[userID][option];
}

function initializeOptions(userID) {
    let arousaloptionpages = Object.keys(configoptions["Arousal"])
    let generaloptionpages = Object.keys(configoptions["General"])
    arousaloptionpages.forEach((k) => {
        process.configs.users[userID][k] = configoptions["Arousal"][k].default
    })
    generaloptionpages.forEach((k) => {
        process.configs.users[userID][k] = configoptions["General"][k].default
    })
    fs.writeFileSync(`${process.GagbotSavedFileDirectory}/configs.txt`, JSON.stringify(process.configs));
}