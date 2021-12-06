import { AudioPlayerStatus } from "@discordjs/voice";
import { Message, Permissions, StageChannel, VoiceChannel } from "discord.js";
import { ICommand, ICommandArgs } from "../../InterfaceDefinitions";
import { queue } from "../../server";

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
            return message.channel.send("Sem fila, irmão.");
        }

        if(thisQueue.audioPlayer.state.status == AudioPlayerStatus.Playing){
            thisQueue.audioPlayer.pause();
            return message.channel.send("DJ Chrissy Chris tá tomando um arzinho agora.");
        }else if(thisQueue.audioPlayer.state.status == AudioPlayerStatus.Paused){
            thisQueue.audioPlayer.unpause();
            return message.channel.send("DJ Chrissy Chris ta de volta torando com as paradas musicais.");
        }else if(thisQueue.audioPlayer.state.status == AudioPlayerStatus.Idle){
            return message.channel.send("DJ Chrissy Chris não ta tocando nada agora não.");
        }
    
    }catch(err){
        console.error(err);
    }
}
const Command: ICommand = {
    id: "pause",
    longHelp: ":pause_button: Se a musica tiver muito quente que você quer se aliviar noo banheiro mas não quer perder a musica, Pause. Tem efeito liga/desliga se usado duas vezes.",
    shortHelp: "Pause/Unpaused",
    permissions: parseInt(`${Permissions.FLAGS.SEND_MESSAGES}`), // Fix this later
    execute
}

export default Command;