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
    console.log(cubes);
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
    for (let id in state.players) {
        if (!isNaN(parseInt(id))) {
            let player = state.players[id];
            if (cubes.hasOwnProperty(player.id)) {
                cubes[player.id].position.x = player.position.x;
                cubes[player.id].position.y = player.position.y;
                cubes[player.id].position.z = player.position.z;

                cubes[player.id].rotation.x = player.rotation.x;
                cubes[player.id].rotation.y = player.rotation.y;
                cubes[player.id].rotation.z = player.rotation.z;
            }
            else if (player.id !== playerId) {
                addCube(player.id, .1, '#fff');
            }
        }
    }

    camera.position.x = state.players[playerId].position.x;
    camera.position.y = state.players[playerId].position.y;
    camera.position.z = state.players[playerId].position.z;

    camera.rotation.x = state.players[playerId].rotation.x;
    camera.rotation.y = state.players[playerId].rotation.y;
    camera.rotation.z = state.players[playerId].rotation.z;
}