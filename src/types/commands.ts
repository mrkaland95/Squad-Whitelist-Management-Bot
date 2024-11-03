import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder
} from "discord.js";


export type Command = {
  data: SlashCommandBuilder;
  execute: (a: ChatInputCommandInteraction) => any,
  autocomplete?: (a: AutocompleteInteraction) => any
}

export type Subcommand = {
  data: SlashCommandSubcommandBuilder;
  execute: (a: ChatInputCommandInteraction) => any,
  autocomplete?: (a: AutocompleteInteraction) => any
}

