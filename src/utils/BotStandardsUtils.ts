import { ColorResolvable, MessageEmbed, } from "discord.js";

// CONFIG

const DEFAULT_COLOR: ColorResolvable = "DARK_AQUA";
const BOT_ICON: string = "https://cdn.discordapp.com/avatars/915674365679530064/27f929d72b6c8a1bc2092539519d2297.png?size=2048";


interface EmbedConstructorPayload{
    title: string;
    hasFooter: boolean;
    hasAuthor: boolean;
    customAuthor?: string | undefined;
    customFooter?: string | undefined;
}
export function EmbedConstructor({ title, hasAuthor, customAuthor, hasFooter, customFooter }:EmbedConstructorPayload): MessageEmbed{
    const embed = new MessageEmbed();

    embed.setColor(DEFAULT_COLOR);
    embed.setTitle(title);
    
    if(hasAuthor){
        if(customAuthor){
            embed.setAuthor(customAuthor);
        }else{
            embed.setAuthor("DJ Chrissy Chris", BOT_ICON);
        }
    }

    if(hasFooter){
        if(customFooter){
            embed.setFooter(customFooter);
        }else{
            embed.setFooter("v1.9.9 Powered by CavaloBot Enterprises", BOT_ICON);
        }
    }

    return embed;
}