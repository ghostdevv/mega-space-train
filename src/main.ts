import './app.css';
import '@babylonjs/loaders';
import HavokPhysics from '@babylonjs/havok';
import { createSkybox } from './lib/skybox';
import { createStars } from './lib/stars';
import { setup } from './lib/setup';
import {
    Vector3,
    SceneLoader,
    HemisphericLight,
    HavokPlugin,
    MeshBuilder,
    PhysicsAggregate,
    PhysicsShapeType,
} from '@babylonjs/core';

const canvas = document.createElement('canvas')!;
document.body.appendChild(canvas);

const starCount = window.innerWidth < 900 ? 500 : 1000;
const resolution = window.innerWidth < 900 ? 1 : 4;

const { engine, scene, camera } = setup(canvas);

const { skybox } = createSkybox(scene, resolution);
const { starMesh } = createStars(scene, starCount);

scene.registerBeforeRender(() => {
    // starMesh.rotation.addInPlace(new Vector3(0, -0.0003, 0));
    // skybox.rotation.addInPlace(new Vector3(0, -0.00006, 0));
});

const hk = new HavokPlugin(false, await HavokPhysics());
scene.enablePhysics(new Vector3(0, 0, 0), hk);

const _light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);

engine.runRenderLoop(() => scene.render());
window.addEventListener('resize', () => engine.resize());

const sphere = MeshBuilder.CreateSphere(
    'sphere',
    { diameter: 2, segments: 32 },
    scene,
);

sphere.position.y = 10;
camera.setPosition(new Vector3(10, 10, 10));
camera.setTarget(sphere);

const ground = MeshBuilder.CreateGround(
    'ground',
    { width: 10, height: 10 },
    scene,
);

const sphereAggregate = new PhysicsAggregate(
    sphere,
    PhysicsShapeType.SPHERE,
    { mass: 1, restitution: 0.75 },
    scene,
);

const groundAggregate = new PhysicsAggregate(
    ground,
    PhysicsShapeType.BOX,
    { mass: 0 },
    scene,
);

// sphereAggregate.body.disablePreStep = false;
// sphereAggregate.transformNode.position.set(0, 10, 0);
// scene.onAfterRenderObservable.addOnce(() => {
//     sphereAggregate.body.disablePreStep = true;
// });
sphereAggregate.body.applyImpulse(new Vector3(0, -2, 0), new Vector3(0, 10, 0));

// const train = await SceneLoader.ImportMeshAsync(
//     '',
//     '/trains/',
//     'mega-space-train-one.glb',
// );

// SceneLoader.Append('/trains/', 'mega-space-train-one.glb', scene);
