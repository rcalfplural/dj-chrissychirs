import { Client, Intents, Message, Permissions } from "discord.js";
// import { config } from "dotenv";

import * as fs from "fs";
import commands from "./commands";
import { ICommand, IQueueStruct } from "./InterfaceDefinitions";

const queue = new Map<string, IQueueStruct>();
export { queue };


const client = new Client({ intents: [Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_TYPING, Intents.FLAGS.GUILDS ] });
// config();
client.on("ready", ()=>{
    if(client.user){
        client.user.setActivity({ name: "DJ Chrissy Chriss das parada. DJ help para informações.", type: "LISTENING" });
    }
    console.log(">Chrissy Chris esta preparado pra festa começar.")
});
client.on("messageCreate", async (message: Message)=>{
    const messageComponents:string[] = message.content.split(" "); // pos[0] = prefix pos[1] command pos[2,3,4...n] = args
    if(!message.author.bot && messageComponents[0].toLowerCase() == "dev"){
        const commandId = messageComponents[1];
        const command: ICommand | undefined = commands.find((cmd: ICommand)=> cmd.id == commandId );
        console.log("CMD: "+command);
        console.log("CMDs: "+commands[0].id);
        if(command){
            command.execute({message, args: messageComponents.slice(2), client});
        }
    }
});

client.login(process.env.TOKEN);