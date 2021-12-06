import { Message, Permissions, VoiceChannel, TextChannel, StageChannel } from "discord.js";
import { joinVoiceChannel, JoinVoiceChannelOptions, CreateVoiceConnectionOptions, AudioPlayer, AudioPlayerStatus, createAudioPlayer, createAudioResource, AudioPlayerError } from "@discordjs/voice";
import { ICommand, ICommandArgs, IYoutubeVideoData, IQueueStruct } from "../../InterfaceDefinitions";
import { queue } from "../../server";
import { searchVideo } from "usetube";

import * as ytdl from "ytdl-core";
import { StopFunction } from "./stop";
import { isYoutubeUrl } from "../../utils/EnsureIsYoutubeUrl";

// Command execution function
async function execute({message, args, client}: ICommandArgs){
    const voiceChannel: VoiceChannel | StageChannel | undefined = message.member.voice.channel;

    // Ensure the user is joined a voice chat
    if(!voiceChannel){
        return message.channel.send("Você precisa entrar no chat de voz primeiro.");
    }

    // Ensure users permissions
    const permissions = voiceChannel.permissionsFor(client.user);
    if(!permissions.has(Permissions.FLAGS.CONNECT) || !permissions.has(Permissions.FLAGS.SPEAK)){
        return message.channel.send("Permissões necessarias recusadas pela administração.");
    }

    if(args.length == 0 || !args){
        return message.channel.send("Qual a musica que a galera quer? IOOOOOO");
    }
    // Get videos by term
    try{
        const term = args.join(" ");
        const isUrl = isYoutubeUrl(term);
        const { videos } = (isUrl)? { videos: null} : await searchVideo(term);
        const videoData: IYoutubeVideoData = (videos)? videos[0]:null;
        
        const joinVoiceChannelOptions: JoinVoiceChannelOptions & CreateVoiceConnectionOptions = {
            channelId: voiceChannel.id, 
            guildId: voiceChannel.guildId,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator
        };
        
        ;
        // Queue handling
        // if there is no queue then we create one
        if(!queue.get(message.guild.id)){
            queue.set(message.guild.id, {
                textChannel: message.channel,
                voiceChannel: voiceChannel,
                connection: null,
                audioPlayer: null,
                songs: [],
                volume: 5,
                playing: false
            });
        }

        const thisQueue = queue.get(message.guild.id);
        if(thisQueue.playing && thisQueue.voiceChannel != voiceChannel){
            return message.channel.send("DJ Chrissy Chris esta oculpado agora em outra festa. Seja paciente e espere a festa dos outros acabar ou voce junte-se a festa tambem.");
        }
        const connection = joinVoiceChannel(joinVoiceChannelOptions);
        const audioPlayer = createAudioPlayer();

        if(!videoData && !isUrl){
            message.channel.send("Incrivel que por algum motivo estranho esse video nao foi encontrado. :thinking:");
            return message.channel.send("OBS: isso provavelmente é erro da biblioteca. É recomendado usar a url do video desejado retirado da propria plataforma do youtube e tentar novamente `dj play url`")
        }
        if(!isUrl){
            thisQueue.songs.push(videoData);
        }else{
            
            const details = (await ytdl.getInfo(term));
            const { title } = details.videoDetails;
            thisQueue.songs.push({
                artist: "",
                duration: Number(details.timestamp),
                id: details.videoDetails.videoId,
                publishedAt: details.videoDetails.publishDate,
                original_title: title,
                resource: null
            });
        }
        thisQueue.connection = connection;
        thisQueue.audioPlayer = audioPlayer;

        // Play the song
        await PlayFunction(message, thisQueue, connection, false);
        
    }catch(err){
        console.error(err);
        return message.channel.send(":cross: Erro inexperado aconteceu.");
    }
}

// Command object
const Command: ICommand = {
    id: "play",
    longHelp: ":arrow_forward: Toque suas musicas favoritas do youtube.",
    shortHelp: "Toca musicas",
    permissions: parseInt(`${Permissions.FLAGS.SEND_MESSAGES}`), // Fix this later
    execute
}

async function PlayFunction(message: Message, thisQueue: IQueueStruct, connection: any, skipping: boolean){
    try{
        const video = thisQueue.songs[0];
        const url = `http://youtube.com/watch?v=${video.id}`;
        const stream = ytdl(url, { filter: "audioonly" });
        const audioResource = createAudioResource(stream);
        const { audioPlayer } = thisQueue;  

        thisQueue.songs[0].resource = audioResource;

        if(thisQueue.songs.length > 1 && !skipping){
            message.channel.send("E DIGAM ÊÊÊÊÊÊÊÊÊÊ");
            message.channel.send("E DIGAM ÔÔÔÔÔÔÔÔÔÔ");
            message.channel.send("AGORA GRITANDOOO!!!!");
            message.channel.send(`DJ Chrissy Chris tocará pra você em breve ${thisQueue.songs[thisQueue.songs.length-1].original_title}.`);
        }else if(thisQueue.songs.length < 2 && thisQueue.songs.length > 0 && !skipping){
            message.channel.send("E DIGAM ÊÊÊÊÊÊÊÊÊÊ");
            message.channel.send("E DIGAM ÔÔÔÔÔÔÔÔÔÔ");
            message.channel.send("AGORA GRITANDOOO!!!!");
            message.channel.send(`DJ Chrissy Chris tocando pra você agora ${video.original_title}.`);
        }


        // If it is the first song or it is just 
        if(!thisQueue.playing){
            audioPlayer.play(audioResource);
            // RETORNAR AQUI SE DER BOSTA
            connection.subscribe(audioPlayer);
            thisQueue.playing = true;
           
        }else if(skipping){ // if it is a skip
            audioPlayer.stop(); // it will stop the stream then play from beggining the new song.
            audioPlayer.play(audioResource);
            connection.subscribe(audioPlayer);
            thisQueue.playing = true;   
        }
        // When it is done
        audioPlayer.once(AudioPlayerStatus.Idle, ()=>{ // when it stops it will check if there is another song to play next
            console.log("next: "+thisQueue.songs[1]);
            if(thisQueue.songs[1]){
                thisQueue.songs.shift(); // if there is so, it will play right next
                console.log("Tem mais vamos pra proxima");
                return (async ()=>{ await PlayFunction(message, thisQueue, connection, true)})();
            }

            console.log("Nao tem mais acabou");
            StopFunction(thisQueue, message, thisQueue.voiceChannel, message.client, false);
            return ( async (): Promise<void> => {
                await message.channel.send("Chrissy Chris tocou demais essa rodada. Quando tiverem prontos pra uma proxima me avisem.")
            })();
        });

        
        // in case of errors
        audioPlayer.on("error", (error: AudioPlayerError)=>{
            message.channel.send("Aquele erro denovo :sexo");
        });
    }catch(err){
        console.error(err);
        return;
    }
}
export { PlayFunction };
export default Command;