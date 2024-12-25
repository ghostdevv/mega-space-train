import { gui } from './gooey';
import {
    PhysicsCharacterController,
    PhysicsShapeType,
    PhysicsAggregate,
    HemisphericLight,
    MeshBuilder,
    Quaternion,
    type Scene,
    Vector3,
    type ArcRotateCamera,
    KeyboardEventTypes,
} from '@babylonjs/core';

const gState = gui.addText('state', 'drifting', {
    resettable: false,
    disabled: true,
});

export async function test(scene: Scene, camera: ArcRotateCamera) {
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

    // Space movement states
    type SpaceState = 'DRIFTING' | 'THRUSTING' | 'BRAKING';
    let state: SpaceState = 'DRIFTING';

    // Movement parameters
    const thrustPower = 5.0; // Main thrust power
    const brakingForce = 0.95; // How quickly we can slow down (1 = no braking, 0 = instant stop)
    const maxSpeed = 15.0; // Maximum speed cap

    const inputDirection = new Vector3(0, 0, 0);
    const forwardLocalSpace = new Vector3(0, 0, 1);
    const characterOrientation = Quaternion.Identity();

    gState.value = state;

    // Calculate desired velocity based on space movement
    const getDesiredVelocity = (
        deltaTime: number,
        currentVelocity: Vector3,
        inputDir: Vector3,
    ): Vector3 => {
        const nextState: SpaceState =
            inputDir.length() > 0
                ? 'THRUSTING'
                : currentVelocity.length() < 0.1
                  ? 'DRIFTING'
                  : 'BRAKING';

        if (nextState !== state) {
            state = nextState;
            gState.value = state;
        }

        const forwardWorld =
            forwardLocalSpace.applyRotationQuaternion(characterOrientation);
        let outputVelocity = currentVelocity.clone();

        switch (state) {
            case 'THRUSTING': {
                // Apply thrust in the input direction
                const thrustVector = inputDir
                    .scale(thrustPower * deltaTime)
                    .applyRotationQuaternion(characterOrientation);
                outputVelocity.addInPlace(thrustVector);

                // Cap maximum speed
                if (outputVelocity.length() > maxSpeed) {
                    outputVelocity.normalize().scaleInPlace(maxSpeed);
                }
                break;
            }

            case 'BRAKING': {
                // Gradually reduce velocity when no input is given
                outputVelocity.scaleInPlace(
                    Math.pow(brakingForce, deltaTime * 60),
                );
                break;
            }

            case 'DRIFTING': {
                // Maintain current velocity
                break;
            }
        }

        return outputVelocity;
    };

    // Update character position
    scene.onBeforeRenderObservable.add(() => {
        player.position.copyFrom(characterController.getPosition());
    });

    // Physics update
    scene.onAfterPhysicsObservable.add((_) => {
        if (!scene.deltaTime) return;
        const dt = scene.deltaTime / 1000.0;
        if (dt === 0) return;

        // Update character orientation based on camera
        Quaternion.FromEulerAnglesToRef(
            0,
            camera.rotation.y,
            0,
            characterOrientation,
        );

        const desiredLinearVelocity = getDesiredVelocity(
            dt,
            characterController.getVelocity(),
            inputDirection,
        );

        characterController.setVelocity(desiredLinearVelocity);
        characterController.integrate(
            dt,
            characterController.checkSupport(dt, new Vector3(0, -1, 0)),
            Vector3.Zero(),
        );
    });

    // Keyboard input handling
    scene.onKeyboardObservable.add((kbInfo) => {
        switch (kbInfo.type) {
            case KeyboardEventTypes.KEYDOWN:
                if (kbInfo.event.key == 'w' || kbInfo.event.key == 'ArrowUp') {
                    inputDirection.z = 1;
                } else if (
                    kbInfo.event.key == 's' ||
                    kbInfo.event.key == 'ArrowDown'
                ) {
                    inputDirection.z = -1;
                } else if (
                    kbInfo.event.key == 'a' ||
                    kbInfo.event.key == 'ArrowLeft'
                ) {
                    inputDirection.x = -1;
                } else if (
                    kbInfo.event.key == 'd' ||
                    kbInfo.event.key == 'ArrowRight'
                ) {
                    inputDirection.x = 1;
                }
                break;
            case KeyboardEventTypes.KEYUP:
                if (
                    kbInfo.event.key == 'w' ||
                    kbInfo.event.key == 's' ||
                    kbInfo.event.key == 'ArrowUp' ||
                    kbInfo.event.key == 'ArrowDown'
                ) {
                    inputDirection.z = 0;
                }
                if (
                    kbInfo.event.key == 'a' ||
                    kbInfo.event.key == 'd' ||
                    kbInfo.event.key == 'ArrowLeft' ||
                    kbInfo.event.key == 'ArrowRight'
                ) {
                    inputDirection.x = 0;
                }
                break;
        }
    });
}
