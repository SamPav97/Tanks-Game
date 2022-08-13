import { createRenderer } from "./engine.js";

export async function start(username, gameId) {
    const controls = {};
    // All are beginning value. x starts at 100. speed starts at 0.
    const player = {
        x: 100,
        y:100,
        direction: 0,
        speed: 0
    };

    const engine = await createRenderer();
    //Here I get information if the key is currently pressed. later when i do physical update at each 20ms I will check controls.
    engine.onKey = (key, pressed) => {
        controls[key] = pressed;
    };

    engine.registerMain(render, tick);

    function tick() {
        
    };

    function render() {
        engine.clear();
        engine.drawGrid();
        // size, location, radians (for rotation) for our tank. Those will change depending on the player dictionary.
        engine.drawImage('tracks0.png', player.x, player.y, 2, player.direction);
        engine.drawImage('tank-body.png', player.x, player.y, 2, player.direction);
    
        engine.drawText(player.speed, 10, 30); 
    }
}