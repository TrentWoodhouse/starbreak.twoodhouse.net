let PORT = 1337;

let webSocketServer = require('websocket').server;
let http = require('http');

let models = require('./model');
let logic = require('./logic');

let log = function(message) {
    let time = new Date();
    let output = (time.getMonth()+1) + "/"
        + time.getDate()  + "/"
        + time.getFullYear() + " "
        + time.getHours() + ":"
        + time.getMinutes() + ":"
        + time.getSeconds();
    console.log(output + ' - ' + message);
};

let server = http.createServer(function(request, response) {
    // Do nothing for now
});
server.listen(PORT, function() {
    console.log((new Date()) + " Server is listening on port " + PORT);
});

// create the server
let wss = new webSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

// Game State
let state = {
    players: [],
    objects: [],
    messages: [],
};

let idCounter = 0;

// WebSocket server
wss.on('request', function(request) {
    //TODO Add origin check
    if (state.players.length >= logic.MAX_PLAYERS) {
        request.reject();
        return;
    }
    
    let connection = request.accept(null, request.origin);
    let id = idCounter++;
    state.players.push(models.makePlayer(id));

    log(`Player ${id} connected (${state.players.length}/${logic.MAX_PLAYERS})`);

    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            log(message);
        }
    });

    connection.on('close', function(connection) {
        state.players.splice(state.players.findIndex( function(player){
            return player.id === id;
        }), 1);

        log(`Player ${id} disconnected (${state.players.length}/${logic.MAX_PLAYERS})`);
    });
});

setInterval(function() {
    wss.broadcast(JSON.stringify(state));
    state = logic.update(state);
}, 1000 / logic.REFRESH_RATE);