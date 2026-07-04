require("dotenv").config();
const { REST, Routes, SlashCommandBuilder } = require("discord.js");

const commands = [
  new SlashCommandBuilder().setName("ping").setDescription("Check bot"),
  new SlashCommandBuilder()
    .setName("embed")
    .setDescription("Create embed")
    .addStringOption(opt =>
      opt.setName("text").setDescription("Embed text").setRequired(true)
    ),
  new SlashCommandBuilder().setName("ticket").setDescription("Create ticket"),
].map(cmd => cmd.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  await rest.put(
    Routes.applicationCommands(process.env.CLIENT_ID),
    { body: commands }
  );

  console.log("Slash commands registered 😎");
})();
