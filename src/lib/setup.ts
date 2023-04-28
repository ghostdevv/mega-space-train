import {
    Scene,
    Engine,
    Vector3,
    Color3,
    ArcRotateCamera,
    Color4,
    GlowLayer,
} from '@babylonjs/core';

export const setup = (canvas: HTMLCanvasElement) => {
    const engine = new Engine(canvas);
    const scene = new Scene(engine);

    const camera = new ArcRotateCamera(
        'camera',
        0,
        0,
        0,
        new Vector3(0, 0, 0),
        scene,
    );

    camera.setPosition(new Vector3(0, 0, -200));

    camera.upperRadiusLimit = 350;
    camera.lowerRadiusLimit = 5;

    engine.resize();
    camera.attachControl();

    scene.clearColor = new Color4(0, 0, 0, 0);
    scene.ambientColor = new Color3(50, 50, 50);

    const glow = new GlowLayer('glow', scene, {
        mainTextureSamples: 4, // anti-aliasing
        mainTextureFixedSize: 1024,
        blurKernelSize: 256,
    });

    glow.intensity = 2;

    return {
        engine,
        scene,
    };
};
