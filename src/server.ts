import { Client, Intents, Message, Permissions } from "discord.js";
import { config } from "dotenv";
import * as fs from "fs";
import commands from "./commands";

export interface ICommand{
    execute: Function;
    id: string;
    shortHelp: string;
    longHelp: string;
    permissions: Number;
}

export interface ICommandArgs{
    message: Message;
    args: string[];
    client: Client;
}

const client = new Client({ intents: [Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_TYPING, Intents.FLAGS.GUILDS ] });
config();
client.on("ready", ()=>console.log(">Chrissy Chris esta preparado pra festa começar."))
client.on("messageCreate", (message: Message)=>{
    const messageComponents:string[] = message.content.split(" "); // pos[0] = prefix pos[1] command pos[2,3,4...n] = args
    if(!message.author.bot && messageComponents[0].toLowerCase() == "dj"){
        const commandId = messageComponents[1];
        const command: ICommand | undefined = commands.find((cmd: ICommand)=>{ cmd.id == commandId });
        console.log("CMD: "+command);
        console.log("CMDs: "+commands[0].id);
        if(command){
            command.execute(message, messageComponents, client);
        }
    }
});

client.login(process.env.TOKEN);