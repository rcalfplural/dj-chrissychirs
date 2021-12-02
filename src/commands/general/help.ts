import { Message, Permissions, VoiceChannel, StageChannel, MessageEmbed } from "discord.js";
import { ICommand, ICommandArgs } from "../../InterfaceDefinitions";
import commands from "../";
import { queue } from "../../server";

async function execute({message, args, client}: ICommandArgs){
    const pages = [];
    const embed = new MessageEmbed();
    embed.setTitle("Here is your commands and it's brief explanation");
    commands.map((c, i)=>{
        embed.addField(c.id, c.longHelp);
    });

    return message.channel.send({ embeds: [embed] });
}
const Command: ICommand = {
    id: "help",
    longHelp: "You used this rn didn't you?",
    shortHelp: "HELP",
    permissions: parseInt(`${Permissions.FLAGS.SEND_MESSAGES}`), // Fix this later
    execute
}

export default Command;