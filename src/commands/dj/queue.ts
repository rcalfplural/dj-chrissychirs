import { Message, Permissions, MessageEmbed } from "discord.js";
import { ICommand, ICommandArgs, IYoutubeVideoData } from "../../InterfaceDefinitions";
import { queue } from "../../server";
import { List2Array, ListPrint } from "../../utils/Lists";

async function execute({message, args, client}: ICommandArgs){
    try{
        const att = new MessageEmbed();
        const thisQueue = (message.guild) && queue.get(message.guild.id);

        if(!message.member) return;
        
    
        if(!thisQueue){
            return message.channel.send("Sem fila maninhoo.");
        }
        att.setTitle(`Fila atual de ${message.guild.name}`);
        const songsArray = List2Array(thisQueue);
        console.log("NEXT: ", thisQueue.songsHead?.next);
        console.log("Queue: "+songsArray);
        songsArray.map((song, i) => {
            if(!song) return;
            att.addField(`#${i+1}`, (<IYoutubeVideoData>song?.song).original_title);
        });
        
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