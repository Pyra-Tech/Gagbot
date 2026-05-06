const { SlashCommandBuilder, MessageFlags, TextDisplayBuilder } = require("discord.js");
const { calculateTimeout } = require("./../functions/timefunctions.js");
const { getHeavy, assignHeavy, commandsheavy, convertheavy, heavytypes, getBaseHeavy } = require("./../functions/heavyfunctions.js");
const { getPronouns } = require("./../functions/pronounfunctions.js");
const { getConsent, handleConsent, handleExtremeRestraint, handleMajorRestraint } = require("./../functions/interactivefunctions.js");
const { getText } = require("./../functions/textfunctions.js");
const { default: didYouMean, ReturnTypeEnums } = require("didyoumean2");
const { getUserTags } = require("../functions/configfunctions.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("delve")
		.setDescription(`ALPHA - Only available to Enraa`),
	async execute(interaction) {
		try {
            if (interaction.user.id != process.client.application.owner.id) {
                interaction.reply(`You're not <@${process.client.application.owner.id}>. This command is currently in development and is not available for others to run.`)
                return;
            }
            interaction.reply("You are DELVING!")
		} catch (err) {
			console.log(err);
		}
	}
};
