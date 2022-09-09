import { ICommand, ICommandArgs } from "../../InterfaceDefinitions";
import { Permissions } from "discord.js";
import { queue } from "../../server";
import { MoveQueueNext, PlaySong } from "./play";
import { GetServerQueue } from "../../utils/DiscordUtils";

const DEBUG = true;

async function execute({ message }:ICommandArgs){
    try{
        if(!message.member || !message.guild) return;
        
        if(!message.member.voice.channel) return message.reply("Cannot join voice channel.");
        
        if(DEBUG) return message.channel.send(":warning: Este comando nao ta funcional ainda. Não use :warning:")
       
        const serverQueue = await GetServerQueue(message);
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