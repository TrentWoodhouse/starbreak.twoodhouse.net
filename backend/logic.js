let logic = {
    SCALE: .1,
    MAX_PLAYER_SPEED: 10,
    MAX_PLAYERS: 100,
    MAX_ASTEROIDS: 20,
    FIELD_RADIUS: 500,
    REFRESH_RATE: 1,
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
    for (const player of state.players) {
        if (player.velocity < logic.MAX_PLAYER_SPEED) {
            player.velocity += player.acceleration;
        }
        else {
            player.velocity = logic.MAX_PLAYER_SPEED;
        }
        //TODO Move forward
    }
}

module.exports = logic;