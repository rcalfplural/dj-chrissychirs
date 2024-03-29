import { Permissions } from "discord.js";
import { ICommand, ICommandArgs } from "../../InterfaceDefinitions";
import { EmbedConstructor } from "../../utils/BotStandardsUtils";
import { GetServerName, GetServerQueue } from "../../utils/DiscordUtils";

async function execute({message, args, client}: ICommandArgs){
    try{

        if(!message.guild) throw new Error("Falha ao obter o id da guild.");

        const att = EmbedConstructor({ title: `Fila em ${await GetServerName(message)}`, hasFooter: false, hasAuthor: false });

        if(!message.member || !message.guild) return;
        
        if(!message.member.voice.channel) return message.reply("Cannot join voice channel.");
        
        const serverQueue = await GetServerQueue(message);


        if(!serverQueue) return console.log("Failed to create queue in server ", message.guild.id);

        let current = serverQueue.songsHead, pos = 1;
    
        if(!current) return message.channel.send("Fila vazia");

        while(current){
            att.addField(`${pos}ª musica`, `${current.song.video_details.title}`);
            current = current.next;
            pos++;
        }
        return message.channel.send({ embeds: [att] });
    }
    catch(err){
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