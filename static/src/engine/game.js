import { createRenderer } from "./engine.js";

export async function start(username, gameId) {
    const engine = await createRenderer();

    engine.clear();
    engine.drawGrid();

}