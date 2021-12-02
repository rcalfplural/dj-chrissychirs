import { Message, Permissions, MessageEmbed } from "discord.js";
import { ICommand, ICommandArgs } from "../../InterfaceDefinitions";
import { queue } from "../../server";

async function execute({message, args, client}: ICommandArgs){
    const att = new MessageEmbed();
    const thisQueue = queue.get(message.guild.id);

    if(!thisQueue){
        return message.channel.send("There is no queue here mate.");
    }

    att.setTitle(`${message.guild.name}'s current queue'`);
    thisQueue.songs.map((song, i) => att.addField(`#${i+1}`, song.original_title));
    
    message.channel.send({ embeds: [att] });
}
const Command: ICommand = {
    id: "queue",
    longHelp: "Check how is the server queue going.",
    shortHelp: "ShortHelp",
    permissions: parseInt(`${Permissions.FLAGS.SEND_MESSAGES}`), // Fix this later
    execute
}

export default Command;