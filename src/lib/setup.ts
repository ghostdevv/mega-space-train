import HavokPhysics from '@babylonjs/havok';
import {
    Scene,
    Engine,
    Vector3,
    Color3,
    ArcRotateCamera,
    Color4,
    GlowLayer,
    HavokPlugin,
} from '@babylonjs/core';

export async function setup(canvas: HTMLCanvasElement) {
    const engine = new Engine(canvas);
    const scene = new Scene(engine);

    engine.resize();

    scene.clearColor = new Color4(0, 0, 0, 0);
    scene.ambientColor = new Color3(50, 50, 50);

    const glow = new GlowLayer('glow', scene, {
        mainTextureSamples: 4, // anti-aliasing
        mainTextureFixedSize: 1024,
        blurKernelSize: 256,
    });

    glow.intensity = 2;

    const hk = new HavokPlugin(false, await HavokPhysics());
    scene.enablePhysics(new Vector3(0, 0, 0), hk);

    return {
        engine,
        scene,
    };
}
