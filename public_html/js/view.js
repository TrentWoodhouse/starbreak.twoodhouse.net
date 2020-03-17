import * as THREE from '/js/three.js-master/build/three.module.js';
import UI from '/js/ui.js';

const canvas = document.querySelector('#canvas');
const renderer = new THREE.WebGLRenderer({canvas});
const fov = 75;
const aspect = 2;
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

const scene = new THREE.Scene();
{
    const light = new THREE.DirectionalLight(0xFFFFFF, .95);
    light.position.set(-1, 2, 4);
    scene.add(light);
}

{
    const light = new THREE.AmbientLight(0xFFFFFF, .05);
    scene.add(light);
}

{
    const loader = new THREE.CubeTextureLoader();
    scene.background = loader.load([
        '/model/skybox/right.png',
        '/model/skybox/left.png',
        '/model/skybox/top.png',
        '/model/skybox/bottom.png',
        '/model/skybox/front.png',
        '/model/skybox/back.png',
    ]);
}

let cubes = {};

function addCube(id, size, color) {
    const geometry = new THREE.BoxGeometry(size, size, size);
    const material = new THREE.MeshPhongMaterial({color});
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    cubes[id] = cube;
}

function updateCube(cube, player, isControllingPlayer) {
    if (isControllingPlayer){
        camera.position.x = player.position.x;
        camera.position.y = player.position.y;
        camera.position.z = player.position.z;

        camera.quaternion.x = player.quaternion.x;
        camera.quaternion.y = player.quaternion.y;
        camera.quaternion.z = player.quaternion.z;
        camera.quaternion.w = player.quaternion.w;
    }
    else {
        cube.position.x = player.position.x;
        cube.position.y = player.position.y;
        cube.position.z = player.position.z;

        cube.quaternion.x = player.quaternion.x;
        cube.quaternion.y = player.quaternion.y;
        cube.quaternion.z = player.quaternion.z;
        cube.quaternion.w = player.quaternion.w;
    }
}

let particleSystem;
let particlePositions = [];
{
    let numParticles = 70;
    let particleSpan = 20;
    let pGeometry = new THREE.Geometry();
    let pMaterial = new THREE.ParticleBasicMaterial({
        color: 0x555555,
        size: .09,
        map: THREE.ImageUtils.loadTexture(
            "../img/asteroid.png"
        ),
        blending: THREE.AdditiveBlending
    });

    for (let i = 0; i < numParticles; i++) {
        let v = new THREE.Vertex(
            (Math.random() - .5) * particleSpan,
            (Math.random() - .5) * particleSpan,
            (Math.random() - .5) * particleSpan);
        pGeometry.vertices.push(v);
        particlePositions.push(v.clone());
    }
    particleSystem = new THREE.ParticleSystem(pGeometry, pMaterial);
    scene.add(particleSystem);
}

function updateParticles() {
    particleSystem.position.x = camera.position.x;
    particleSystem.position.y = camera.position.y;
    particleSystem.position.z = camera.position.z;
    let vertices = particleSystem.geometry.vertices;
    for (let i = 0; i < particlePositions.length; i++) {
        vertices[i].x = mod(particlePositions[i].x - particleSystem.position.x + 10, 20) - 10;
        vertices[i].y = mod(particlePositions[i].y - particleSystem.position.y + 10, 20) - 10;
        vertices[i].z = mod(particlePositions[i].z - particleSystem.position.z + 10, 20) - 10;
    }
    particleSystem.geometry.verticesNeedUpdate = true;

    function mod(n, m) {
        let remain = n % m;
        return remain >= 0 ? remain : remain + m;
    }
}


addCube('origin', .5, '#3f3');

function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        renderer.setSize(width, height, false);
    }
    return needResize;
}

function render(time) {
    time *= 0.001;

    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }

    updateParticles();

    const speed = 1.1;
    const rot = time * speed;
    cubes['origin'].rotation.y = rot;
    renderer.render(scene, camera);

    requestAnimationFrame(render);
}

requestAnimationFrame(render);

export function update(playerId, state) {
    UI.updateText(playerId, state.players);
    let cubeIds = Object.keys(cubes).filter(function (id){
        return !isNaN(parseInt(id));
    });
    let playerIds = Object.keys(state.players).filter(function (id){
        return !isNaN(parseInt(id));
    });
    let i = 0;
    let j = 0;

    while (i < cubeIds.length && j < playerIds.length) {
        if (cubeIds[i] < playerIds[j]){
            scene.remove(cubes[cubeIds[i]]);
            delete cubes[cubeIds[i]];
            i++;
        }
        else if (cubeIds[i] > playerIds[j]){
            if (playerIds[j] != playerId){
                addCube(playerIds[j], .1, '#fff');
            }
            updateCube(cubes[playerIds[j]], state.players[playerIds[j]], playerIds[j] == playerId);
            j++;
        }
        else{
            updateCube(cubes[cubeIds[i]], state.players[playerIds[j]], playerIds[j] == playerId);
            i++;
            j++;
        }
    }
    while (i < cubeIds.length || j < playerIds.length) {
        if (i < cubeIds.length){
            scene.remove(cubes[cubeIds[i]]);
            delete cubes[cubeIds[i]];
            i++;
        }
        else {
            if (playerIds[j] != playerId){
                addCube(playerIds[j], .1, '#fff');
            }
            updateCube(cubes[playerIds[j]], state.players[playerIds[j]], playerIds[j] == playerId);
            j++;
        }
    }
}