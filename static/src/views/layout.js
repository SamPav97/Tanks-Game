import { html } from '../lib/lit-html.js'


//My layout template gets its template result depending on page and delivers it in the main here.

export const layoutTemplate = (body, onLogout, user) => html`
<header>
    <a href="/"><span class="logo">Tank Game</span></a>
    <nav>
        <a href="/games">View Lobbies</a>
        ${user ? html`
        <a href="/create">Host Game</a>
        <a @click=${onLogout} href="javascript:void(0)">Logout</a>` : html`        
        <a href="/login">Login</a>
        <a href="/register">Register</a>`}

        
    </nav>
</header>

<main>
    ${body}
</main>
`;