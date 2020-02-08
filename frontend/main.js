let canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

import * as THREE from '/three.js-master/build/three.js';


let wsUrl = 'ws://localhost:1337';

let websocket = new WebSocket(wsUrl);

websocket.onopen = function (event) {
    console.log('Connected to ' + wsUrl);
};

websocket.onmessage = function (message) {
    console.log(JSON.parse(message.data));
};

websocket.onerror = function (err){
    console.warn(err);
};

websocket.onclose = function (event) {
    console.log('Disconnected');
};