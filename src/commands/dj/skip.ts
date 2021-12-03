import { Message, Permissions, VoiceChannel, StageChannel } from "discord.js";
import { ICommand, ICommandArgs } from "../../InterfaceDefinitions";
import { queue } from "../../server";
import { PlayFunction } from "./play";
import { StopFunction } from "./stop";

async function execute({message, args, client}: ICommandArgs){
    try{
        const thisQueue = queue.get(message.guild.id);
        const voiceChannel: VoiceChannel | StageChannel | undefined = message.member.voice.channel;
    
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
    
        thisQueue.songs.shift();
    
        const video = thisQueue.songs[0];
    
        if(!video){
            return StopFunction(thisQueue, message, voiceChannel, client);
        }
        message.channel.send(`DJ Chrissy Chris passando essa pra frente. Agora é ${video.original_title} pra voces rapazes`);
    
        return await PlayFunction(message, thisQueue, thisQueue.connection, true);
    }catch(err){
        console.error(err);
    }
}
const Command: ICommand = {
    id: "skip",
    longHelp: "Musica de anime? Use este comando imediatamente.",
    shortHelp: "Skip tha song",
    permissions: parseInt(`${Permissions.FLAGS.SEND_MESSAGES}`), // Fix this later
    execute
}

async function SkipFunction(){

}

export { SkipFunction };

export default Command;