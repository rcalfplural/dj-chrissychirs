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
            return message.channel.send("You need to join a voice chat first.");
        }
        if(voiceChannel != thisQueue.voiceChannel){
            return message.channel.send("You're not invited to the party :(");
        }
        if(!thisQueue){
            return message.channel.send("There is no queue, mate.");
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
    longHelp: "Skip the current song playing.",
    shortHelp: "Skip tha song",
    permissions: parseInt(`${Permissions.FLAGS.SEND_MESSAGES}`), // Fix this later
    execute
}

export default Command;