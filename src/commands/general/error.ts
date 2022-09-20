import { ICommand, ICommandArgs } from "../../InterfaceDefinitions";
import BotMessageHandlingUtils from "../../utils/BotMessageHandlingUtils";

async function execute({ message, args }:ICommandArgs){
    try{
        const msgRes = BotMessageHandlingUtils.FormatErrorMessage("Eu gosto de !#replace#! cachorros em !#replace#!.", ["Maltratar", "Vias privadas"]);
        return message.channel.send(msgRes);
    }catch(err){
        console.log(err);
        return
    }
}

const command: ICommand = {
    execute,
    id: "erro",
    longHelp: "X",
    shortHelp: "X",
    permissions: 0
};

export default command;