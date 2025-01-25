import { downloadContentFromMessage } from "@whiskeysockets/baileys";
import { createInterface } from "readline";
import { resolve as _resolve, join } from "path";
import { writeFile } from "fs/promises";
import { readdirSync } from "fs";
import { TEMP_DIR, COMMANDS_DIR, PREFIX } from "../configs";

export function question(message) {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve) => rl.question(message, resolve));
}

export function onlyNumbers(text) { return text.replace(/[^0-9]/g, ''); }

export function extractDataFromMessage(wMessage) {
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

    const commandWithoutPrefix = command.replace(new RegExp(`^[${PREFIX}]+`), "");

    return {
        remoteJid: wMessage?.key?.remoteJid,
        userJid,
        prefix,
        commandName: this.formatCommand(commandWithoutPrefix),
        isReply,
        replyJid,
        args: this.splitByChars(args.join(" "), ["\\", "|", "/"]),
    };
}

export function splitByChars(str, characters) {
    characters = characters.map((char) => (char === "\\" ? "\\\\" : char));
    const regex = new RegExp(`[${characters.join("")}]`);

    return str.split(regex).map(str => str.trim()).filter(Boolean);
}

export function formatCommand(text) {
    return this.onlyLettersAndNumbers(
        this.removeAccentsAndSpecialCharacters(text.toLocaleLowerCase().trim())
    );
}

export function onlyLettersAndNumbers(text) {
    return text.replace(/[^a-zA-Z0-9]/g, "");
}

export function removeAccentsAndSpecialCharacters(text) {
    if (!text) {
        return "";
    }

    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function bayleisIs(wMessage, context) {
    return !!this.getContent(wMessage, context);
}

export function getContent(wMessage, context) {
    return (
        wMessage.message?.[`${context}Message`] || wMessage.message?.extendedTextMessage?.quotedMessage?.[`${context}`]
    );
}

export async function download(wMessage, fileName, context, extension) {
    const content = this.getContent(wMessage, context);

    if (!content) {
        return null;
    }

    const stream = await downloadContentFromMessage(content, context);

    let buffer = Buffer.from([]);

    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }

    const filePath = _resolve(TEMP_DIR, `${fileName}.${extension}`);

    await writeFile(filePath, buffer);

    return filePath;
}

export function findCommandImport(commandName) {
    const command = this.readCommandImport();

    let typeReturn = ""; // comando que verifica qual é o tipo de pessoa Admin, Member or Owner
    let targeCommandReturn = null;

    for (const [type, commands] of Object.entries(command)) {
        if (!commands.length) {
            continue;
        }

        const targeCommand = commands.find(cmd => cmd.commands.map(cmd => this.formatCommand(cmd)).includes(commandName));

        if (targeCommand) {
            typeReturn = type;
            targeCommandReturn = targeCommand;
            break;
        }
    }

    return {
        type: typeReturn,
        command: targeCommandReturn,
    };
}

export function readCommandImport() {
    const subdirectories = readdirSync(COMMANDS_DIR, { withFileTypes: true }).filter((directory) => directory.isDirectory()).map((directory) => directory.name);

    const commandImports = {};

    for (const subdir of subdirectories) {
        const subdirectoyPath = join(COMMANDS_DIR, subdir);
        const files = readdirSync(subdirectoyPath).filter((file) => !file.startsWith("_") && (file.endsWith(".js") || file.endsWith(".ts")));

        commandImports[subdir] = files;

    }

    return commandImports;
}
