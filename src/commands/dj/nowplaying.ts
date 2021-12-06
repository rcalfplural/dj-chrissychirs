import { Message, MessageEmbed, Permissions } from "discord.js";
import { ICommand, ICommandArgs } from "../../InterfaceDefinitions";
import { queue } from "../../server"

async function execute({message, args, client}: ICommandArgs){
    const thisQueue = queue.get(message.guild.id);

    if(!thisQueue){
        return message.channel.send("Sem fila, irmão.");
    }
    const embed = new MessageEmbed();
    const song = thisQueue.songs[0];
    const next = thisQueue.songs[1];
    const nextLabel = (next)? `\nProxima: ${next.original_title}` : ""
    embed.setTitle("Situação atual da nossa festa");
    embed.addField(song.original_title, `Duração: ${SecondsToFormatedTime(<number>song.duration)} \nTocado: ${SecondsToFormatedTime(song.resource.playbackDuration / 1000)}\nFaltam: ${SecondsToFormatedTime(<number>song.duration - (song.resource.playbackDuration/1000))}${nextLabel}`);
    return message.channel.send({ content: "Player status: "+String(thisQueue.audioPlayer.state.status),  embeds: [embed] });
}

/**
 * 
 * @param seconds : number. Given in seconds
 * @returns A HH:MM:SS format string on the given seconds params.
 */
function SecondsToFormatedTime(seconds: number) : string{
    return `${new Date(seconds * 1000).toISOString().substr(11,8)}`;
}

const Command: ICommand = {
    id: "np",
    longHelp: "O que está tocando agora? Quanto tempo falta pra esse sofrimento que o Lima botou pra tocar acabar?",
    shortHelp: "ShortHelp",
    permissions: parseInt(`${Permissions.FLAGS.SEND_MESSAGES}`), // Fix this later
    execute
}

export default Command;