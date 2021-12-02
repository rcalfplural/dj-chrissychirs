import { Message, Permissions, VoiceChannel, StageChannel, Client } from "discord.js";
import {  } from "@discordjs/voice";
import { ICommand, ICommandArgs, IQueueStruct } from "../../InterfaceDefinitions";
import { queue } from "../../server";
import { PlayFunction } from "./play";

async function execute({message, args, client}: ICommandArgs){
    try{
        const thisQueue = queue.get(message.guild.id);
        const voiceChannel: VoiceChannel | StageChannel | undefined = message.member.voice.channel;
    
        // EnsurE thINgs
        if(!voiceChannel){
            return message.channel.send("You need to join a voice chat first.");
        }
        if(voiceChannel != thisQueue.voiceChannel){
            return message.channel.send("You're not invited to the party :(");
        }
        if(!thisQueue){
            return message.channel.send("There is no queue, mate.");
        }
    
        return await StopFunction(thisQueue, message, voiceChannel, client);
    }catch(err){
        console.error(err);
    }
}
const Command: ICommand = {
    id: "stop",
    longHelp: "Stop the music playing. ",
    shortHelp: "Skip tha song",
    permissions: parseInt(`${Permissions.FLAGS.SEND_MESSAGES}`), // Fix this later
    execute
}

async function StopFunction(thisQueue:IQueueStruct, message: Message, voiceChannel: VoiceChannel | StageChannel, client: Client){
    thisQueue.audioPlayer.stop();
    thisQueue.songs = [];
    thisQueue.playing = false;
    message.channel.send("DJ Crissy Chris is having a break for now.");
    return voiceChannel.members.map(m => {
        if(m.user.id == client.user.id){
            console.log(`M: ${m.user.id} C: ${client.user.id}`);
            return m.voice.setChannel(null);
        }    
    });
}

export { StopFunction };

export default Command;