import { ICommand, ICommandArgs } from "../../InterfaceDefinitions";
import { Permissions } from "discord.js";
import { queue } from "../../server";
import { MoveQueueNext, PlaySong } from "./play";


async function execute({ message }:ICommandArgs){
    try{
        if(!message.member || !message.guild) return;
        
        if(!message.member.voice.channel) return message.reply("Cannot join voice channel.");
        
        const q = queue.get(message.guild.id);
        const serverQueue = (q)? q: queue.set(message.guild?.id, {
                                        audioPlayer: null,
                                        playing: false,
                                        textChannel: message.channel,
                                        voiceChannel: message.member?.voice.channel,
                                        connection: null,
                                        songsHead: null
                                    }).get(message.guild.id);


        if(!serverQueue) return console.log("Failed to create queue in server ", message.guild.id);

        console.log("Pulando essa musica agora.");

        serverQueue.audioPlayer?.stop(true);
        serverQueue.playing = false;
        if(!serverQueue.songsHead?.next) return message.channel.send("Não tem proxima");
        MoveQueueNext(serverQueue);
        return await PlaySong(serverQueue, message, serverQueue.connection);
        
    }catch(err){
        console.error(err);
        return message.reply("Sinto muito um erro inesperado aconteceu");
    }

}

const command: ICommand = {
    execute,
    id: "skip",
    longHelp: "PRA PULAR NO PEQUI DE GOIAS",
    shortHelp: "Pular as musicas de anime so lima",
    permissions: parseInt(`${Permissions.FLAGS.SEND_MESSAGES}`), // Fix this later
};

export default command;