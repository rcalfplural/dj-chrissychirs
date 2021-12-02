import { Client, Message, Channel, VoiceChannel } from "discord.js";

interface ICommand{
    execute: Function;
    id: string;
    shortHelp: string;
    longHelp: string;
    permissions: Number;
}

interface ICommandArgs{
    message: Message;
    args: string[];
    client: Client;
}

interface IQueueStruct{
    textChannel: Channel;
    voiceChannel: VoiceChannel;
    connection: any;
    songs: [];
    volume: Number;
    playing: true;
}

interface IYoutubeVideoData{
    id: string;
    original_title: string;
    artist: string;
    durations: Number;
    publishedAt: string;
}

export { ICommand, ICommandArgs, IQueueStruct, IYoutubeVideoData };