import { gui } from './gooey';
import {
    PhysicsCharacterController,
    type CharacterSurfaceInfo,
    CharacterSupportedState,
    type ArcRotateCamera,
    KeyboardEventTypes,
    PointerEventTypes,
    PhysicsShapeType,
    PhysicsAggregate,
    HemisphericLight,
    PhysicsShape,
    MeshBuilder,
    Quaternion,
    type Scene,
    Vector3,
} from '@babylonjs/core';

const gState = gui.addText('state', 'unset', {
    resettable: false,
    disabled: true,
});

export async function test(scene: Scene, camera: ArcRotateCamera) {
    // const ground = MeshBuilder.CreateGround('g', { width: 50, height: 50 }, scene);
    // new PhysicsAggregate(ground, PhysicsShapeType.BOX, { mass: 0 }, scene);
    new HemisphericLight('light', new Vector3(0, 1, 0), scene);

    const player = MeshBuilder.CreateCapsule(
        'CharacterDisplay',
        { height: 1.8, radius: 0.6 },
        scene,
    );

    camera.setTarget(player);

    const playerPhysics = new PhysicsAggregate(
        player,
        PhysicsShapeType.CAPSULE,
        { mass: 1 },
        scene,
    );

    const characterController = new PhysicsCharacterController(
        Vector3.Zero(),
        playerPhysics,
        scene,
    );

    let state: 'IN_AIR' | 'ON_GROUND' | 'START_JUMP' = 'IN_AIR';
    let wantJump = false;
    const inAirSpeed = 8.0;
    const onGroundSpeed = 10.0;
    const jumpHeight = 1.5;
    const inputDirection = new Vector3(0, 0, 0);
    const forwardLocalSpace = new Vector3(0, 0, 1);
    const characterOrientation = Quaternion.Identity();
    const characterGravity = new Vector3(0, 0, 0);

    gState.value = state;

    const getNextState = (supportInfo: CharacterSurfaceInfo) => {
        switch (state) {
            case 'IN_AIR':
                return supportInfo.supportedState ==
                    CharacterSupportedState.SUPPORTED
                    ? 'ON_GROUND'
                    : 'IN_AIR';

            case 'ON_GROUND':
                return supportInfo.supportedState !=
                    CharacterSupportedState.SUPPORTED
                    ? 'IN_AIR'
                    : wantJump
                      ? 'START_JUMP'
                      : 'ON_GROUND';

            case 'START_JUMP':
                return 'IN_AIR';
        }
    };

    // From aiming direction and state, compute a desired velocity
    // That velocity depends on current state (in air, on ground, jumping, ...) and surface properties
    const getDesiredVelocity = (
        deltaTime: number,
        supportInfo: CharacterSurfaceInfo,
        characterOrientation: Quaternion,
        currentVelocity: Vector3,
    ) => {
        const nextState = getNextState(supportInfo);
        if (nextState != state) {
            state = nextState;
            gState.value = nextState;
        }

        const upWorld = characterGravity.normalizeToNew();
        upWorld.scaleInPlace(-1.0);

        const forwardWorld =
            forwardLocalSpace.applyRotationQuaternion(characterOrientation);

        switch (state) {
            case 'IN_AIR': {
                const desiredVelocity = inputDirection
                    .scale(inAirSpeed)
                    .applyRotationQuaternion(characterOrientation);
                const outputVelocity = characterController.calculateMovement(
                    deltaTime,
                    forwardWorld,
                    upWorld,
                    currentVelocity,
                    Vector3.ZeroReadOnly,
                    desiredVelocity,
                    upWorld,
                );
                // Restore to original vertical component
                outputVelocity.addInPlace(
                    upWorld.scale(-outputVelocity.dot(upWorld)),
                );
                outputVelocity.addInPlace(
                    upWorld.scale(currentVelocity.dot(upWorld)),
                );
                // Add gravity
                outputVelocity.addInPlace(characterGravity.scale(deltaTime));
                return outputVelocity;
            }

            case 'ON_GROUND': {
                // Move character relative to the surface we're standing on
                // Correct input velocity to apply instantly any changes in the velocity of the standing surface and this way
                // avoid artifacts caused by filtering of the output velocity when standing on moving objects.
                const desiredVelocity = inputDirection
                    .scale(onGroundSpeed)
                    .applyRotationQuaternion(characterOrientation);

                let outputVelocity = characterController.calculateMovement(
                    deltaTime,
                    forwardWorld,
                    supportInfo.averageSurfaceNormal,
                    currentVelocity,
                    supportInfo.averageSurfaceVelocity,
                    desiredVelocity,
                    upWorld,
                );

                // Horizontal projection
                outputVelocity.subtractInPlace(
                    supportInfo.averageSurfaceVelocity,
                );
                const inv1k = 1e-3;
                if (outputVelocity.dot(upWorld) > inv1k) {
                    const velLen = outputVelocity.length();
                    outputVelocity.normalizeFromLength(velLen);

                    // Get the desired length in the horizontal direction
                    const horizLen =
                        velLen / supportInfo.averageSurfaceNormal.dot(upWorld);

                    // Re project the velocity onto the horizontal plane
                    const c =
                        supportInfo.averageSurfaceNormal.cross(outputVelocity);
                    outputVelocity = c.cross(upWorld);
                    outputVelocity.scaleInPlace(horizLen);
                }
                outputVelocity.addInPlace(supportInfo.averageSurfaceVelocity);
                return outputVelocity;
            }

            case 'START_JUMP': {
                const u = Math.sqrt(2 * characterGravity.length() * jumpHeight);
                const curRelVel = currentVelocity.dot(upWorld);
                return currentVelocity.add(upWorld.scale(u - curRelVel));
            }
        }
    };

    // Display tick update: compute new camera position/target, update the capsule for the character display
    scene.onBeforeRenderObservable.add(() => {
        player.position.copyFrom(characterController.getPosition());
    });

    // After physics update, compute and set new velocity, update the character controller state
    scene.onAfterPhysicsObservable.add((_) => {
        if (scene.deltaTime == undefined) return;
        const dt = scene.deltaTime / 1000.0;
        if (dt == 0) return;

        const down = new Vector3(0, -1, 0);
        const support = characterController.checkSupport(dt, down);

        Quaternion.FromEulerAnglesToRef(
            0,
            camera.rotation.y,
            0,
            characterOrientation,
        );

        const desiredLinearVelocity = getDesiredVelocity(
            dt,
            support,
            characterOrientation,
            characterController.getVelocity(),
        );

        characterController.setVelocity(desiredLinearVelocity);
        characterController.integrate(dt, support, characterGravity);
    });

    // Input to direction
    // from keys down/up, update the Vector3 inputDirection to match the intended direction. Jump with space
    // scene.onKeyboardObservable.add((kbInfo) => {
    //     switch (kbInfo.type) {
    //         case KeyboardEventTypes.KEYDOWN:
    //             if (kbInfo.event.key == 'w' || kbInfo.event.key == 'ArrowUp') {
    //                 inputDirection.z = 1;
    //             } else if (
    //                 kbInfo.event.key == 's' ||
    //                 kbInfo.event.key == 'ArrowDown'
    //             ) {
    //                 inputDirection.z = -1;
    //             } else if (
    //                 kbInfo.event.key == 'a' ||
    //                 kbInfo.event.key == 'ArrowLeft'
    //             ) {
    //                 inputDirection.x = -1;
    //             } else if (
    //                 kbInfo.event.key == 'd' ||
    //                 kbInfo.event.key == 'ArrowRight'
    //             ) {
    //                 inputDirection.x = 1;
    //             } else if (kbInfo.event.key == ' ') {
    //                 wantJump = true;
    //             }
    //             break;
    //         case KeyboardEventTypes.KEYUP:
    //             if (
    //                 kbInfo.event.key == 'w' ||
    //                 kbInfo.event.key == 's' ||
    //                 kbInfo.event.key == 'ArrowUp' ||
    //                 kbInfo.event.key == 'ArrowDown'
    //             ) {
    //                 inputDirection.z = 0;
    //             }
    //             if (
    //                 kbInfo.event.key == 'a' ||
    //                 kbInfo.event.key == 'd' ||
    //                 kbInfo.event.key == 'ArrowLeft' ||
    //                 kbInfo.event.key == 'ArrowRight'
    //             ) {
    //                 inputDirection.x = 0;
    //             } else if (kbInfo.event.key == ' ') {
    //                 wantJump = false;
    //             }
    //             break;
    //     }
    // });
}
