let logic = {
    SCALE: .1,
    MAX_PLAYER_SPEED: 10,
    MAX_PLAYERS: 100,
    MAX_ASTEROIDS: 20,
    FIELD_RADIUS: 500,
    REFRESH_RATE: 60,
    update: function(state) {
        checkPlayerMoves(state);
        checkAndPerformCollisions(state);
        step(state);
        return state;
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
            if (controls){
                if(controls.upKey){
                    player.position.z -= logic.MAX_PLAYER_SPEED * Math.cos(player.rotation.y) / logic.REFRESH_RATE;
                    player.position.x -= logic.MAX_PLAYER_SPEED * Math.sin(player.rotation.y) / logic.REFRESH_RATE;
                }
                if(controls.downKey){
                    player.position.z += logic.MAX_PLAYER_SPEED * Math.cos(player.rotation.y) / logic.REFRESH_RATE;
                    player.position.x += logic.MAX_PLAYER_SPEED * Math.sin(player.rotation.y) / logic.REFRESH_RATE;
                }
                if(controls.rightKey){
                    player.position.z -= logic.MAX_PLAYER_SPEED * Math.sin(player.rotation.y) / logic.REFRESH_RATE;
                    player.position.x += logic.MAX_PLAYER_SPEED * Math.cos(player.rotation.y) / logic.REFRESH_RATE;
                }
                if(controls.leftKey){
                    player.position.z += logic.MAX_PLAYER_SPEED * Math.sin(player.rotation.y) / logic.REFRESH_RATE;
                    player.position.x -= logic.MAX_PLAYER_SPEED * Math.cos(player.rotation.y) / logic.REFRESH_RATE;
                }
                player.rotation.y = -.2 * controls.mouseXChange / logic.REFRESH_RATE;
            }
        }
    }
}

module.exports = logic;