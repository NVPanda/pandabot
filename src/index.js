const { conn } = require("./connection");

async function start() {
    const socket = await conn();

    load(socket);
}

start();