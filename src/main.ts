import '@babylonjs/loaders/glTF';
import { HavokPlugin, Vector3, Engine, Scene } from '@babylonjs/core';
import { createCamera } from './lib/camera';
import HavokPhysics from '@babylonjs/havok';
import { createSkybox } from './lib/skybox';
import { createTrain } from './lib/train';
import { createStars } from './lib/stars';

export async function run(canvas: HTMLCanvasElement) {
    const engine = new Engine(canvas);
    engine.resize();

    const scene = new Scene(engine);
    scene.createDefaultEnvironment({
        createGround: false,
        createSkybox: false,
    });

    const camera = await createCamera(scene);

    const hk = new HavokPlugin(false, await HavokPhysics());
    scene.enablePhysics(new Vector3(0, 0, 0), hk);

    await createSkybox(scene, camera);
    await createStars(scene);
    await createTrain(scene, camera);

    engine.runRenderLoop(() => scene.render());
    window.addEventListener('resize', () => engine.resize());
}
