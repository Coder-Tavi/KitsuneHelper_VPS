const { MessageEmbed } = require("discord.js");
const cooldown = new Set();
const { getMember, formatDate, errorMessage } = require('../../functions.js');

module.exports = {
    name: "userinfo",
    aliases: ['whois','tellmeabout'],
    category: "information",
    description: "Provides information about a user",
    usage: '<user>',
    timeout: "5 seconds",
    run: async (client, message, args) => {
      if (message.deletable) {
        message.delete();
      }
      if (cooldown.has(message.author.id)) {
        message.reply(`that's a little too fast!`).then(m => m.delete({ timeout: 2500 }));
      } else {
      
      var member = await getMember(message, args.join(" "))
      if(!args.join(" ")) {
        member = message.member
      }

      if(member === "Unknown" || !member) {
        const response = await errorEmbed("Unknwon guild member: No guild member found")
        return message.reply(response)
      }
      var roles = member.roles.cache
            .filter(r => r.id !== message.guild.id)
            .map(r => r)
            .join(", ") || 'none'
      const roleLenCheck = roles.toString();
      if(roleLenCheck >= 1025) {
        roles = `Too many roles (${roles.length})`
      }
      const dDate = member.user.createdAt;
      const gDate = member.joinedAt;

      const embed = new MessageEmbed()
      .setColor(`${member.displayHexColor === '#000000' ? '#ffffff' : member.displayHexColor}`)
      .setThumbnail(`${member.user.avatarURL({dynamic: true, size: 2048})}`)
      .addFields(
        { name: 'User', value: `${member}`, inline: true },
        { name: 'Display Name', value: `${member.displayName}`, inline: true },
        { name: 'Tag', value: `${member.user.tag}`, inline: true },
        { name: 'Discord Join Date', value: `${dDate}`, inline: true },
        { name: 'Guild Join Date', value: `${gDate}`, inline: true },
        { name: 'Roles', value: `${roles}`, inline: true }
      )
      .setTimestamp();

      message.channel.send(embed)
      .catch(e => errorMessage(e, "Userinfo command", message, client));

      cooldown.add(message.author.id);
      setTimeout(() => {
        cooldown.delete(message.author.id);
      }, 5000);
    }
  }
}