import { TimeOutMilSeconds } from "./configs.js";
import { onMessageUpsert } from "./middlewares/onMU.js";

export function load(socket) {
    socket.ev.on('messages.upsert', ({ messages }) => {
        setTimeout(() => {
            try {
                onMessageUpsert({ socket, messages });
            } catch (error) {
                console.error("Erro ao processar mensagens:", error);
            }
        }, TimeOutMilSeconds);
    });
}
