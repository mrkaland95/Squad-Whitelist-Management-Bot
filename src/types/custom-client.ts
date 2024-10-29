import {Client, ClientOptions, Collection, GatewayIntentBits} from 'discord.js';
import {Command} from "./commands";


class CustomClient extends Client {
    commands: Collection<string, Command>;

    constructor(options: ClientOptions) {
        super(options);
        this.commands = new Collection();
    }
}

export default CustomClient;