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
import { createCamera } from './lib/camera';

export async function run(canvas: HTMLCanvasElement) {
    const engine = new Engine(canvas);
    const scene = new Scene(engine);

    engine.resize();

    scene.clearColor = new Color4(0, 0, 0, 0);
    scene.ambientColor = new Color3(50, 50, 50);

    const hk = new HavokPlugin(false, await HavokPhysics());
    scene.enablePhysics(new Vector3(0, 0, 0), hk);

    const camera = await createCamera(scene);

    await createSkybox(scene, camera);
    await createStars(scene);
    await createTrain(scene, camera);

    console.log('Running');

    scene.render();
    engine.runRenderLoop(() => scene.render());
    window.addEventListener('resize', () => engine.resize());
}
