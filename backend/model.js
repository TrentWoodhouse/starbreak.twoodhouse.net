class Object3D {
    constructor() {
        this.position = {
            x: 0,
            y: 0,
            z: 0
        };
        this.rotation = {
            x: 0,
            y: 0,
            z: 0
        };
        this.velocity = 0;
        this.acceleration = 0;
        this.type = 'object';
        this.solid = true;
        this.collision = true;
    }
}

class Player extends Object3D {
    constructor(id) {
        super();
        this.id = id;
    }
}

let models = {
    makePlayer: function(id, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) {
        let p = new Player(id);
        p.position.x = x;
        p.position.y = y;
        p.position.z = z;
        p.rotation.x = rx;
        p.rotation.y = ry;
        p.rotation.z = rz;
        return p;
    },
    makeObject: function(type, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) {
        let o = new Object3D();
        o.type = type;
        o.position.x = x;
        o.position.y = y;
        o.position.z = z;
        o.rotation.x = rx;
        o.rotation.y = ry;
        o.rotation.z = rz;
        return o;
    }
};

module.exports = models;