import { Message, Permissions, VoiceChannel, StageChannel } from "discord.js";
import { ICommand, ICommandArgs, IYoutubeVideoData } from "../../InterfaceDefinitions";
import { queue } from "../../server";
import { PlayFunction } from "./play";
import { StopFunction } from "./stop";

async function execute({message, args, client}: ICommandArgs){
    try{
        const thisQueue = (message.guild) && queue.get(message.guild.id);

        if(!message.member || !thisQueue) return;
        
        const voiceChannel: VoiceChannel | StageChannel | null = message.member.voice.channel;
    
        // Ensure the user is joined a voice chat
        if(!voiceChannel){
            return message.channel.send("Você precisa entrar no chat de voz primeiro.");
        }
        if(voiceChannel != thisQueue.voiceChannel){
            return message.channel.send("Você não foi convidado pra festa :(");
        }
        if(!thisQueue){
            return message.channel.send("Sem fila maninho.");
        }
    
        const video = thisQueue.songsHead?.next;
    
        if(!video){
            console.log("Nao tem mais videos");
            return StopFunction(thisQueue, message, voiceChannel, client, false);
        }
        message.channel.send(`DJ Chrissy Chris passando essa pra frente. Agora é ${(<IYoutubeVideoData>video.song).original_title} pra voces rapazes`);
    
        thisQueue.songsHead = video;

        return await PlayFunction(message, thisQueue, thisQueue.connection, true);
    }catch(err){
        console.error(err);
    }
}
const Command: ICommand = {
    id: "skip",
    longHelp: ":fast_forward: Musica de anime? Use este comando imediatamente.",
    shortHelp: "Skip tha song",
    permissions: parseInt(`${Permissions.FLAGS.SEND_MESSAGES}`), // Fix this later
    execute
}

async function SkipFunction(){

}

export { SkipFunction };

export default Command;