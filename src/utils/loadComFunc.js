const { extractDataFromMessage, baileysIs } = require(".");
const { BOT_EMOJI } = require("../configs");
const fs = require("fs");

exports.loadCommonFunctions = ({ socket, wMessage }) => {
    const { remoteJid, prefix, commandName, args, userJid, isReply, replyJid } = extractDataFromMessage(wMessage);

    const isImage = bayleisIs(wMessage, "image");
    const isVideo = bayleisIs(wMessage, "video");
    const isSticker = bayleisIs(wMessage, "sticker");

    const downloadImage = async (wMessage, fileName) => {
        return await download(wMessage, fileName, "image", "png");
    };

    const downloadSticker = async (wMessage, fileName) => {
        return await downloadSticker(wMessage, fileName, "sticker", "webp");
    };

    const downloadVideo = async (wMessage, fileName) => {
        return await download(wMessage, fileName, "video", "mp4");
    };

    const sendText = async (text) => {
        return await socket.sendMessage(remoteJid, { text: `${BOT_EMOJI} ${text}` });
    };

    const sendReply = async (text) => {
        return await socket.sendMessage(remoteJid, { text: `${BOT_EMOJI} ${text}` }, { quoted: wMessage });
    };

    const sendReact = async (emoji) => {
        return await socket.sendMessage(remoteJid, {
            react: {
                text: emoji,
                key: wMessage.key,
            };
        });
    };

    const sendSuccessReact = async () => {
        return await socket.sendReact("☑️");
    };

    const sendWaitReact = async () => {
        return await socket.sendReact("⌛");
    };

    const sendWarningReact = async () => {
        return await socket.sendReact("⚠️");
    };

    const sendErrorReact = async () => {
        return await sendReact("❎");
    };

    const sendSuccessReply = async (text) => {
        await sendSuccessReact();
        return await sendReply(`☑️ ${text}`);
    };

    const sendWaitReply = async (text) => {
        await sendWaitReact();
        return await sendReply(`⌛ ${text}`);
    };

    const sendWarningReply = async (text) => {
        await sendWarningReact();
        return await sendReply(`⚠️ Calma lá meu patrão... ${text}`);
    };

    const sendErrorReply = async (text) => {
        await sendErrorReact();
        return await sendReply(`✖️ Erro, querido! ${text}`);
    };

    const sendStickerFromFile = async (file) => {
        return await socket.sendMessage(remoteJid, {
            sticker: fs.readFileSync(file),
        });
    };


    const sendImageFromFile = async (file) => {
        return await socket.sendMessage(remoteJid, {
            image: fs.readFileSync(file),
        });
    };

    return {
        socket,
        remoteJid,
        userJid,
        prefix,
        commandName,
        args,
        isReply,
        isImage,
        isVideo,
        isSticker,
        replyJid,
        sendText,
        sendReply,
        sendStickerFromFile,
        sendImageFromFile,
        sendReact,
        sendSuccessReact,
        sendWaitReact,
        sendWarningReact,
        sendErrorReply,
        sendWaitReply,
        sendWarningReply,
        sendErrorReact,
        downloadImage,
        downloadSticker,
        downloadVideo,
    };
};

