

const MUSIC_PLAY_FAILED = "O bot falhou em encontrar essa musica. Tente novamente";
const MUSIC_NSFW = "Esse video/musica que está tentando tocar está marcado com restrição de idade e não será possível executa-lo.";
const MUSIC_CONNECT_FAILED = "O bot encontrou problemas para se conectar a esse canal de voz. Verifique as permissões ou se está realmente conectado a um.";
const MUSIC_SEARCH_FAILED = "O bot não econtrou a musica !#replace#! agora. Tente novamente mais tarde (Ou logo em seguida)";

function FormatErrorMessage(format: string, pieces: string[]){
    const formatParts = format.replace(/[.,\/]/g,"").split(" ");
    const getReplaceCounter = ()=>{  
        let i = 0;
        formatParts.forEach(p => {
            console.log(p);
            if(p === "!#replace#!"){
                i++;
            }
        })
        return i;
    };

    const replaceCounter = getReplaceCounter();

    console.log("Recplace counter: ", replaceCounter);

    let piecesIndex = 0; 
    formatParts.map((part, i)=>{
        if(part === "!#replace#!"){
            console.log("WAHT?", pieces[piecesIndex]);
            formatParts[i] = pieces[piecesIndex];
            piecesIndex++;
        }
    });


    return formatParts.join(" ");
}


const BotMessageHandlingUtils = {
    FormatErrorMessage,
    Messages: {
        Error: {
            Music: {
                SearchFailed: "O BOT FALHOU EM ENCONTRAR A MUSICA !#X",
                PlaybackFailed: "O BOT ENCONTROU PROBLEMAS NA EXECUÇÃO DESSA MUSICA. PERDÃO A INVOCENIÊNCIA.",
                VoiceChatFail: "O BOT ENCONTROU PROBLEMAS PARA SE CONECTAR AO CANAL DE VOZ. VERIFIQUE AS PERMISSÕES OU SE VOCE REALMENTE ESTA CONECTADO A UM."
            },
            Queue: {
                FailedToCreate: "NÃO FOI POSSIVEL INICIAR A QUEUE NESTE SERVIDOR. TENTE NOVAMENTE MAIS TARDE.",
                FailedToSkip: "NÃO FOI POSSIVEL PASSAR ESSA MUSICA."
            }
        },
        Sucess:{

        },
        Neutral: {

        }
    }
};

export default BotMessageHandlingUtils;