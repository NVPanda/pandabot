import conn from './conn.js';

import { load } from "./load.js";

async function start() {
    const socket = await conn();

    load(socket);
}

start();
