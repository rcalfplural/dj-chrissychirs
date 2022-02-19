import { Message, Permissions, VoiceChannel, StageChannel, MessageEmbed } from "discord.js";
import { ICommand, ICommandArgs } from "../../InterfaceDefinitions";
import commands from "../";
import { queue } from "../../server";

async function execute({message, args, client}: ICommandArgs){
    const pages = [];
    const embed = new MessageEmbed();
    embed.setTitle("Aqui estão as palavrinhas magicas.");
    commands.map((c, i)=>{
        embed.addField(c.id, c.longHelp);
    });
    embed.setFooter("v0.0.2 | Powered by BruhCrusaderCity", "https://avatars.githubusercontent.com/u/53186400?v=4");
    return message.channel.send({ embeds: [embed] });
}
const Command: ICommand = {
    id: "help",
    longHelp: ":sos: Pq que eu to tentando ser engraçado com essas descrições?",
    shortHelp: "HELP",
    permissions: parseInt(`${Permissions.FLAGS.SEND_MESSAGES}`), // Fix this later
    execute
}

export default Command;