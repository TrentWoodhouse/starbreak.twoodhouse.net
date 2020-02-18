import * as LOGIC from '/js/logic.js';

let wsUrl = 'ws://localhost:1337';

let websocket = new WebSocket(wsUrl);
let interval;
let id = -1;

websocket.onopen = function (event) {
    console.log('Connected to ' + wsUrl);
    interval = setInterval(function() {
        if (LOGIC.controls.mouseLock) {
            websocket.send(JSON.stringify({
                id: id,
                controls: LOGIC.controls.info()
            }));
        }
    }, 1000 / LOGIC.REFRESH_RATE);
};

websocket.onmessage = function (message) {
    let data = JSON.parse(message.data);
    switch (data.label) {
        case 'playerConfig':
            id = data.data.id;
            console.log(`Player id is set to ${data.data.id}`);
            break;
        case 'state':
            LOGIC.update(id, data);
            break;
    }
};

websocket.onerror = function (err){
    console.warn(err);
};

websocket.onclose = function () {
    console.log('Disconnected');
    clearInterval(interval);
};