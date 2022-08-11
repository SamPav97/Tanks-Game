import { html } from '../lib/lit-html.js';
import { until } from '../lib/directives/until.js'
//NOTE UNTIL IS IMPORTED EXTERNALLY YOU NEED TO ADD IT TO YOUR LIB
import { getGameById } from '../api/games.js';

const detailsTemplate = (gamePromise) => html`
<section>
    ${until(gamePromise, html`<h1>Lobby</h1>
    <p>Loading details...</p>`)}
</section>`;

export function detailsView(ctx) {
    // I get an object with results.
    ctx.render(detailsTemplate(loadGame(ctx)));
}

async function loadGame(ctx) {
    const gameId = ctx.params.id;
    const game = await getGameById(gameId);

    return html`
        <h1>${game.name}</h1>
        <p>Mode: ${game.mode}</p>`;
}