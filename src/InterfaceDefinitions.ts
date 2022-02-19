import { AudioPlayer, AudioResource } from "@discordjs/voice";
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
    resource?: AudioResource;
}

interface IQueueStruct{
    textChannel: TextChannel | any;
    voiceChannel: VoiceChannel | StageChannel;
    audioPlayer: AudioPlayer | null;
    connection: any;
    songsHead: ListNode | null;
    volume: Number;
    playing: boolean;
}

interface ListNode{
    song: IYoutubeVideoData | string;
    next: ListNode | null;
};

export { ICommand, ICommandArgs, IQueueStruct, IYoutubeVideoData, ListNode };