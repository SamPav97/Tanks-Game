// Routing and handling views
import page from './lib/page.mjs';
import { addLogout } from './middleware/logout.js';
import { addRender } from './middleware/render.js';
import { addSession } from './middleware/session.js';
import { canvasView } from './views/canvas.js';
import { catalogView } from './views/catalog.js';
import { createView } from './views/create.js';
import { detailsView } from './views/details.js';
import { homeView } from './views/home.js';
import { loginView } from './views/login.js';
import { registerView } from './views/register.js';
import { closeGame } from './engine/game.js';



const main = document.getElementById('main');

page(addSession());
page(addLogout())
page(addRender(main));
page('/index.html', '/');
page('/', homeView);
page('/login', loginView);
page('/register', registerView);
page('/games', catalogView);
page('/games/:id', detailsView);
page('/play/:id', canvasView);
page.exit('/play/:id', (ctx, next) => {
    closeGame();
    next();
});
page('/create', createView);


page.start();

