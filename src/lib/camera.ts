import { ArcRotateCamera, type Scene, Vector3 } from '@babylonjs/core';

export async function createCamera(scene: Scene) {
    const camera = new ArcRotateCamera(
        'camera',
        10,
        10,
        10,
        new Vector3(10, 10, 10),
        scene,
    );

    camera.maxZ = 10_000;
    camera.upperRadiusLimit = 350;
    camera.lowerRadiusLimit = 5;
    camera.attachControl();

    return camera;
}
