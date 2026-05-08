const { SlashCommandBuilder } = require("discord.js");
const { handleDelveInteraction } = require("../functions/delvefunctions.js");

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
            handleDelveInteraction(interaction)
		} catch (err) {
			console.log(err);
		}
	}
};
