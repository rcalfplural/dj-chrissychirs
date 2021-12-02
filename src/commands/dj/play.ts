import { Message, Permissions, VoiceChannel, TextChannel, StageChannel } from "discord.js";
import { joinVoiceChannel, JoinVoiceChannelOptions, CreateVoiceConnectionOptions, AudioPlayer, AudioPlayerStatus, createAudioPlayer, createAudioResource } from "@discordjs/voice";
import { ICommand, ICommandArgs, IYoutubeVideoData } from "../../InterfaceDefinitions";
import { queue } from "../../server";
import { searchVideo } from "usetube";

import * as ytdl from "ytdl-core";

// Command execution function
async function execute({message, args, client}: ICommandArgs){
    const voiceChannel: VoiceChannel | StageChannel | undefined = message.member.voice.channel;

    // Ensure the user is joined a voice chat
    if(!voiceChannel){
        return message.channel.send("You need to join a voice chat first.");
    }

    // Ensure users permissions
    const permissions = voiceChannel.permissionsFor(client.user);
    if(!permissions.has(Permissions.FLAGS.CONNECT) || !permissions.has(Permissions.FLAGS.SPEAK)){
        return message.channel.send("Required permissions denied.");
    }

    // Get videos by term
    try{
        const term = args.join(" ");
        const { videos } = await searchVideo(term);
        const videoData: IYoutubeVideoData = videos[0];
        
        const joinVoiceChannelOptions: JoinVoiceChannelOptions & CreateVoiceConnectionOptions = {
            channelId: voiceChannel.id, 
            guildId: voiceChannel.guildId,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator
        };
        
        ;
        // Queue handling
        if(!queue.get(message.guild.id)){
            queue.set(message.guild.id, {
                textChannel: message.channel,
                voiceChannel: voiceChannel,
                connection: null,
                songs: [],
                volume: 5,
                playing: false
            });
        }

        const thisQueue = queue.get(message.guild.id);
        const connection = joinVoiceChannel(joinVoiceChannelOptions);
        
        thisQueue.songs.push(videoData);
        thisQueue.connection = connection;
        
        // Play the song
        const video = thisQueue.songs[0];
        const url = `http://youtube.com/watch?v=${video.id}`;
        const stream = ytdl(url, { filter: "audioonly" });
        const audioPlayer = createAudioPlayer();
        const audioResource = createAudioResource(stream);

        if(thisQueue.songs.length > 1){
            message.channel.send("E DIGAM ÊÊÊÊÊÊÊÊÊÊ");
            message.channel.send("E DIGAM ÔÔÔÔÔÔÔÔÔÔ");
            message.channel.send("AGORA GRITANDOOO!!!!");
            message.channel.send(`DJ Chrissy Chris tocará pra você em breve ${video.original_title}.`);
        }else{
            message.channel.send("E DIGAM ÊÊÊÊÊÊÊÊÊÊ");
            message.channel.send("E DIGAM ÔÔÔÔÔÔÔÔÔÔ");
            message.channel.send("AGORA GRITANDOOO!!!!");
            message.channel.send(`DJ Chrissy Chris tocando pra você agora ${video.original_title}.`);
        }
        
        if(!thisQueue.playing){
            audioPlayer.play(audioResource);
            audioPlayer.on(AudioPlayerStatus.Idle, ()=>{
                message.channel.send("Finished Playing the song.");
            });
            connection.subscribe(audioPlayer);
            thisQueue.playing = true;
        }
    }catch(err){
        return message.channel.send(":cross: Unexpected error ocorried.");
    }
}

// Command object
const Command: ICommand = {
    id: "play",
    longHelp: "Play your favorite song from youtube.",
    shortHelp: "Play music",
    permissions: parseInt(`${Permissions.FLAGS.SEND_MESSAGES}`), // Fix this later
    execute
}

export default Command;