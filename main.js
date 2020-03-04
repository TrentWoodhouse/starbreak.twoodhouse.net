let webSocketServer = require('websocket').server;
let http = require('http');

let MODELS = require('./model');
let LOGIC = require('./logic');
let CONFIG = require('./config.json');

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
server.listen(CONFIG.serverPort, function() {
    console.log((new Date()) + " Server is listening on port " + CONFIG.serverPort);
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
    if (state.data.players.size >= LOGIC.MAX_PLAYERS) {
        request.reject();
        return;
    }
    
    let connection = request.accept(null, request.origin);
    let id = state.idCounter++;
    let player = MODELS.makePlayer(id, 0, 0, 10);
    state.data.players[id] = player;
    state.data.players.size++;
    state.userInputs[id] = null;
    sendServerMessage('init', {
        version: CONFIG.version,
        player: player,
    });
    log(`Player ${id} connected (${state.data.players.size}/${LOGIC.MAX_PLAYERS})`);

    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            let msg = JSON.parse(message.utf8Data);
            let mouseXChangeOld = state.userInputs[msg.id] ? state.userInputs[msg.id]['mouseXChange'] : 0;
            let mouseYChangeOld = state.userInputs[msg.id] ? state.userInputs[msg.id]['mouseYChange'] : 0;
            state.userInputs[msg.id] = msg.controls;
            msg.controls['mouseXChangeOld'] = mouseXChangeOld;
            msg.controls['mouseYChangeOld'] = mouseYChangeOld;
        }
    });

    connection.on('close', function() {
        delete state.data.players[id];
        state.data.players.size--;
        delete state.userInputs[id];
        log(`Player ${id} disconnected (${state.data.players.size}/${LOGIC.MAX_PLAYERS})`);
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
    LOGIC.update(state);
}, 1000 / LOGIC.REFRESH_RATE);

