import { Message } from "discord.js";
import { IQueueStruct } from "../InterfaceDefinitions";
import { queue } from "../server";

export async function GetServerQueue(message: Message):Promise<IQueueStruct | undefined>{
    
    if(!message.member || !message.guild) return undefined;
    if(!message.member.voice.channel) {
        await message.reply("Cannot join voice channel.");
        return;
    }
        
    const q = queue.get(message.guild.id);
    const serverQueue = (q)? q: queue.set(message.guild?.id, {
                                    audioPlayer: null,
                                    playing: false,
                                    textChannel: message.channel,
                                    voiceChannel: message.member?.voice.channel,
                                    connection: null,
                                    songsHead: null
                                }).get(message.guild.id);
                                
    return serverQueue;
}