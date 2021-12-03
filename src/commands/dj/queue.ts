import { Message, Permissions, MessageEmbed } from "discord.js";
import { ICommand, ICommandArgs } from "../../InterfaceDefinitions";
import { queue } from "../../server";

async function execute({message, args, client}: ICommandArgs){
    const att = new MessageEmbed();
    const thisQueue = queue.get(message.guild.id);

    if(!thisQueue){
        return message.channel.send("Sem fila maninhoo.");
    }

    att.setTitle(`Fila atual de ${message.guild.name}`);
    thisQueue.songs.map((song, i) => att.addField(`#${i+1}`, song.original_title));
    
    message.channel.send({ embeds: [att] });
}
const Command: ICommand = {
    id: "queue",
    longHelp: "Da uma olhada como ta indo a fila do servidor.",
    shortHelp: "ShortHelp",
    permissions: parseInt(`${Permissions.FLAGS.SEND_MESSAGES}`), // Fix this later
    execute
}

export default Command;