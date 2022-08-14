import { connect } from "./client.js";
import { createRenderer } from "./engine.js";

const ACCELERATION = 600;
const MAX_SPEED = 300;
const TURN_RATE = 3;
const FRICTION = 1000;


export async function start(username, gameId) {
    const tanks = {};
    const controls = {};
    // All are beginning value. x starts at 100. speed starts at 0.
    const player = {
        x: 100,
        y: 100,
        direction: 0,
        speed: 0
    };

    const engine = await createRenderer();

    //Here I get information if the key is currently pressed. later when i do physical update at each 20ms I will check controls.
    engine.onKey = (key, pressed) => {
        controls[key] = pressed;
    };

    //Get connection with login credentials:
    const connecttion = await connect(username, gameId, player);
    //Join game.
    connecttion.onPlayerJoined = ({ username, player: playerData }) => {
        console.log('Player connected', username, player);
        tanks[username] = playerData;
    };
    // Leave game.
    connecttion.onPlayerLeft = (username) => {
        console.log('Player left', username);
        delete tanks[username]
    };
    // All joined players.
    connecttion.onPlayers = (playerData) => {
        //Make sure all players are visible as joined
        Object.assign(tanks, playerData)
    };
    // Hook up to server to sync enemy tanks.
    connecttion.onUpdate = (data) => {
        for (let user in data.players) {
            // get enemy tank locally and see its movemnt. 
            if (user != username && tanks[user]) {
            Object.assign(tanks[user], data.players[user]);
            }
        };
    };

    engine.registerMain(render, tick);

    function tick() {
        // First do player controllers, then simulation.
        // Movement
        if (controls['ArrowUp']) {
            player.speed += ACCELERATION * engine.STEP_SIZE_S;
        } else if (controls['ArrowDown']) {
            player.speed -= ACCELERATION * engine.STEP_SIZE_S;
        } else if (player.speed > 0) {
            // Add friction so it stops automatically. math.max the bigger value of the two so the tank doesnt bump backwards.
            player.speed = Math.max(player.speed - FRICTION * engine.STEP_SIZE_S, 0);
        } else if (player.speed < 0) {
            player.speed = Math.min(player.speed + FRICTION * engine.STEP_SIZE_S, 0);
        }

        if (Math.abs(player.speed) > MAX_SPEED) {
            // To prevent when going backawrds to switch the speed we multiply it by the sign = or - of player speed.
            player.speed = MAX_SPEED * Math.sign(player.speed);
        }

        // Turning around its own axis.
        if (controls['ArrowLeft']) {
            player.direction -= TURN_RATE * engine.STEP_SIZE_S;
        } else if (controls['ArrowRight']) {
            player.direction += TURN_RATE * engine.STEP_SIZE_S
        }

        if (player.speed != 0) {
            // cos for x and sin for y
            player.x += Math.cos(player.direction) * player.speed * engine.STEP_SIZE_S;
            player.y += Math.sin(player.direction) * player.speed * engine.STEP_SIZE_S;
        }

        //Send my position to server. 
        connecttion.position(player);
    };

    function render() {
        engine.clear();
        engine.drawGrid();

        const enemies = Object.keys(tanks)
        // Log number of players and player list. This happens in upper left corner.
        engine.drawText(`${1 + enemies.length} player${enemies.length > 0 ? 's' : ''}`, 10, 50);
        engine.drawText(username, 10, 70, 'green');


        for (let i = 0; i < enemies.length; i++) {
            //render guest tank
            const user = enemies[i];
            const tank = tanks[user];
            engine.drawImage('tracks0.png', tank.x, tank.y, 2, tank.direction);
            engine.drawImage('tank-body.png', tank.x, tank.y, 2, tank.direction);

            engine.drawText(user, 10, 90 + (20 * i), 'red');
        }
        // Render my tank.
        // size, location, radians (for rotation) for our tank. Those will change depending on the player dictionary.
        engine.drawImage('tracks0.png', player.x, player.y, 2, player.direction);
        engine.drawImage('tank-body.png', player.x, player.y, 2, player.direction);

        engine.drawText(player.speed, 10, 30);
    }
}