let canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


let wsUrl = 'ws://localhost:1337';

let websocket = new WebSocket(wsUrl);

websocket.onopen = function (event) {
    console.log('Connected to ' + wsUrl);
};

websocket.onmessage = function (message) {
    let data = JSON.parse(message.data);
    switch (data.label) {
        case 'playerConfig':
            console.log(`Player id is set to ${data.data.id}`);
            break;
        case 'state':
            console.log('State information received');
            break;
    }
};

websocket.onerror = function (err){
    console.warn(err);
};

websocket.onclose = function (event) {
    console.log('Disconnected');
};
