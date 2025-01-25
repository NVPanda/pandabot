import { loadCommonFunctions } from "./utils/loadComFunc.js";
import { dynamicCommand } from "./utils/dynamicCommand.js";

// onMessagesUpsert

export async function onMessageUpsert({ socket, messages}) {
    
    if (!messages.length) {
        return;
    }

    const wMessage = messages[0];
    const commonFunc = loadCommonFunctions({ socket, wMessage });

    await dynamicCommand(commonFunc); 
}