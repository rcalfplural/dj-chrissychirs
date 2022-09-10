import { Permissions } from "discord.js";
import { ICommand, ICommandArgs } from "../../InterfaceDefinitions";
import { GetServerQueue } from "../../utils/DiscordUtils";

async function execute({ message }:ICommandArgs){
    try{
        const serverQueue = await GetServerQueue(message);

        if(!serverQueue) return message.reply("Não foi encontrada nenhuma playlist atualmente tocando nesse servidor.");



        serverQueue.audioPlayer?.stop(true);
        serverQueue.songsHead = null;
        serverQueue.connection.disconnect();
        serverQueue.playing = false;
        
        return message.channel.send("Lista encerrada.");
    }catch(err){
        console.error(err);
        return message.channel.send("Ocorreu um erro interno.");
    }
}

const command: ICommand = {
    id: "stop",
    execute,
    longHelp: "Acabar com as poluções audiovisuais.",
    shortHelp: "Acabar com as poluções audiovisuais.",
    permissions: parseInt(`${Permissions.FLAGS.SEND_MESSAGES}`)
};


export default command;