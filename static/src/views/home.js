import { html } from '../lib/lit-html.js'

const homeTemplate = () => html`
<section>
    <h1>Home page</h1>
    <main>
        <p>Welcome to our site!</p>
        <h2>Get into the tank and join the war!</h2>
    </main>
</section>`;

export function homeView(ctx) {
    ctx.render(homeTemplate());

}