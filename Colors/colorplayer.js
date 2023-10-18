import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const manager = new THREE.LoadingManager();
const loader = new GLTFLoader(manager);
const scene = new THREE.Scene();
scene.background = new THREE.Scene();

//Renderer and camera
const container = document.getElementById('threeCanvas');
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
camera.aspect = container.offsetWidth / container.offsetHeight;
camera.updateProjectionMatrix();
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setSize(container.offsetWidth, container.offsetHeight);

container.appendChild(renderer.domElement);

// Resize
window.addEventListener('resize', resizeWindow, false);
function resizeWindow() {
    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    console.log(container.offsetWidth / container.offsetHeight);
}

// Loading info
manager.onProgress = function (url, itemsLoaded, itemsTotal) {
    console.log(itemsLoaded / itemsTotal * 100);
};

// HDR
/*const hdrUrl = 'hdr.hdr'
new RGBELoader().load(hdrUrl, texture => {
    const gen = new THREE.PMREMGenerator(renderer)
    const envMap = gen.fromEquirectangular(texture).texture
    scene.environment = envMap
    scene.background = envMap

    texture.dispose()
    gen.dispose()
}); */

scene.background = new THREE.Color(0x678492);

// Move camera
camera.position.z = 5;
camera.position.y = 3.5;

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.target = new THREE.Vector3(0, 0, 0);

// Axis
/*const axis = new THREE.AxesHelper(5);
scene.add(axis);

// Grid
const grid = new THREE.GridHelper(50, 50);
scene.add(grid); */

// Shadow
const aLight = new THREE.DirectionalLight(0xFFFFFF, Math.PI);

// Directional light
scene.add(aLight);
scene.add(aLight.target);
aLight.castShadow = true;
aLight.shadow.mapSize.width = 1024;
aLight.shadow.mapSize.height = 1024;
aLight.shadow.camera.near = 0.5;
aLight.shadow.camera.far = 10;
aLight.shadow.camera.top = -11
aLight.shadow.camera.right = 11
aLight.shadow.camera.left = -11
aLight.shadow.camera.bottom = 11
aLight.shadow.bias = -0.0047;
aLight.position.x = 4;
aLight.position.z = 3;
aLight.position.y = 2;

const ambientLight = new THREE.AmbientLight(0xFFFFFF, 2);
scene.add(ambientLight);

// light helper
//const aHelper = new THREE.DirectionalLightHelper(aLight, 3);
//aLight.add(aHelper);

// GLTF LOADER TEST
let wall1;
let wall2;
loader.load(
    // resource URL
    //'scene.gltf',
    'sceneglb.glb',
    function (gltf) {

        scene.add(gltf.scene);

        gltf.animations; // Array<THREE.AnimationClip>
        gltf.scene; // THREE.Group
        gltf.scenes; // Array<THREE.Group>
        gltf.cameras; // Array<THREE.Camera>
        gltf.asset; // Object

        gltf.scene.traverse(function (node) {

            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
                if (node.name.includes("ceiling")) {
                    console.log(node.name);
                    node.receiveShadow = false;
                } else if (node.name.includes("wall1")) {
                    wall1 = node;
                    console.log(wall1.name);
                } else if (node.name.includes("wall2")) {
                    wall2 = node;
                    console.log(wall2.name);
                }
            }

        });

    }
);
// THREE JS END

// CUSTOM BEGIN


var colors = document.getElementsByClassName("dot"); // array of color objects (visual)
var walls = document.getElementsByClassName("tarRadio"); // array of wall selectors
var buttons = document.getElementsByClassName("colorRadio"); // array of color radio buttons (functional)

// Store previous selections
var storeWall1;
var storeWall2;

var setWallColor = function () {

    var clrInput = this.style.backgroundColor; // Get object bg color

    // Parse bg color
    var clrs = clrInput.split(',');
    var r = parseInt(clrs[0].replace(/\D/g, ''));
    var g = parseInt(clrs[1].replace(/\D/g, ''));
    var b = parseInt(clrs[2].replace(/\D/g, ''));

    // Remap from 0-255 to 0-1
    var color = new THREE.Color(r / 255, g / 255, b / 255);

    var wallSelector = document.querySelector('input[name="wall"]:checked').value;
    if (wallSelector == 1) {
        wall1.material.color = color.convertSRGBToLinear();
    } else if (wallSelector == 2) {
        wall2.material.color = color.convertSRGBToLinear();
    }
}

// Set checked depending on tab
var selectWall = function () {
    var wall = this.value;
    console.log(this);
    if (wall == 1 && storeWall1 != null) {
        storeWall1.checked = true;
    } else if (wall == 2 && storeWall2 != null) {
        storeWall2.checked = true;
    }
}

// Store selected color for tab
var storeSelection = function () {
    var wallSelector = document.querySelector('input[name="wall"]:checked').value;
    if (wallSelector == 1) {
        console.log(this);
        storeWall1 = this;
    }
    else if (wallSelector == 2) {
        console.log(this);
        storeWall2 = this;
    }
}

for (var i = 0; i < colors.length; i++) {
    colors[i].addEventListener('click', setWallColor, false);
    colors[i].checked = false;  // uncheck all on load
}

for (var i = 0; i < walls.length; i++) {
    walls[i].addEventListener('click', selectWall, false);
}
walls[0].checked = true; // default check

for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', storeSelection, false);
    buttons[i].checked = false;
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();
}
animate();