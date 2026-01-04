const { WebhookClient, AttachmentBuilder } = require('discord.js');
const fs = require('fs')
const path = require('path');

// Load all .png files into the bot as emoji, then assign them to process.emojis. 
// This can be used to allow the bot's emojis to function elsewhere. 
const loadEmoji = async (client) => {
    let emojifileslocalpath = path.resolve(__dirname, "..", "emoji");
    let emojifileslocal = fs.readdirSync(emojifileslocalpath).filter(file => file.endsWith('.png')).map((emoji) => `${emoji.slice(0,-4)}`);
    let emojisbot = await client.application.emojis.fetch();
    let emojisbotfiltered = emojisbot.map((emoji) => emoji.name);
    let sortedupload = emojifileslocal.filter(f => !emojisbotfiltered.includes(f)) // Sort out what needs to be uploaded
    sortedupload.forEach((s) => {
        client.application.emojis.create({ attachment: path.resolve(emojifileslocalpath, `${s}.png`), name: s }).then((emoji) => {
            console.log(`Uploaded emoji with name: ${emoji.name}. ${emoji}`)
        }).catch((err) => { console.log(err) })
    })
    emojisbot = await client.application.emojis.fetch();
    process.emojis = {};
    for (const emoji of emojisbot.keys()) {
        process.emojis[emojisbot.get(emoji).name] = `${emojisbot.get(emoji)}`
    }
}

const messageSend = async (threadId, str, avatarURL, username) => {
    // When called, we want to do something with str and then send it.
    const webhookClient = new WebhookClient({ 
        id: process.env.WEBHOOKID, 
        token: process.env.WEBHOOKTOKEN 
    })

    webhookClient.send({
        threadId: threadId,
        content: str,
        username: username,
        avatarURL: avatarURL,
        allowedMentions: {
            "parse": []
        }
    }).then(() => {
        return true
    })
}

const messageSendImg = async (threadId, str, avatarURL, username, msgid, spoiler) => {
    // When called, we want to do something with str and then send it.
    const webhookClient = new WebhookClient({ 
        id: process.env.WEBHOOKID, 
        token: process.env.WEBHOOKTOKEN 
    })

    let spoilertext = spoiler ? "SPOILER_" : ""

    let imageonsystem = `./${spoilertext}downloadedimage_${msgid}.png`
    
    let file = new AttachmentBuilder(imageonsystem, { name: imageonsystem } );

    webhookClient.send({
        threadId: threadId,
        content: str,
        username: username,
        avatarURL: avatarURL,
        files: [file],
        allowedMentions: {
            "parse": []
        }
    }).then(() => {
        return true
    })
}

const messageSendDev = async (str, avatarURL, username) => {
    // When called, we want to do something with str and then send it.
    const webhookClient = new WebhookClient({ 
        id: process.env.WEBHOOKIDDEV, 
        token: process.env.WEBHOOKTOKENDEV 
    })

    webhookClient.send({
        content: str,
        username: username,
        avatarURL: avatarURL
    }).then(() => {
        return true
    })
}

exports.messageSend = messageSend;
exports.messageSendImg = messageSendImg;
exports.messageSendDev = messageSendDev;

exports.loadEmoji = loadEmoji;