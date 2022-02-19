import { Message, MessageEmbed, Permissions } from "discord.js";
import { ICommand, ICommandArgs, IYoutubeVideoData, ListNode } from "../../InterfaceDefinitions";
import { queue } from "../../server"

async function execute({message, args, client}: ICommandArgs){
    const thisQueue = (message.guild) && queue.get(message.guild.id);

    if(!thisQueue){
        return message.channel.send("Sem fila, irmão.");
    }
    const embed = new MessageEmbed();
    const  song = <IYoutubeVideoData>(<ListNode>thisQueue.songsHead).song;
    const  next = <IYoutubeVideoData>thisQueue.songsHead?.next?.song;
    const nextLabel = (next)? `\nProxima: ${next.original_title}` : ""
    embed.setTitle("Situação atual da nossa festa");
    if(song.resource){
        embed.addField(song.original_title, `Duração: ${SecondsToFormatedTime(<number>song.duration)} \nTocado: ${SecondsToFormatedTime(song.resource.playbackDuration / 1000)}\nFaltam: ${SecondsToFormatedTime(<number>song.duration - (song.resource.playbackDuration/1000))}${nextLabel}`);
    }
    
    const status = (thisQueue.audioPlayer != null)?thisQueue.audioPlayer.state.status:'unknown';
    return message.channel.send({ content: "Player status: "+String(status),  embeds: [embed] });
}

/**
 * 
 * @param seconds : number. Given in seconds
 * @returns A HH:MM:SS format string on the given seconds params.
 */
function SecondsToFormatedTime(seconds: number) : string{
    try{
        return `${new Date(seconds * 1000).toISOString().substr(11,8)}`;
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