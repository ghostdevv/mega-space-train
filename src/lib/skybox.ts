import {
    type ArcRotateCamera,
    StandardMaterial,
    MeshBuilder,
    CubeTexture,
    type Scene,
} from '@babylonjs/core';

export async function createSkybox(scene: Scene, camera: ArcRotateCamera) {
    const skyboxMaterial = new StandardMaterial('sky-box', scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.disableLighting = true;
    skyboxMaterial.reflectionTexture = new CubeTexture(
        `/skybox${window.innerWidth < 900 ? 1 : 4}k/sb`,
        scene,
    );

    const skybox = MeshBuilder.CreateBox('sky-box', { size: 1000 }, scene);
    skybox.material = skyboxMaterial;

    scene.registerBeforeRender(() => {
        skybox.position = camera.position;
    });
}
