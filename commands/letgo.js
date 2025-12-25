const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { their } = require("./../functions/pronounfunctions.js");
const { getConsent, handleConsent } = require("./../functions/interactivefunctions.js");
const { tryOrgasm, getChastity, setArousalCooldown } = require("../functions/vibefunctions.js");
const { getHeavy } = require("../functions/heavyfunctions.js");
const { getText } = require("./../functions/textfunctions.js");

module.exports = {
  data: new SlashCommandBuilder().setName("letgo").setDescription(`Try to get release`),

  async execute(interaction) {
    try {
      // CHECK IF THEY CONSENTED! IF NOT, MAKE THEM CONSENT
      if (!getConsent(interaction.user.id)?.mainconsent) {
        await handleConsent(interaction, interaction.user.id);
        return;
      }

      // Build data tree:
      let data = {
        textarray: "texts_letgo",
        textdata: {
          interactionuser: interaction.user,
          targetuser: interaction.user, // Not needed, but required for function parsing anyway.
          c1: getHeavy(interaction.user.id)?.type, // heavy bondage type
          c2: intensitytext, // gag tightness 
          c3: gagname, // New gag being put on the wearer
          c4: oldgagname // Old gag the wearer has on
        }
      }

      // I'm restructuring this to follow consistency - sorry sam! 
      if (getHeavy(interaction.user.id))


      if (tryOrgasm(interaction.user.id)) {
        // User was able to orgasm! 
        interaction.reply(`${interaction.user} is overwhelmed with pleasure and releases it in an earth-shattering orgasm!`);
      } else {
        if (getChastity(interaction.user.id)) {
          interaction.reply(`${interaction.user} tries to get over the edge but is denied by ${their(interaction.user.id)} steel prison!`);
          return;
        }

        const heavy = getHeavy(interaction.user.id);
        if (heavy) {
          interaction.reply(`${interaction.user} tries to get over the edge but is denied by ${their(interaction.user.id)} ${heavy.type}!`);
          return;
        }

        // cool off response, replace with something good
        interaction.reply(`[TMP] cool off`);
        setArousalCooldown(interaction.user.id);
      }
    } catch (err) {
      console.log(err);
    }
  },
};
