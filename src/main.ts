import './app.css';
import '@babylonjs/core/Debug/debugLayer';
import '@babylonjs/inspector';
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

const { engine, scene } = setup(canvas);

const { skybox } = createSkybox(scene, resolution);
const { starMesh } = createStars(scene, starCount);

// scene.debugLayer.show();

scene.registerBeforeRender(() => {
    // starMesh.rotation.addInPlace(new Vector3(0, -0.0003, 0));
    // skybox.rotation.addInPlace(new Vector3(0, -0.00006, 0));
});

const hk = new HavokPlugin(false, await HavokPhysics());
scene.enablePhysics(new Vector3(0, -9.8, 0), hk);

const _light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);

engine.runRenderLoop(() => scene.render());
window.addEventListener('resize', () => engine.resize());

const sphere = MeshBuilder.CreateSphere(
    'sphere',
    { diameter: 2, segments: 32 },
    scene,
);

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

// setTimeout(async () => {
//     await import('@babylonjs/inspector');
// });

// const train = await SceneLoader.ImportMeshAsync(
//     '',
//     '/trains/',
//     'mega-space-train-one.glb',
// );

// SceneLoader.Append('/trains/', 'mega-space-train-one.glb', scene);
