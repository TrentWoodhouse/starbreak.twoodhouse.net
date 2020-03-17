let {Quaternion, Vector3} = require('three');

//Player velocity variables
const DEFAULT_VELOCITY = 10;
const FWD_COEF = 1;
const BWD_COEF = -1;
const VEL_REDUCTION_COEF = 1.1;

//Player angular velocity variables
const ROLL_COEF = .5;
const ROLL_REDUCTION_COEF = 1.1;

//Player mouse sensitivity variables
const MOUSE_SENSITIVITY = .2;

let LOGIC = {
    SCALE: .1,
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
            let quaternion = new Quaternion(player.quaternion.x, player.quaternion.y, player.quaternion.z, player.quaternion.w);
            if (controls){
                if(controls.upKey){
                    player.velocity += FWD_COEF;
                }
                if(controls.downKey){
                    player.velocity += BWD_COEF;
                }
                if(controls.rightKey){
                    player.angularVelocity += ROLL_COEF;
                }
                if(controls.leftKey){
                    player.angularVelocity -= ROLL_COEF;
                }

                player.velocity = (player.velocity - DEFAULT_VELOCITY) / VEL_REDUCTION_COEF + DEFAULT_VELOCITY;
                player.angularVelocity /= ROLL_REDUCTION_COEF;


                let moveVector = new Vector3(0, 0, -player.velocity / LOGIC.REFRESH_RATE).applyQuaternion(quaternion);
                player.position.x += moveVector.x;
                player.position.y += moveVector.y;
                player.position.z += moveVector.z;

                quaternion.multiply(new Quaternion().setFromAxisAngle(
                    new Vector3(0,0,1), -player.angularVelocity / LOGIC.REFRESH_RATE));
                quaternion.multiply(new Quaternion().setFromAxisAngle(
                    new Vector3(0,1,0), -MOUSE_SENSITIVITY * (controls.mouseXChange - controls.mouseXChangeOld) / LOGIC.REFRESH_RATE));
                quaternion.multiply(new Quaternion().setFromAxisAngle(
                    new Vector3(1,0,0), -MOUSE_SENSITIVITY * (controls.mouseYChange - controls.mouseYChangeOld) / LOGIC.REFRESH_RATE));

                quaternion.normalize();
                player.quaternion.x = quaternion.x;
                player.quaternion.y = quaternion.y;
                player.quaternion.z = quaternion.z;
                player.quaternion.w = quaternion.w;
            }
        }
    }
}

module.exports = LOGIC;