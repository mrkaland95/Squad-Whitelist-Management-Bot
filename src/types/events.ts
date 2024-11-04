import {BaseInteraction, Events} from "discord.js";
import customClient from "./custom-client";

export interface DiscordEvent {
    name: Events,
    once: boolean,
    execute: (a: BaseInteraction, b: customClient) => any
}