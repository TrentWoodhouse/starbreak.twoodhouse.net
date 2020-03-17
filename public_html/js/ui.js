export default {
    //TODO Implement names, points, health

    debugElement: document.getElementById('debug'),
    leaderBoardElement: document.getElementById('leaderboard'),
    messagesElement: document.getElementById('messages'),
    versionElement: document.getElementById('version'),
    loadingElement: document.getElementById('loading'),
    loadingTextElement: document.getElementById('loading-text'),

    leaderBoard: [],
    messages: [],

    debugText: "",
    leaderBoardText: "",
    messagesText: "",
    versionText: "",

    debugToggled: false,
    leaderBoardNumberPositions: 5,
    allMessagesToggled: false,
    messagesLineHeight: 20,
    loadingToggled: false,

    getDebug: function(player) {
        return `ID: ${player.id}\n` +
            `X: ${Math.round(player.position.x)}\n` +
            `Y: ${Math.round(player.position.y)}\n` +
            `Z: ${Math.round(player.position.z)}`;
    },
    getLeaderBoard: function (id, players) {
        return `Players logged in: ${players.size}`;
    },
    addMessage: function(message) {
        this.messages.push({
            message: message,
            timestamp: Date.now(),
        });
    },
    setVersion: function(v) {
        this.versionText = 'v' + v;
        this.versionElement.innerText = this.versionText;
    },
    updateText: function(id, players) {
        this.debugText = this.debugToggled ? this.getDebug(players[id]) : "";
        this.leaderBoardText = this.getLeaderBoard(id, players);
        if (this.allMessagesToggled || this.messages[this.messages.length - 1].timestamp < Date.now() + 5000) {
            this.messagesText = "";
            for (let i = Math.max(this.messages.length - this.messagesLineHeight, 0); i < this.messages.length; i++) {
                if (this.allMessagesToggled || this.messages[i].timestamp > Date.now() - 5000) {
                    this.messagesText += this.messages[i].message;
                    if (i !== this.messages.length - 1) {
                        this.messagesText += "\n";
                    }
                }
            }
        }
        else {
            this.messagesText = "";
        }

        this.debugElement.innerText = this.debugText;
        this.leaderBoardElement.innerText = this.leaderBoardText;
        this.messagesElement.innerText = this.messagesText;
    },
    setLoading(bool) {
        this.loadingToggled = bool;
        if (this.loadingToggled) {
            this.loadingElement.removeAttribute("hidden");
            this.loadingTextElement.removeAttribute("hidden");
        }
        else {
            this.loadingElement.setAttribute("hidden", "");
            this.loadingTextElement.setAttribute("hidden", "");

        }
    }
};