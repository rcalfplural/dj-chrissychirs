import { Message, Permissions, VoiceChannel, StageChannel } from "discord.js";
import { ICommand, ICommandArgs } from "../../InterfaceDefinitions";
import { queue } from "../../server";

async function execute({message, args, client}: ICommandArgs){
    const thisQueue = queue.get(message.guild.id);
    const voiceChannel: VoiceChannel | StageChannel | undefined = message.member.voice.channel;

    // Ensure the user is joined a voice chat
    if(!voiceChannel){
        return message.channel.send("You need to join a voice chat first.");
    }
    if(voiceChannel != thisQueue.voiceChannel){
        return message.channel.send("You're not invited to the party :(");
    }
    if(!thisQueue){
        return message.channel.send("There is no queue, mate.");
    }

    const video = thisQueue.songs.shift()[0];

    console.log(video);

    message.channel.send(`DJ Chrissy Chris passando essa pra frente. Agora é ${video.original_title} pra voces rapazes`);
}
const Command: ICommand = {
    id: "skip",
    longHelp: "Skip the current song playing.",
    shortHelp: "Skip tha song",
    permissions: parseInt(`${Permissions.FLAGS.SEND_MESSAGES}`), // Fix this later
    execute
}

export default Command;