import { html } from '../lib/lit-html.js';
import { repeat } from '../lib/directives/repeat.js';
import { until } from '../lib/directives/until.js'
import { getAllGames } from '../api/games.js';


const catalogTemplate = (gamesPromise) => html`
<section>
    <h1>Game Lobbies</h1>
    <main>
        ${until(gamesPromise, 'Loading games...')}
    </main>
</section>`;

// g=>g.objectId is an identity function that updates only new things in the catalog instead of changing all of them.
const gamesList = (games) => games.length == 0
    ? html`<p>No lobbies hosted yet. <a href="/create">Be the first!</a></p>`
    : html`
<ul>
    ${repeat(games, g => g.objectId, lobbyCard)}
</ul>`;

const lobbyCard = game => html`
<li><a class="lobby-link" href="/games/${game.objectId}">${game.name}</a></li>`;


export async function catalogView(ctx) {
    // I get an object with results.
    ctx.render(catalogTemplate(loadGames()));
}

//Get all games.
async function loadGames() {
    const games = await getAllGames();
    return gamesList(games.results);
}
