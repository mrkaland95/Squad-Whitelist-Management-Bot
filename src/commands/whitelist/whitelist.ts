import {AutocompleteInteraction, ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";
import add from "./subcommands/add"
import view from "./subcommands/show";
import remove from "./subcommands/remove";


export default {
    data: new SlashCommandBuilder()
        .setName('whitelist')
        .setDescription(`Manages a users whitelist.`)
        .addSubcommand(add.data)
        .addSubcommand(view.data)
        .addSubcommand(remove.data),

    async execute(interaction: ChatInputCommandInteraction) {
        // Ephemeral means visible only to the user that called the command.
        await interaction.deferReply({ ephemeral: true })

        const subCommands = [
            add,
            view,
            remove
        ]

        for (const cmd of subCommands) {
            if (cmd.data.name === interaction.options.getSubcommand()) {
                const value = interaction.options.getString('steamid')
                console.log(`User ${interaction.user.globalName} used command: Whitelist - ${cmd.data.name} - Value: ${value}`)
                await cmd.execute(interaction)
            }
        }
    },
    // This needs to be defined for any subcommands to have autocomplete.
    async autocomplete(interaction: AutocompleteInteraction) {
        const subCommands = [
            remove
        ]

        for (const cmd of subCommands) {
            if (cmd.data.name === interaction.options.getSubcommand())
                await cmd.autocomplete(interaction)
        }
    }
}






