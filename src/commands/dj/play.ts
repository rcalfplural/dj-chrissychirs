import { ICommand, ICommandArgs, IQueueStruct } from "../../InterfaceDefinitions";
import { Message, MessageEmbed, Permissions } from "discord.js";
import { AudioPlayerState, AudioPlayerStatus, createAudioPlayer, createAudioResource, getVoiceConnection, joinVoiceChannel, NoSubscriberBehavior, VoiceConnection } from "@discordjs/voice";
import play, { InfoData } from "play-dl";
import { searchVideo } from "usetube";
import { isYoutubeUrl } from "../../utils/EnsureIsYoutubeUrl";
import { queue } from "../../server";
import { GetServerQueue } from "../../utils/DiscordUtils";

export async function GetVideoUrl(term: string){
    const res = await searchVideo(term);
    
    return `https://youtube.com/watch?v=${res.videos[0].id}`;
}

export async function GiveFeedback(message: Message, current: InfoData){
    const embed = new MessageEmbed();
    const { title, durationRaw } = current.video_details;

    if(!title) return;

    embed.setTitle("DJ Chrissy Chris adicionou para a fila: ");
    embed.addField("Titulo", title);
    embed.addField("Duração", durationRaw);
    embed.setColor("DARK_AQUA");
    embed.setAuthor("DJ Chrissy Chris");

    return message.channel.send({ embeds: [embed] });
}

export function AddMusicToQueue(queue: IQueueStruct, song: InfoData){
    let current = queue.songsHead;

    if(!current){
        queue.songsHead = {
            next: null,
            song
        };
        return;
    }

    while(current.next){
        current = current.next;
    }

    current.next = {
        next: null,
        song
    };
}

export function PrintQueueInformation(queue: IQueueStruct){
    let current = queue.songsHead;

    if(!current) return console.log("Fila vazia");

    while(current){
        console.log(current.song.video_details.title);
        current = current.next;
    }
}

export function MoveQueueNext(queue: IQueueStruct){
    let current = queue.songsHead;

    if(!current) return console.log("Fila vazia");

    if(current.next){
        queue.songsHead = current.next;
    }else{
        queue.songsHead = null;
    }

}

export async function PlaySong(serverQueue: IQueueStruct, message: Message, connection: VoiceConnection, feedback: boolean = false){
    const videoInfo = serverQueue.songsHead?.song;
    if(!videoInfo) throw new Error("Invalid video info.");

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
    
    if(serverQueue.playing) return console.log("Ja ta tocando.");
    
    player.play(resource);
    connection.subscribe(player);
    serverQueue.playing = true;
    serverQueue.res = resource;

    // Eventos de troca de estado do player
    player.on<"stateChange">("stateChange", async (oldState, newState)=>{
        console.log("Changed from ", oldState.status);
        console.log("Changed to ", newState.status);
        
        // Começando fila
        if(oldState.status == AudioPlayerStatus.Idle && newState.status == AudioPlayerStatus.Buffering){
            console.log("Começando a tocar");
            if(!serverQueue.playing) {
                serverQueue.playing = true;
            }
        }
        // acabou essa 
        if(oldState.status == AudioPlayerStatus.Playing && newState.status == AudioPlayerStatus.Idle){
            console.log("Acabou essa musica");
            // Checar se existe uma proxima musica na fila
                // se tiver tocar a proxima
                //se nao finalizar fila, desconectar do canal e emitir mensagem de encerramento
            
            
            serverQueue.playing = false;
            player.stop();    
            
            if(!serverQueue.songsHead?.next){
                console.log("Acabou a lista");
                if(feedback) message.channel.send("Dj Chrissy Chris tocou todas hoje.");
                serverQueue.songsHead = null;
                connection.disconnect();
            }else{
                console.log("Vamos para a proxima");
                MoveQueueNext(serverQueue);
                return await PlaySong(serverQueue, message, connection);
            }
        }

        // pause e dispause
        if(oldState.status == AudioPlayerStatus.Playing && newState.status == AudioPlayerStatus.Paused){
            console.log("Pausada");
        }

        if(newState.status == AudioPlayerStatus.Playing && oldState.status == AudioPlayerStatus.Paused){
            console.log("Despausado");
        }
    });
}

async function execute({ message, args }:ICommandArgs){
    try{
        const term = args.join(" ");

        const videoUrl = (isYoutubeUrl(term))?term:await GetVideoUrl(term);

        
        if(!message.member || !message.guild) return;
        
        if(!message.member.voice.channel) return message.reply("Cannot join voice channel.");
        
       
        const serverQueue = await GetServerQueue(message);

        if(!serverQueue) return console.log("Failed to create queue in server ", message.guild.id);

        const videoInfo = await play.video_info(videoUrl);
        const connection = joinVoiceChannel({
            channelId: message.member.voice.channel?.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator
        });

        serverQueue.connection = connection;
        // Add song to queue
        AddMusicToQueue(serverQueue, videoInfo);
        GiveFeedback(message, videoInfo);
        PrintQueueInformation(serverQueue);

        await PlaySong(serverQueue, message, connection, true);

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