import { MeshBuilder, StandardMaterial, CubeTexture } from '@babylonjs/core';
import type { Scene } from '@babylonjs/core';

export const createSkybox = (scene: Scene, resolution: number) => {
    const skybox = MeshBuilder.CreateBox('skyBox', { size: 1000 }, scene);
    const skyboxMaterial = new StandardMaterial('skyBox', scene);

    skyboxMaterial.backFaceCulling = false;

    skyboxMaterial.reflectionTexture = new CubeTexture(
        `/skybox${resolution}k/sb`,
        scene,
    );

    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;

    return {
        skybox,
    };
};
