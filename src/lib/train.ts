import {
    loadAssetContainerAsync,
    type ArcRotateCamera,
    HemisphericLight,
    PhysicsAggregate,
    PhysicsShapeType,
    TransformNode,
    Vector3,
    Scene,
} from '@babylonjs/core';

export async function createTrain(scene: Scene, camera: ArcRotateCamera) {
    new HemisphericLight('light', new Vector3(0, 0, 0), scene);

    const trainGLTF = await loadAssetContainerAsync(
        '/trains/steam-train.glb',
        scene,
    );

    const train = new TransformNode('train');
    train.position.set(0, 0, 0);
    camera.setTarget(train);

    for (const mesh of trainGLTF.meshes) {
        scene.addMesh(mesh);
        mesh.parent = train;
    }

    scene.addTransformNode(train);

    const physics = new PhysicsAggregate(
        train,
        PhysicsShapeType.BOX,
        { mass: 227000 },
        scene,
    );

    // scene.executeWhenReady(() => {
    //     physics.body.applyImpulse(
    //         new Vector3(2_270_00, 0, 0),
    //         new Vector3(1, 0, 0),
    //     );
    // });
}
