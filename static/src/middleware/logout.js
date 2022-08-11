import { logout } from '../api/users.js'

//A lot of acrobatics with this logout function. In my render file I have to get the context to attach the logout function and give it to my layout template to have it as an event listener...
//Consider having it as an href in the app as ususal.

export function addLogout() {
   return (ctx, next) => {
        ctx.onLogout = onLogout.bind(null, ctx);
        next();
    }
}

function onLogout(ctx) {
    logout();
    ctx.page.redirect('/');
}