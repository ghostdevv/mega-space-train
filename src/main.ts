import '@babylonjs/loaders/glTF';
import HavokPhysics from '@babylonjs/havok';
import { createSkybox } from './lib/skybox';
import { createTrain } from './lib/train';
import { createStars } from './lib/stars';
import {
    HavokPlugin,
    Vector3,
    Color3,
    Color4,
    Engine,
    Scene,
} from '@babylonjs/core';

export async function run(canvas: HTMLCanvasElement) {
    const starCount = window.innerWidth < 900 ? 500 : 1000;
    const resolution = window.innerWidth < 900 ? 1 : 4;

    const engine = new Engine(canvas);
    const scene = new Scene(engine);

    engine.resize();

    scene.clearColor = new Color4(0, 0, 0, 0);
    scene.ambientColor = new Color3(50, 50, 50);

    const hk = new HavokPlugin(false, await HavokPhysics());
    scene.enablePhysics(new Vector3(0, 0, 0), hk);

    await createSkybox(scene, resolution);
    await createStars(scene, starCount);
    await createTrain(scene);

    engine.runRenderLoop(() => scene.render());
    window.addEventListener('resize', () => engine.resize());
}
