import '@babylonjs/loaders';
import { createSkybox } from './lib/skybox';
import { createTrain } from './lib/train';
import { createStars } from './lib/stars';
import { setup } from './lib/setup';

export async function run(canvas: HTMLCanvasElement) {
    const starCount = window.innerWidth < 900 ? 500 : 1000;
    const resolution = window.innerWidth < 900 ? 1 : 4;

    const { engine, scene } = await setup(canvas);

    await createSkybox(scene, resolution);
    await createStars(scene, starCount);
    await createTrain(scene);

    engine.runRenderLoop(() => scene.render());
    window.addEventListener('resize', () => engine.resize());
}
