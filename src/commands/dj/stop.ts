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
            return message.channel.send("Você precisa entrar no chat de voz primeiro.");
        }
        if(voiceChannel != thisQueue.voiceChannel){
            return message.channel.send("Você não foi convidado pra festa :(");
        }
        if(!thisQueue){
            return message.channel.send("Sem fila maninho.");
        }
    
        return await StopFunction(thisQueue, message, voiceChannel, client, true);
    }catch(err){
        console.error(err);
    }
}
const Command: ICommand = {
    id: "stop",
    longHelp: ":stop_button: Enxeram de musica ruim. Ou ja sairam e deixaram so você moscando na call e você quer acabar com a solidao? Acabe com a festa.",
    shortHelp: "Skip tha song",
    permissions: parseInt(`${Permissions.FLAGS.SEND_MESSAGES}`), // Fix this later
    execute
}

async function StopFunction(thisQueue:IQueueStruct, message: Message, voiceChannel: VoiceChannel | StageChannel, client: Client, feedback: boolean){
    thisQueue.audioPlayer.stop();
    queue.delete(thisQueue.voiceChannel.guildId);
    if(feedback){
        message.channel.send("DJ Crissy Chris esta descansando em desampontamento com o encerramento precoce da festa.");
    }
    return voiceChannel.members.map(m => {
        if(m.user.id == client.user.id){
            console.log(`M: ${m.user.id} C: ${client.user.id}`);
            return m.voice.setChannel(null);
        }    
    });
}

export { StopFunction };

export default Command;