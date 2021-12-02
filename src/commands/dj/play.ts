import { Message, Permissions, VoiceChannel, StageChannel } from "discord.js";
import { joinVoiceChannel, JoinVoiceChannelOptions, CreateVoiceConnectionOptions, AudioPlayer, createAudioPlayer, createAudioResource } from "@discordjs/voice";
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
    const term = args.join(" ");
    const { videos } = await searchVideo(term);
    const url = `http://youtube.com/watch?v=${videos[0].id}`;

    const joinVoiceChannelOptions: JoinVoiceChannelOptions & CreateVoiceConnectionOptions = {
        channelId: voiceChannel.id, 
        guildId: voiceChannel.guildId,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator
    };
    
    // Play the song
    const connection = joinVoiceChannel(joinVoiceChannelOptions);
    const stream = ytdl(url, { filter: "audioonly" });
    const audioPlayer = createAudioPlayer();
    const audioResource = createAudioResource(stream);

    audioPlayer.play(audioResource);
    connection.subscribe(audioPlayer);

    console.log("videos: "+videos);
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