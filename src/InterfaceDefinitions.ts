import { Client, Message, TextChannel, VoiceChannel, StageChannel } from "discord.js";

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

interface IYoutubeVideoData{
    id: string;
    original_title: string;
    artist: string;
    duration: Number;
    publishedAt: string;
}

interface IQueueStruct{
    textChannel: TextChannel | any;
    voiceChannel: VoiceChannel | StageChannel;
    connection: any;
    songs: IYoutubeVideoData[];
    volume: Number;
    playing: boolean;
}


export { ICommand, ICommandArgs, IQueueStruct, IYoutubeVideoData };