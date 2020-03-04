import * as THREE from '/js/three.js-master/build/three.module.js';
//import {FirstPersonControls} from '/js/FirstPersonControls.js';

const canvas = document.querySelector('#canvas');
const renderer = new THREE.WebGLRenderer({canvas});
const fov = 75;
const aspect = 2;
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

const scene = new THREE.Scene();
{
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
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
    let eulerCoords = new THREE.Euler().setFromQuaternion(
        new THREE.Quaternion(player.rotation.x, player.rotation.y, player.rotation.z, player.rotation.w));
    if (isControllingPlayer){
        camera.position.x = player.position.x;
        camera.position.y = player.position.y;
        camera.position.z = player.position.z;

        camera.rotation.x = eulerCoords.x;
        camera.rotation.y = eulerCoords.y;
        camera.rotation.z = eulerCoords.z;
    }
    else {
        cube.position.x = player.position.x;
        cube.position.y = player.position.y;
        cube.position.z = player.position.z;

        cube.rotation.x = eulerCoords.x;
        cube.rotation.y = eulerCoords.y;
        cube.rotation.z = eulerCoords.z;
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

    const speed = 1.1;
    const rot = time * speed;
    cubes['origin'].rotation.y = rot;
    renderer.render(scene, camera);

    requestAnimationFrame(render);
}

requestAnimationFrame(render);

export function update(playerId, state) {
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
            addCube(playerIds[j], .1, '#fff');
            updateCube(cubes[playerIds[j]], state.players[playerIds[j]], playerIds[j] == playerId);
            j++;
        }
    }
}