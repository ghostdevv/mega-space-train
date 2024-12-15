import {
    type ArcRotateCamera,
    HemisphericLight,
    PhysicsAggregate,
    PhysicsShapeType,
    MeshBuilder,
    SceneLoader,
    Vector3,
    Scene,
} from '@babylonjs/core';

export async function createTrain(scene: Scene, camera: ArcRotateCamera) {
    new HemisphericLight('light', new Vector3(0, 0, 0), scene);

    // const trainGLTF = await SceneLoader.ImportMeshAsync(
    //     '',
    //     '/trains/',
    //     'mega-space-train-one.glb',
    // );

    // const [train] = trainGLTF.meshes;

    const train = MeshBuilder.CreateBox(
        'train',
        {
            width: 1,
            height: 1,
            depth: 3,
        },
        scene,
    );

    train.position.set(0, 0, 0);
    camera.setTarget(train);

    const physics = new PhysicsAggregate(
        train,
        PhysicsShapeType.MESH,
        { mass: 227000 },
        scene,
    );

    scene.executeWhenReady(() => {
        console.log('read');
        physics.body.applyImpulse(
            new Vector3(0, 2_270_00, 0),
            new Vector3(0, 1, 0),
        );
    });
}
