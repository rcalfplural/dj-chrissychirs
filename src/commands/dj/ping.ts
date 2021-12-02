import { Message, Permissions } from "discord.js";
import { ICommand, ICommandArgs } from "../../InterfaceDefinitions";

async function execute({message, args, client}: ICommandArgs){
    message.channel.send("Pong: "+String(Date.now()));
}
const Command: ICommand = {
    id: "ping",
    longHelp: "This is the command's long help",
    shortHelp: "ShortHelp",
    permissions: parseInt(`${Permissions.FLAGS.SEND_MESSAGES}`), // Fix this later
    execute
}

export default Command;