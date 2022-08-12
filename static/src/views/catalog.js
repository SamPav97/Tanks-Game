import { html } from '../lib/lit-html.js';
import { repeat } from '../lib/directives/repeat.js';
import { until } from '../lib/directives/until.js'
import { getAllGames } from '../api/games.js';

// g=>g.objectId is an identity function that updates only new things in the catalog instead of changing all of them.
const catalogTemplate = (gamesPromise) => html`
<section>
    <h1>Game Lobbies</h1>
    <main>
        ${until(gamesPromise, 'Loading games...')}
    </main>
</section>`;

const gamesList = (games) => games.length == 0
    ? html`<p>No lobbies hosted yet. <a href="/create">Be the first!</a></p>`
    : html`
<ul>
    ${repeat(games, g => g.objectId, lobbyCard)}
</ul>`;

const lobbyCard = game => html`
<li>${game.name}<a class="button" href="/games/${game.objectId}">View Lobby</a></li>`;


export async function catalogView(ctx) {
    // I get an object with results.
    ctx.render(catalogTemplate(loadGames()));
}

async function loadGames() {
    const games = await getAllGames();
    return gamesList(games.results);
}
