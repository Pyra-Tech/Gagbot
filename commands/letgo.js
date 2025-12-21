const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { their } = require("./../functions/pronounfunctions.js");
const { getConsent, handleConsent } = require("./../functions/interactivefunctions.js");
const { tryOrgasm } = require("../functions/vibefunctions.js");

module.exports = {
  data: new SlashCommandBuilder().setName("letgo").setDescription(`Try to get release`),

  async execute(interaction) {
    try {
      // CHECK IF THEY CONSENTED! IF NOT, MAKE THEM CONSENT
      if (!getConsent(interaction.user.id)?.mainconsent) {
        await handleConsent(interaction, interaction.user.id);
        return;
      }

      if (tryOrgasm(interaction.user.id)) {
        interaction.reply(`${interaction.user} is overwhelmed with pleasure and releases it in an earth-shattering orgasm!`);
      } else {
        interaction.reply(`${interaction.user} tries to get over the edge but is denied by ${their(interaction.user.id)} own body!`);
      }
    } catch (err) {
      console.log(err);
    }
  },
};
