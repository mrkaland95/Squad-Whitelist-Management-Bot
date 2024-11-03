import {ChatInputCommandInteraction, CommandInteraction, SlashCommandBuilder} from "discord.js";
import { Subcommand } from "../../types/commands";
import * as fs from "fs";
import path from "path";

const slashCommand = new SlashCommandBuilder()
    .setName('admin')
    .setDescription(`Managed a user`);


const subCommandFiles = fs.readdirSync(path.join(__dirname, 'subcommands')).filter(file => (file.endsWith('.js') || file.endsWith('.ts')))
const subCommands: Subcommand[] = []

for (const file of subCommandFiles) {
    const cmd: Subcommand = require(`./subcommands/${file}`)?.default

    // @ts-ignore
    if (cmd?.data && cmd?.execute) {
        slashCommand.addSubcommand(cmd.data)
        subCommands.push(cmd)
    }
}

async function execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: true })

    const subCommand = interaction.options.getSubcommand()

    for (const cmd of subCommands) {
        if (cmd.data.name === subCommand) {
            return await cmd.execute(interaction)
        }
    }
}

export default {
    data: slashCommand,
    execute: execute
}
