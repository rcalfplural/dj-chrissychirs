import { Message, Permissions } from "discord.js";
import { ICommand, ICommandArgs } from "../../InterfaceDefinitions";

async function execute({message, args, client}: ICommandArgs){
    return message.channel.send("Pong");
}
const Command: ICommand = {
    id: "ping",
    longHelp: ":ping_pong: pong",
    shortHelp: "ShortHelp",
    permissions: parseInt(`${Permissions.FLAGS.SEND_MESSAGES}`), // Fix this later
    execute
}

export default Command;