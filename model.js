class Object3D {
    constructor() {
        this.position = {
            x: 0,
            y: 0,
            z: 0
        };
        this.quaternion = {
            x: 0,
            y: 0,
            z: 0,
            w: 1
        };
        this.velocity = 0;
        this.angularVelocity = 0;
        this.type = 'object';
        this.solid = true;
        this.collision = true;
    }
}

class Player extends Object3D {
    constructor(id) {
        super();
        this.id = id;
        this.type = 'player';
    }
}

let models = {
    makePlayer: function(id, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, rw = 0) {
        let p = new Player(id);
        p.position.x = x;
        p.position.y = y;
        p.position.z = z;
        p.quaternion.x = rx;
        p.quaternion.y = ry;
        p.quaternion.z = rz;
        p.quaternion.w = rw;
        return p;
    },
    makeObject: function(type, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, rw = 0) {
        let o = new Object3D();
        o.type = type;
        o.position.x = x;
        o.position.y = y;
        o.position.z = z;
        o.quaternion.x = rx;
        o.quaternion.y = ry;
        o.quaternion.z = rz;
        o.quaternion.w = rw;
        return o;
    }
};

module.exports = models;