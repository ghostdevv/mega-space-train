import { Vector3, SceneLoader, HemisphericLight } from '@babylonjs/core';
import { createSkybox } from './lib/skybox';
import { createStars } from './lib/stars';
import { setup } from './lib/setup';
import '@babylonjs/loaders';
import './app.css';

const canvas = document.createElement('canvas')!;
document.body.appendChild(canvas);

const starCount = window.innerWidth < 900 ? 500 : 1000;
const resolution = window.innerWidth < 900 ? 1 : 4;

const { engine, scene } = setup(canvas);

const { skybox } = createSkybox(scene, resolution);
const { starMesh } = createStars(scene, starCount);

const _light = new HemisphericLight('light boi', new Vector3(0, 1, 0), scene);

scene.registerBeforeRender(() => {
    starMesh.rotation.addInPlace(new Vector3(0, -0.0003, 0));
    skybox.rotation.addInPlace(new Vector3(0, -0.00006, 0));
});

engine.runRenderLoop(() => scene.render());
window.addEventListener('resize', () => engine.resize());

SceneLoader.Append('/trains/', 'mega-space-train-one.glb', scene, (scene) => {
    console.log('hello then');
});
