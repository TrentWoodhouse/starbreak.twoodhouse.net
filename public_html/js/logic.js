import * as VIEW from '/js/view.js';
import {MouseKeyboardControls} from "./MouseKeyboardControls.js";

let MAX_PLAYER_SPEED = 10;
export let REFRESH_RATE = 60;
export let controls = new MouseKeyboardControls(document.querySelector('#canvas'));
export function update(playerId, state) {
    VIEW.update(playerId, state);
    return state;
}

//Will add more to allow more client-based logic computations