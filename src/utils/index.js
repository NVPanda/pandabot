const { downloadContentFromMessage} = require("@whiskeysockets/baileys");
const readline = require("readline");
const path = require("path");
const { writeFile } = require("fs/promises");
const fs = require("fs");
const { TEMP_DIR, COMMANDS_DIR } = require("../configs");


exports.question = (message) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve) => rl.question(message, resolve));
};

exports.onlyNumbers = (text) => text.replace(/[^0-9]/g, '');

exports.extractDataFromMessage = (wMessage) => {
    const textMessage = wMessage.message?.conversation;
    const extendedTextMessage = wMessage.message?.extendedTextMessage;
    const extendedTextMessageText = extendedTextMessage?.Text;
    const imageTextMessage = wMessage.message?.imageMessage?.caption;
    const videoTextMessage = wMessage.message?.videoMessage?.caption;

    const fullMessage = textMessage || imageTextMessage || extendedTextMessageText || videoTextMessage;

    if (!fullMessage) {
        return {
            remoteJid: null,
            userJid: null,
            prefix: null,
            commandName: null,
            isReply: null,
            replyJid: null,
            args: [],
        };
    }

    const isReply = !!extendedTextMessage && !!extendedTextMessage.contextInfo?.quotedMessage;

    const replyJid = !!extendedTextMessage && !!extendedTextMessage.contextInfo.participant ? extendedTextMessage.contextInfo.participant : null;
    //comando para limpar a forma como o phoneNumber é armazenado após captura
    const userJid = wMessage?.key?.participant?.replace(/:[0-9][0-9]|:[0-9]/g, '');

    const [command, ...args] = fullMessage.split(" ");
    const prefix = command.charAt(0);

    const commandWithoutPrefix = command.replace(new RegExp(`^[${PREFIX}]+`), prefix);

    return {
        remoteJid: wMessage?.key?.remoteJid,
        userJid,
        prefix,
        commandName: this.formatCommand(commandWithoutPrefix),
        isReply,
        replyJid,
        args: this.splitByChars(args.join(" "), ["\\", "|", "/"]),
    };
};

exports.splitByChars = (str, characters) => {
    characters = characters.map((char) => (char === "\\" ? "\\\\" : char));
    const regex = new RegExp(`[${characters.join("")}]`);

    return str.split(regex).map((str.trim())).filter(Boolean);
};

exports.formatCommand = (text) => {
    return this.onlyLettersAndNumbers(
        this.removeAccentsAndSpecialCharacters(text.toLocaleLowerCase().trim())
    );
};

exports.removeAccentsAndSpecialCharacters = (text) => {
    if (!text) return "";

    return text.normalize("NFD").replace(/\u0300-\u036f]/g, "");
};

exports.bayleisIs = (wMessage, context) => {
    return !!this.getContent(wMessage, context);
};

exports.getContent = (wMessage, context) => {
    return (
        wMessage.message?.[`${context}Message`] || wMessage.message?.extendedTextMessage?.quotedMessage?.[`${context}`]
    )
};

exports.download = async (wMessage, fileName, context, extension) => {
    const content = this.getContent(wMessage, context);

    if (!content) {
        return null;
    }
    
    const string = await downloadContentFromMessage(content, context);

    let buffer = Buffer.from([]);

    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }

    const filePath = path.resolve(TEMP_DIR, `${fileName}.${extension}`);

    await writeFile(filePath, buffer);

    return filePath;
};

exports.findCommandImport = () => {};

exports.readCommandImport = () => {
    const subdirectories = fs.readdirSync(COMMANDS_DIR, {withFileTypes: true}).filter((directory) => directory.isDirectory()).map((directory) => directory.name);

    const commandImports = {};

    for (const subdir of subdirectories) {
        const subdirectoyPath = path.join(COMMANDS_DIR, subdir);
        const files = fs.readdirSync(subdirectoyPath).filter((file) => !file.startsWith("_") && (file.endsWith(".js") || file.endsWith(".ts")));

    }

};
