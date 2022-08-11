import { html } from '../lib/lit-html.js'

const homeTemplate = () => html`
<h1>Home page</h1>
<p>Welcome</p>
`;

export function homeView(ctx) {
    ctx.render(homeTemplate());

}