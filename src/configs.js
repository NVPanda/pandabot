const path = require("path");

exports.TimeOutMilSeconds = 1000;

// Pasta temporária para arquivos baixados por meio do bot
exports.TEMP_DIR = path.resolve(__dirname, "..", "assets", "temp");

// Pasta de Comandos do bot
exports.COMMANDS_DIR =  path.resolve(__dirname, "commands");

// AQUI ficam as chaves das APIS exemplo: OPENAI, MIDJOURNEY, LEXICA etc...
exports.OPENAI_API_KEY = "";

// Essa parte é info sobre nosso bot
exports.PREFIX = "☼" // U+263C

exports.BOT_EMOJI = "🐼✨"; // U+1F43C

exports.BOT_NAME = "Panda Bot";

exports.BOT_NUMBER = "";