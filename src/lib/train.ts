import {
    ArcRotateCamera,
    HemisphericLight,
    MeshBuilder,
    PhysicsAggregate,
    PhysicsShapeType,
    Scene,
    SceneLoader,
    Vector3,
} from '@babylonjs/core';

export async function createTrain(scene: Scene) {
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

    const physics = new PhysicsAggregate(
        train,
        PhysicsShapeType.MESH,
        { mass: 227000 },
        scene,
    );

    const camera = new ArcRotateCamera(
        'camera',
        10,
        10,
        10,
        new Vector3(10, 10, 10),
        scene,
    );

    camera.upperRadiusLimit = 350;
    camera.lowerRadiusLimit = 5;
    camera.attachControl();
    camera.setTarget(train);

    scene.executeWhenReady(() => {
        console.log('read');
        physics.body.applyImpulse(
            new Vector3(0, 2_270_00, 0),
            new Vector3(0, 1, 0),
        );
    });
}
