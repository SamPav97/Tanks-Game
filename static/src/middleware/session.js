//Gets the userData and adds it to ctxt so that all modules know the status of userData. One place I need this is in deciding which buttons to show to user.

import { getUserData } from '../api/util.js';

export function addSession() {
    return (ctx, next) => {
        ctx.user = getUserData();
        next();
    }
}