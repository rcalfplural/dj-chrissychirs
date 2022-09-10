import { Message, MessageEmbed, Permissions } from "discord.js";
import { ICommand, ICommandArgs, IYoutubeVideoData, ListNode } from "../../InterfaceDefinitions";
import { queue } from "../../server"
import { GetServerName, GetServerQueue } from "../../utils/DiscordUtils";

async function execute({message, args, client}: ICommandArgs){
    try{
        const serverQueue = await GetServerQueue(message);

        if(!serverQueue) return message.reply("Nenhua fila foi encontrada nesse server.");

        const song = serverQueue.songsHead?.song;
        const resource = serverQueue.res;

        if(!song || !resource) return message.reply("Não tem nada tocando agora");

        const embed = new MessageEmbed();

        embed.setAuthor("DJ Chrissy Chris está tocando agora em "+await GetServerName(message));
        embed.setTitle(String(song.video_details.title));
        embed.setDescription(`Tocada/Duração: ${GetFormatedTime(resource.playbackDuration)}/${song.video_details.durationRaw}\nPorcentagem tocada: ${Math.round(((resource.playbackDuration/1000)*100)/song.video_details.durationInSec)}%`);

        return message.channel.send({ embeds: [embed] });
    }catch(err){
        console.error(err);
        return message.channel.send("Erro interno ocorreu.");
    }
}

/**
 * 
 * @param miliseconds : number. Given in miliseconds
 * @returns A HH:MM:SS format string on the given seconds params.
 */
function GetFormatedTime(miliseconds: number) : string{
    try{
        const date = new Date(miliseconds);
        const formatedDigit = (n:number)=>n.toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });
        let formated:string = "";
        if(miliseconds/1000 > 3599){
            formated = `${formatedDigit(date.getHours())}:${formatedDigit(date.getMinutes())}:${formatedDigit(date.getSeconds())}`;
        }else{
            formated = `${formatedDigit(date.getMinutes())}:${formatedDigit(date.getSeconds())}`;
        }
        return formated;
    }catch(err){
        console.error(err);
        return "--.--.--";
    }
}

const Command: ICommand = {
    id: "np",
    longHelp: "O que está tocando agora? Quanto tempo falta pra esse sofrimento que o Lima botou pra tocar acabar?",
    shortHelp: "ShortHelp",
    permissions: parseInt(`${Permissions.FLAGS.SEND_MESSAGES}`), // Fix this later
    execute
}

export default Command;