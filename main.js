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
    idCounter: 0,
    userInputs: {},
    data: {
        label: 'state',
        players: {
            'size': 0,
        },
        objects: {
            'size': 0,
        },
        messages: [],
    }
};

// WebSocket server
wss.on('request', function(request) {
    //TODO Add origin check
    if (state.data.players.size >= logic.MAX_PLAYERS) {
        request.reject();
        return;
    }
    
    let connection = request.accept(null, request.origin);
    let id = state.idCounter++;
    let player = models.makePlayer(id, 0, 0, 10);
    state.data.players[id] = player;
    state.data.players.size++;
    state.userInputs[id] = null;
    sendServerMessage('playerConfig', player);
    log(`Player ${id} connected (${state.data.players.size}/${logic.MAX_PLAYERS})`);

    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            let msg = JSON.parse(message.utf8Data);
            state.userInputs[msg.id] = msg.controls;
        }
    });

    connection.on('close', function() {
        delete state.data.players[id];
        state.data.players.size--;
        delete state.userInputs[id];
        log(`Player ${id} disconnected (${state.data.players.size}/${logic.MAX_PLAYERS})`);
    });

    function sendServerMessage(label, data) {
        connection.send(JSON.stringify({
            label: label,
            data: data
        }));
    }
});

setInterval(function() {
    wss.broadcast(JSON.stringify(state.data));
    logic.update(state);
}, 1000 / logic.REFRESH_RATE);
