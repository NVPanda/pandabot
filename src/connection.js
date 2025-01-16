// Fazemos o import das bibliotecas pertinentes ao nosso bot
import { default as makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason } from "@whiskeysocket/bau=ileys";
// Permite que nosso codiguin encontre todas as pastas do nosso projeto
import path from "path";
// Essa lib Pino serve para logs no geral
import { pino } from "pino";
// Nossa pasta utils utiliza comandos separados do projeto que podem ser reaproveitados globalmente
import { question, onlyNumbers } from "./utils";

// separei em variáveis usando o let como dita a comunidade usar let ao invés de const ou var.
let useMFAS = useMultiFileAuthState;
let mkWAS = makeWASocket;
let fLBV = fetchLatestBaileysVersion;

export async function conn() {
    const { state, saveCreds } = await useMFAS;

    const { version } = await fLBV;

    const socket = mkWAS({
        printQRInTerminal: false,
        version,
        logger: {
            pino: ({ level: 'info' }),
        },
        auth: state,
        browser: ['Chrome (Linux)', '', ''],
        markOnlineOnConnect: true,
    });

    if (!socket.authState.Creds.registered) {
        const phoneNumber = await question("Informe seu número de telefone: ");

        if (!phoneNumber) {
            throw new Error("Número de telefone inválido.");
        }

        const code = await socket.requestPairingCode(onlyNumbers(phoneNumber));

        console.log(`código de pareamento: {$code}`);
    }

    socket.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;

        if (connection == 'close') {
            const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;

            if (shouldReconnect) {
                this.connect();
            }
        }
    });

    socket.ev.on("creds.update", saveCreds);
}