const { verifyPrefix, hasTypeOrCommand } = require("../middlewares");
const { checkPermission } = require("../middlewares/checkPermissions");
const { DangerError, InvalidParameterError, WarningError } = require("../logs/errors");
const { findCommandImport } = require(".");


exports.dynamicCommand = async (paramsHandler) => {
    const { commandName, prefix, sendWarningReply, sendErrorReply } = paramsHandler;

    const { type, command } = findCommandImport(commandName);

    if (!verifyPrefix(prefix) || hasTypeOrCommand({type, command})) {
        return;
    };

    if (! await checkPermission({type, ...paramsHandler})) {
        return sendErrorReply("Você não possui as credenciais necessárias para executar este comando, contate o suporte.");
    }

    try {
        await command.handle({ ...paramsHandler, type});
    }
    catch(error) {
        console.log(error);


        if (error instanceof InvalidParameterError) {
            await sendWarningReply(`Parâmetros inválidos ${error.message}, consulte os logs de erros.`);
        } 
        
        else if (error instanceof WarningError) {
            await sendWarningReply(error.message);
        }
        
        else if (error instanceof DangerError) {
            await sendErrorReply(error.message);
        }

        else {
            await sendErrorReply(
                `Erro ao processar o comando ${command.name}, os administradores já estão cientes!\n
                📰 *Details* : ${error.message}`
            )
        }
    }
};