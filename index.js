console.log("RILY bot is alive 😎");
require("dotenv").config();
const {
  Client,
  GatewayIntentBits,
  Partials,
  EmbedBuilder,
  PermissionsBitField,
  ChannelType,
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

// ================= READY =================
client.once("ready", () => {
  console.log(`RILY PRO ONLINE 😎 ${client.user.tag}`);
});

// ================= PREFIX COMMANDS =================
client.on("messageCreate", async (message) => {
  if (!message.guild || message.author.bot) return;

  const args = message.content.slice(1).split(" ");
  const cmd = args.shift().toLowerCase();

  // PING
  if (cmd === "ping") {
    message.reply("🏓 Pong!");
  }

  // KICK
  if (cmd === "kick") {
    if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers))
      return message.reply("❌ No permission");

    const user = message.mentions.members.first();
    if (!user) return message.reply("Mention user");

    user.kick();
    message.channel.send(`👢 Kicked ${user.user.tag}`);
  }

  // BAN
  if (cmd === "ban") {
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers))
      return message.reply("❌ No permission");

    const user = message.mentions.members.first();
    if (!user) return message.reply("Mention user");

    user.ban();
    message.channel.send(`🔨 Banned ${user.user.tag}`);
  }

  // LOCK CHANNEL
  if (cmd === "lock") {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels))
      return message.reply("❌ No permission");

    message.channel.permissionOverwrites.edit(message.guild.roles.everyone, {
      SendMessages: false,
    });

    message.channel.send("🔒 Channel locked");
  }

  // ADD ROLE
  if (cmd === "addrole") {
    const user = message.mentions.members.first();
    const role = message.mentions.roles.first();

    if (!user || !role) return message.reply("Usage: !addrole @user @role");

    user.roles.add(role);
    message.channel.send("✅ Role added");
  }
});

// ================= SLASH COMMANDS =================
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  // /ping
  if (interaction.commandName === "ping") {
    interaction.reply("🏓 Pong!");
  }

  // /embed
  if (interaction.commandName === "embed") {
    const text = interaction.options.getString("text");

    const embed = new EmbedBuilder()
      .setTitle("RILY EMBED")
      .setDescription(text)
      .setColor("Purple");

    interaction.reply({ embeds: [embed] });
  }

  // /ticket
  if (interaction.commandName === "ticket") {
    const channel = await interaction.guild.channels.create({
      name: `ticket-${interaction.user.username}`,
      type: ChannelType.GuildText,
    });

    channel.send("🎫 Ticket created. Staff will come soon.");
    interaction.reply({ content: "Ticket created!", ephemeral: true });
  }
});

// ================= AUTOMOD (SIMPLE) =================
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  // anti-link
  if (message.content.includes("http")) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      message.delete();
      message.channel.send("🚫 Links not allowed");
    }
  }
});

client.login(process.env.TOKEN);
