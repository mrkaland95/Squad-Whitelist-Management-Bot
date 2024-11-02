import {CommandInteraction, SlashCommandBuilder} from "discord.js";
import add from "./subcommands/add"
import view from "./subcommands/view";


export default {
    data: new SlashCommandBuilder()
        .setName('whitelist')
        .setDescription(`Manages a user's whitelist of other users.`)
        .addSubcommand(add.data)
        .addSubcommand(view.data),

    async execute(interaction: CommandInteraction) {
        // Ephemeral means visible only to the user that called the command.
        await interaction.deferReply({ ephemeral: true })

        const subCommands = [
            add,
            view
        ]

        for (const cmd of subCommands) {
            // The interaction.options object has a "getSubcommand" method, but for some reason TypeScript
            // Does not play nice with it, so we do this instead.

            if (interaction.options.data[0].name === cmd.data.name) {
                await cmd.execute(interaction)
            }
        }
    }
}






