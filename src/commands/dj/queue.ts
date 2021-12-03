import { Message, Permissions, MessageEmbed } from "discord.js";
import { ICommand, ICommandArgs } from "../../InterfaceDefinitions";
import { queue } from "../../server";

async function execute({message, args, client}: ICommandArgs){
    try{
        const att = new MessageEmbed();
        const thisQueue = queue.get(message.guild.id);
    
        if(!thisQueue){
            return message.channel.send("Sem fila maninhoo.");
        }
        console.log("Queue: "+thisQueue.songs);
        att.setTitle(`Fila atual de ${message.guild.name}`);
        thisQueue.songs.map((song, i) => att.addField(`#${i+1}`, song.original_title));
        
        message.channel.send({ embeds: [att] });
    }catch(err){
        console.error(err);
        return message.channel.send("Ocorreu um erro. Perdão pela incoveniencia");
    }
}
const Command: ICommand = {
    id: "queue",
    longHelp: ":sleeping: Da uma olhada como ta indo a fila do servidor.",
    shortHelp: "ShortHelp",
    permissions: parseInt(`${Permissions.FLAGS.SEND_MESSAGES}`), // Fix this later
    execute
}

export default Command;