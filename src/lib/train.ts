import {
    PhysicsCharacterController,
    loadAssetContainerAsync,
    type ArcRotateCamera,
    PhysicsAggregate,
    PhysicsShapeType,
    TransformNode,
    type Scene,
    Vector3,
} from '@babylonjs/core';

export async function createTrain(scene: Scene, camera: ArcRotateCamera) {
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

    const controller = new PhysicsCharacterController(
        new Vector3(0, 0, 0),
        physics,
        scene,
    );

    // scene.executeWhenReady(() => {
    //     physics.body.applyImpulse(
    //         new Vector3(2_270_00, 0, 0),
    //         new Vector3(1, 0, 0),
    //     );
    // });
}
