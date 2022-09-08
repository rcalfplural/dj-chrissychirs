import { ICommand, ICommandArgs } from "../../InterfaceDefinitions";
import { Permissions } from "discord.js";
import { AudioPlayerStatus, createAudioPlayer, createAudioResource, getVoiceConnection, joinVoiceChannel, NoSubscriberBehavior } from "@discordjs/voice";
import play from "play-dl";
import { searchVideo } from "usetube";
import { isYoutubeUrl } from "../../utils/EnsureIsYoutubeUrl";
import { queue } from "../../server";

async function GetVideoUrl(term: string){
    const res = await searchVideo(term);
    
    return `https://youtube.com/watch?v=${res.videos[0].id}`;
}

async function execute({ message, args }:ICommandArgs){
    try{
        const term = args.join(" ");

        const videoUrl = (isYoutubeUrl(term))?term:await GetVideoUrl(term);

        
        if(!message.member || !message.guild) return;
        
        if(!message.member.voice.channel) return message.reply("Cannot join voice channel.");
        
        const q = queue.get(message.guild.id);
        const serverQueue = (q)? q: queue.set(message.guild?.id, {
                                        audioPlayer: null,
                                        playing: false,
                                        textChannel: message.channel,
                                        voiceChannel: message.member?.voice.channel,
                                        connection: null,
                                        volume: 1,
                                        songsHead: null
                                    });

        const connection = joinVoiceChannel({
            channelId: message.member.voice.channel?.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator
        });

        console.log(videoUrl);
        const videoInfo = await play.video_info(videoUrl);
        console.log(videoInfo.video_details);
        const stream = await play.stream_from_info(videoInfo);
        const resource = createAudioResource(stream.stream, {
            inputType: stream.type
        });

        const player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Play
            }
        });

        // verificar se o player ja está tocando
            // caso não esteja -> inicar reprodução
            // caso contrario -> adicionar musica ao fim da fila 
        player.play(resource);
        connection.subscribe(player);

        // Eventos de troca de estado do player
        player.on<"stateChange">("stateChange", (oldState, newState)=>{
            console.log("Changed from ", oldState.status);
            console.log("Changed to ", newState.status);

            // acabou essa 
            if(oldState.status == AudioPlayerStatus.Playing && newState.status == AudioPlayerStatus.Idle){
                console.log("Acabou essa musica");
                // Checar se existe uma proxima musica na fila
                    // se tiver tocar a proxima
                    //se nao finalizar fila, desconectar do canal e emitir mensagem de encerramento
                connection.disconnect();
                player.stop();    
            }
        });
    }catch(err){
        console.error(err);
        return;
    }
}

const command: ICommand = {
    id: "play",
    execute,
    shortHelp: "FODASE",
    longHelp: "FODASE 2",
    permissions: parseInt(`${Permissions.FLAGS.SEND_MESSAGES}`), // Fix this later
};

export default command;