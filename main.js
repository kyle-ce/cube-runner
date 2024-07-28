import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

class Box extends THREE.Mesh {
  constructor({
    width,
    height,
    depth,
    color = "#00ff00",
    velocity = {
      x: 0,
      y: 0,
      z: 0,
    },
    position = {
      x: 0,
      y: 0,
      z: 0,
    },
  }) {
    super(
      new THREE.BoxGeometry(width, height, depth),
      new THREE.MeshLambertMaterial({ color })
    );
    this.width = width;
    this.height = height;
    this.depth = depth;

    this.position.set(position.x, position.y, position.z);

    this.bottom = this.position.y - this.height / 2;
    this.top = this.position.y + this.height / 2;

    this.velocity = velocity;
    this.gravity = -0.002;
  }
  update(ground) {
    this.bottom = this.position.y - this.height / 2;
    this.top = this.position.y + this.height / 2;
    this.applyGravity();
  }
  applyGravity() {
    this.velocity.y += this.gravity;

    // This is where we hit the ground
    if (this.bottom + this.velocity.y <= ground.top) {
      this.velocity.y *= 0.8;
      this.velocity.y = -this.velocity.y;
    } else this.position.y += this.velocity.y;
  }
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
const cube = new Box({
  width: 1,
  height: 1,
  depth: 1,
  velocity: { x: 0, y: -0.01, z: 0 },
});
cube.castShadow = true;
scene.add(cube);

const ground = new Box({
  width: 5,
  height: 0.5,
  depth: 10,
  color: "#0000ff",
  position: {
    x: 0,
    y: -2,
    z: 0,
  },
});

ground.receiveShadow = true;
scene.add(ground);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.y = 3;
light.position.z = 2;
light.castShadow = true;
scene.add(light);

camera.position.z = 5;

console.log("cube bottom: ", cube.position.y - cube.height);
console.log("ground top:", ground.position.y + ground.height);

function animate() {
  cube.update(ground);
  //   cube.rotation.x += 0.01;
  //   cube.rotation.y += 0.005;
  //   cube.position.y += -0.01;

  renderer.render(scene, camera);
}
