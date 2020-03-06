let {Quaternion, Vector3, Euler} = require('three');

let logic = {
    SCALE: .1,
    MAX_PLAYER_SPEED: 10,
    ROLL_SPEED: 2,
    MOUSE_SENSITIVITY: .2,
    MAX_PLAYERS: 100,
    MAX_ASTEROIDS: 200,
    FIELD_RADIUS: 500,
    REFRESH_RATE: 60,
    update: function(state) {
        checkPlayerMoves(state);
        checkAndPerformCollisions(state);
        step(state);
    }
};

function checkPlayerMoves(state) {
    //Unimportant for now
}

function checkAndPerformCollisions(state) {
    //Unimportant for now
}

function step(state) {
    for (let id in state.data.players) {
        if (!isNaN(parseInt(id))) {
            let player = state.data.players[id];
            let controls = state.userInputs[id];
            let curQuaternion = new Quaternion(player.rotation.x, player.rotation.y, player.rotation.z, player.rotation.w);
            if (controls){
                if(controls.upKey){
                    let moveVector = new Vector3(0, 0, -logic.MAX_PLAYER_SPEED / logic.REFRESH_RATE).applyQuaternion(curQuaternion);
                    player.position.x += moveVector.x;
                    player.position.y += moveVector.y;
                    player.position.z += moveVector.z;
                }
                if(controls.downKey){
                    let moveVector = new Vector3(0, 0, logic.MAX_PLAYER_SPEED / logic.REFRESH_RATE).applyQuaternion(curQuaternion);
                    player.position.x += moveVector.x;
                    player.position.y += moveVector.y;
                    player.position.z += moveVector.z;
                }
                if(controls.rightKey){
                    curQuaternion.multiply(new Quaternion().setFromAxisAngle(
                        new Vector3(0,0,1), -logic.ROLL_SPEED / logic.REFRESH_RATE));
                }
                if(controls.leftKey){
                    curQuaternion.multiply(new Quaternion().setFromAxisAngle(
                        new Vector3(0,0,1), logic.ROLL_SPEED / logic.REFRESH_RATE));
                }

                curQuaternion.multiply(new Quaternion().setFromAxisAngle(
                    new Vector3(0,1,0), -logic.MOUSE_SENSITIVITY * (controls.mouseXChange - controls.mouseXChangeOld) / logic.REFRESH_RATE));
                curQuaternion.multiply(new Quaternion().setFromAxisAngle(
                    new Vector3(1,0,0), -logic.MOUSE_SENSITIVITY * (controls.mouseYChange - controls.mouseYChangeOld) / logic.REFRESH_RATE));

                curQuaternion.normalize();
                player.rotation.x = curQuaternion.x;
                player.rotation.y = curQuaternion.y;
                player.rotation.z = curQuaternion.z;
                player.rotation.w = curQuaternion.w;
            }
        }
    }
}

module.exports = logic;