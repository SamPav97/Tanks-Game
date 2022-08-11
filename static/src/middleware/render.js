import { render } from '../lib/lit-html.js';
import { layoutTemplate } from '../views/layout.js';

// Decorate my context with render so I do not have to import it everywhere.

export function addRender(main) {
    let ctxCache = null;

    return (ctx, next) => {
        ctx.render = renderMain;
        ctxCache = ctx;
        next();
    };


    //Here I render the layout template. It takes the template result, the logout function, the userData.
    //The template result is the template that I unpack inside the layout template. ex: the login page template.
    //the ctx.render basically becomes the render mainfunction.
    function renderMain(templateResult) {
        render(layoutTemplate(templateResult, ctxCache.onLogout, ctxCache.user), main);
    }
}