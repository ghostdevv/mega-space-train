import {
    ArcRotateCamera,
    HemisphericLight,
    Scene,
    Vector3,
} from '@babylonjs/core';

export async function createTrain(scene: Scene) {
    const camera = new ArcRotateCamera(
        'camera',
        0,
        0,
        0,
        new Vector3(0, 0, 0),
        scene,
    );

    camera.upperRadiusLimit = 350;
    camera.lowerRadiusLimit = 5;
    camera.attachControl();
    camera.setPosition(new Vector3(0, 0, 0));

    new HemisphericLight('light', new Vector3(0, 1, 0), scene);

    // const train = await SceneLoader.ImportMeshAsync(
    //     '',
    //     '/trains/',
    //     'mega-space-train-one.glb',
    // );

    // SceneLoader.Append('/trains/', 'mega-space-train-one.glb', scene);
}
