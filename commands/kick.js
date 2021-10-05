const { Client, CommandInteraction, CommandInteractionOptionResolver } = require(`discord.js`);
const { SlashCommandBuilder } = require(`@discordjs/builders`);
const { interactionToConsole, interactionEmbed } = require(`../functions.js`);
const cooldown = new Set();

module.exports = {
  name: `kick`,
  data: new SlashCommandBuilder()
  .setName(`kick`)
  .setDescription(`Removes a user from the server. They can rejoin with an invite`)
  .addUserOption(option => {
    return option
    .setName(`user`)
    .setDescription(`The user to kick from the server`)
    .setRequired(true)
  })
  .addStringOption(option => {
    return option
    .setName(`reason`)
    .setDescription(`The reason for kicking the user`)
    .setRequired(false)
  }),
  /**
   * @param {Client} client Client object
   * @param {CommandInteraction} interaction Interaction Object
   * @param {CommandInteractionOptionResolver} options Array of InteractionCommand options
   */
  run: async (client, interaction, options) => {
    if(cooldown.has(interaction.user.id)) {
      return interactionEmbed(2, `[ERR-CLD]`, interaction, client, true)
    } else {
      const member = options.getMember(`user`);
      const reason = options.getString(`reason`) ?? `No reason provided`;

      if(!interaction.member.permissions.has(`KICK_MEMBERS`)) return interactionEmbed(3, `[ERR-UPRM]`, interaction, client, true);
      if(!interaction.guild.me.permissions.has(`KICK_MEMBERS`)) return interactionEmbed(3, `[ERR-BPRM]`, interaction, client, true);
      if(!member.manageable) return interactionEmbed(3, `[ERR-BPRM]`, interaction, client, true);

      try {
        await member.kick({ reason: reason });
        interactionEmbed(1, `${member} (${member.id}) was kicked for: ${reason}`);
      } catch(e) {
        interactionToConsole(`Failed to kick \`${member.id}\` from \`${interaction.guild.id}\``, `kick.js (Line 40)`, interaction, client);
      }

      cooldown.add(interaction.user.id);
      setTimeout(() => {
        cooldown.delete(interaction.user.id);
      }, 5000);
    }
  }
}