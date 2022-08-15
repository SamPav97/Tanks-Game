/* globals io */

export async function connect(username, roomId, player) {
    // I need a promise returend.
    return new Promise((resolve, reject) => {
        //Establish connection with server.
        const socket = io.connect();
        //I need to send the player data to the server. Like postion.
        //Fire sends the fire event to the server, which simulates it.
        const client = {
            position(player) {
                socket.emit('position', player);
            },
            fire(shot) {
                socket.emit('fire', shot);
            },
            onPlayerJoined() {},
            onPlayerLeft() {},
            onPlayers() {},
            onUpdate() {}
        };

        //Below is the callback. Socket on listens for data from event connect.
        socket.on('connect', () => {
            console.log('connected');
            resolve(client);
            //socket emit sends data. Parameters are package name and its content to the Server. Now I want to join a multiplayer game.
            socket.emit('join', {
                username,
                roomId,
                player
            });
        });

        //Below is the callback. Socket on listens for data from event playerJoined n left.
        socket.on('playerJoined', data => client.onPlayerJoined(data));
        socket.on('playerLeft', data => client.onPlayerLeft(data));
        // Returns a list of all players already in game.
        socket.on('players', data => client.onPlayers(Object.fromEntries(data)));
        //Hook up to the server to show movent and updates for enemy tanks. Make sure to convert it to data you can use.
        socket.on('update', data => {
            data.players = Object.fromEntries(data.players);
            client.onUpdate(data);
        });
    });
} 