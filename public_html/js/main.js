import * as LOGIC from '/js/logic.js';
import UI from '/js/ui.js';
import CONFIG from './config.js';

let wsUrl = CONFIG.serverHost + ':' + CONFIG.serverPort;

let websocket = new WebSocket(wsUrl);
let interval;
let id;
let version;

UI.debugToggled = true; //TODO implement way to use keys for this

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
    let JSONdata = JSON.parse(message.data);
    switch (JSONdata.label) {
        case 'init':
            id = JSONdata.data.player.id;
            version = JSONdata.data.version;
            UI.setVersion(version);
            UI.addMessage(`Player id is set to ${id}`);
            break;
        case 'state':
            LOGIC.update(id, JSONdata);
            break;
    }
};

websocket.onerror = function (err){
    console.warn(err);
};

websocket.onclose = function () {
    UI.setLoading(true);
    clearInterval(interval);
};