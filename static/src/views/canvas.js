import { html } from '../lib/lit-html.js';
import { getGameById } from '../api/games.js';
import { start } from '../engine/game.js';


const canvasTemplate = (game) => html`
<section>
    <h1>${game.name}</h1>
    <canvas width="800" height="600"></canvas>
</section>`;

//Load game
export async function canvasView(ctx) {
    const gameId = ctx.params.id;
    // Select room.
    //const game = await getGameById(gameId);
    const game = {objectId: 'test'};
    ctx.render(canvasTemplate(game));

    start(ctx.user.username, gameId);
}

