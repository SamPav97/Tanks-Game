import { register } from '../api/users.js';
import { bindForm } from '../api/util.js';
import { html, nothing } from '../lib/lit-html.js'

const registerTemplate = (onSubmit, error) => html`
<section class="narrow">
    <h1>Register</h1>

    <form @submit=${onSubmit}>
        ${error ? html`<p class="error-msg">${error}</p>` : nothing}
        <div class="form-align">
            <label class="form-row"><span>Username</span><input type="text" name="username"></label>
            <label class="form-row"><span>Password</span><input type="password" name="password"></label>
            <label class="form-row"><span>Repeat</span><input type="password" name="repass"></label>
        </div>
        <button class="action">Register</button>
        <p>Already have an account? <a href="/login">Login now!</a></p>
    </form>
</section>
`;

export function registerView(ctx) {
    ctx.render(registerTemplate(bindForm(onSubmit)));

    async function onSubmit({ username, password, repass }, form) {
        try {
            if (password != repass) {
                return new Error('Passwords do not match!');
            }
            await register(username, password);
            form.reset();
            ctx.page.redirect('/');
        } catch (err) {
            ctx.render(registerTemplate(bindForm(onSubmit), err.message));
        }
    }
}