const { loadCommonFunctions } = require("../utils/loadComFunc");
const { dynamicCommand } = require("../utils/dynamicCommand");

// onMessagesUpsert

exports.onMessageUpsert = async ({ socket, messages}) => {
    
    if (!messages.length) {
        return;
    }

    const wMessage = messages[0];
    const commonFunc = loadCommonFunctions({ socket, wMessage });

    await dynamicCommand(commonFunc); 
};