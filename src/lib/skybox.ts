import { MeshBuilder, StandardMaterial, CubeTexture } from '@babylonjs/core';
import type { Scene } from '@babylonjs/core';

export async function createSkybox(scene: Scene) {
    const skybox = MeshBuilder.CreateBox('sky-box', { size: 1000 }, scene);
    const skyboxMaterial = new StandardMaterial('sky-box', scene);

    skyboxMaterial.backFaceCulling = false;

    skyboxMaterial.reflectionTexture = new CubeTexture(
        `/skybox${window.innerWidth < 900 ? 1 : 4}k/sb`,
        scene,
    );

    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;

    return {
        skybox,
    };
}
