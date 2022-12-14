import { closeSocket, connect } from "./client.js";
import { closeEngine, createRenderer } from "./engine.js";

//File contains actual gamplay initialization.

const ACCELERATION = 600;
const MAX_SPEED = 300;
const TURN_RATE = 3;
const FRICTION = 1000;
const TANK_SIZE = 15;
const DASH_SPEED = 600;
const DASH_TIME = 0.25;
const DASH_COOLDOWN = 5;

//Necessary for resolving gosting issue upon rejoin.
export function closeGame() {
    closeSocket();
    closeEngine();
}


export async function start(username, gameId) {
    const controls = {};
    // All are beginning value. x starts at 100. speed starts at 0.
    const player = {
        x: 100,
        y: 100,
        direction: 0,
        speed: 0,
        cooldown: 0,
        dash: 0
    };
    // Include player tank in all tanks so that hit animation is visible when player is hit.
    const tanks = {
        [username]: player
    };

    let hits = [];
    let shots = [];

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
        //I take out the shots from the data and have to visualize them in render.
        shots = data.projectiles;
        //get data from server for who was hit. but this data lives only one frame.
        //Get only info about first hit; get hit tank from tanks by username; make it into objects; then add new hit to hits.
        let newHits = data.hits
            .map(h => h[0])
            .map(h => tanks[h])
            .map(h => ({
                x: h.x,
                y: h.y,
                alive: true,
                frame: 0
            }));
        hits.push(...newHits);
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
        // When dash is smaller than cooldown-dashtime we should allow max speed to go over allowed.
        if (Math.abs(player.speed) > MAX_SPEED && player.dash < DASH_COOLDOWN - DASH_TIME) {
            // To prevent when going backawrds to switch the speed we multiply it by the sign = or - of player speed.
            player.speed = MAX_SPEED * Math.sign(player.speed);
        }

        // Turning around its own axis.
        if (controls['ArrowLeft']) {
            player.direction -= TURN_RATE * engine.STEP_SIZE_S;
        } else if (controls['ArrowRight']) {
            player.direction += TURN_RATE * engine.STEP_SIZE_S
        }

        //Shooting detection.
        // if button press space and player did not shoot in last second (to avoid machinegun fire)
        if (controls['Space'] && player.cooldown == 0) {
            // Initate cooldown.
            player.cooldown = 1;
            //Say you've shot and send the msg through connection.
            //Server will take care of shot but give it correct data.
            //Origin says it is our shot. x, y origin of shot, direction is way we are facing.
            const shot = {
                origin: username,
                x: player.x,
                y: player.y,
                direction: player.direction,
                alive: true
            };
            //Send data thru:
            connecttion.fire(shot);
        } else if (player.cooldown > 0) {
            player.cooldown = Math.max(player.cooldown - engine.STEP_SIZE_S, 0);
        }

        //Dashing
        if (controls['ShiftLeft'] && player.dash == 0) {
            player.dash = DASH_COOLDOWN;
            //Only dash forward... no negative speed:
            player.speed = DASH_SPEED;
        } else if (player.dash > 0) {
            // Cool off.
            player.dash = Math.max(player.dash - engine.STEP_SIZE_S, 0);
        }



        if (player.speed != 0) {
            // cos for x and sin for y
            player.x += Math.cos(player.direction) * player.speed * engine.STEP_SIZE_S;
            player.y += Math.sin(player.direction) * player.speed * engine.STEP_SIZE_S;
        }

        //Make sure players cannot leave the field.
        if (player.x < TANK_SIZE) {
            player.x = TANK_SIZE;
        } else if (player.x > engine.WIDTH - TANK_SIZE) {
            player.x = engine.WIDTH - TANK_SIZE;
        }

        if (player.y < TANK_SIZE) {
            player.y = TANK_SIZE;
        } else if (player.y > engine.HEIGHT - TANK_SIZE) {
            player.y = engine.HEIGHT - TANK_SIZE;
        }

        //Send my position to server. 
        connecttion.position(player);
    };

    function render() {
        engine.clear();
        engine.drawGrid();

        const players = Object.keys(tanks);

        for (let i = 0; i < players.length; i++) {
            //render guest tank
            const user = players[i];
            const tank = tanks[user];
            engine.drawImage('tracks0.png', tank.x, tank.y, 2, tank.direction);
            engine.drawImage('tank-body.png', tank.x, tank.y, 2, tank.direction);

            engine.drawText(user, 10, 110 + (20 * i), 'red');
        }

        //Visualize the shots
        for (let shot of shots) {
            engine.drawCircle(shot.x, shot.y, 5, 'black');
        }

        //Make animation for hits.
        for (let hit of hits) {
            engine.drawCircle(hit.x, hit.y, hit.frame * 2, 'red');
            engine.drawCircle(hit.x, hit.y, hit.frame * 1, 'orange');
            engine.drawCircle(hit.x, hit.y, hit.frame * 0.5, 'white');
            hit.frame++
            if (hit.frame >= 15) {
                //tank dies
                hit.alive = false;
            }
        }
        hits = hits.filter(h => h.alive);
        // Log number of players and player list. This happens in upper left corner.
        engine.drawText(`${players.length} player${players.length > 1 ? 's' : ''}`, 10, 90);
        for (let i = 0; i < players.length; i++) {
            const user = players[i];
            engine.drawText(user, 10, 110 + (20 * i), user == username ? 'green' : 'red');
        }

        engine.drawText('Speed:' + player.speed, 10, 30);
        engine.drawText('Dash:' + player.dash.toFixed(1), 10, 50);
    }
}