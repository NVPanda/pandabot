// Corrija a importação para o nome correto da biblioteca
import makeWASocket, { useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason } from "@whiskeysockets/baileys";
// Permite que nosso codiguin encontre todas as pastas do nosso projeto
import path from "path";
// Essa lib Pino serve para logs no geral
import pino from "pino";
// Nossa pasta utils utiliza comandos separados do projeto que podem ser reaproveitados globalmente
const { question, onlyNumbers } = require("./utils");

// separando em variáveis usando const ao invés de let para garantir imutabilidade
const useMFAS = useMultiFileAuthState;
const mkWAS = makeWASocket;
const fLBV = fetchLatestBaileysVersion;

export async function conn() {
    const { state, saveCreds } = await useMFAS();

    const { version } = await fLBV();

    const socket = mkWAS({
        printQRInTerminal: false,
        version,
        logger: pino({ level: 'info' }),
        auth: state,
        browser: ['Chrome (Linux)', '', ''],
        markOnlineOnConnect: true,
    });

    if (!socket.authState.creds.registered) {
        const phoneNumber = await question("Informe seu número de telefone: ");

        if (!phoneNumber) {
            throw new Error("Número de telefone inválido.");
        }

        const code = await socket.requestPairingCode(onlyNumbers(phoneNumber));

        console.log(`código de pareamento: ${code}`);
    }

    socket.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === 'close') {
            const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;

            if (shouldReconnect) {
                conn(); // Chama a função 'conn' novamente para reconectar
            }
        }
    });

    socket.ev.on("creds.update", saveCreds);
}
