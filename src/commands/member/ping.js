export const name = "ping";
export const description = "Este comando verifica a conexão com o servidor.";
export const commands = ["pinguin", "ping", "pinguso"];
export const usage = `${PREFIX}comando`;
export async function handle({ sendReply, sendReact }) {
    // Código do comando.
    await sendReact("🍺");
    await sendReply("🍺 Eita cachaça da boa...a latência tá braba. ");
}

