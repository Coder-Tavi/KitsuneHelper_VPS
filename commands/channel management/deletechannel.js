const { toConsole, responseEmbed } = require("../../functions");
const cooldown = new Set();
const auth = new Set();

module.exports = {
    name: "deletechannel",
    aliases: ["delchannel"],
    category: "channel management",
    description: "Deletes a given channel",
    usage: "<channel>",
    cooldown: "5 seconds",
    run: async (client, message, args) => {
      if(message.deletable) {
        message.delete()
      }
      if(cooldown.has(message.author.id)) {
        return message.reply("that's a little too quick!").then(m => m.delete({ timeout: 2500 }));
      } else {
      auth.add("669051415074832397")

      if(message.member.hasPermission("MANAGE_CHANNELS")) {
        auth.add(message.author.id);
      }
      if(!auth.has(message.author.id)) responseEmbed(3, "Unauthorized: You don't have MANAGE CHANNELS", "CHANNEL", message, client)
      if(!message.guild.me.hasPermission("MANAGE_CHANNELS")) responseEmbed(3, "Unauthorized: I don't have MANAGE CHANNELS", "CHANNEL", message, client)

      if(!args[0]) responseEmbed(3, "Bad Usage: You must supply a channel", "CHANNEL", message, client)

      const toDelete = message.guild.channels.cache.get(`${args[0]}`)
      || message.guild.channels.cache.find(c => c.name === `${args.slice(0).join(" ")}`)
      || message.mentions.channels.first();

      if(!toDelete) responseEmbed(3, "Not Found: No channel found for " + toDelete)

      toDelete.delete({ reason: `Moderator: ${message.author.tag}` })
        .then(responseEmbed(1, "The channel was deleted", "CHANNEL", message, client))
        .catch(e => toConsole(e, "deletechannel.js (Line 35)", message, client))

      auth.delete(message.author.id);
      cooldown.add(message.author.id);
      setTimeout(() => {
        cooldown.delete(message.author.id);
      }, 5000)
    }
  }
}
