import {
    SolidParticleSystem,
    StandardMaterial,
    MeshBuilder,
    type Scene,
    GlowLayer,
    Vector3,
    Color3,
    Scalar,
} from '@babylonjs/core';

export async function createStars(scene: Scene) {
    const glow = new GlowLayer('glow', scene, {
        mainTextureSamples: 4, // anti-aliasing
        mainTextureFixedSize: 1024,
        blurKernelSize: 256,
    });

    glow.intensity = 2;

    const particles = new SolidParticleSystem('Stars', scene);
    const star = MeshBuilder.CreateSphere('sphere', {});

    particles.addShape(star, window.innerWidth < 900 ? 500 : 1000);
    star.dispose();

    const material = new StandardMaterial('starMaterial', scene);
    const starMesh = particles.buildMesh();
    particles.isAlwaysVisible = true;

    material.emissiveColor = new Color3(0.8, 0.8, 0.8);

    starMesh.material = material;

    const range = () => Scalar.RandomRange(-300, 300);

    particles.initParticles = () => {
        for (let p = 0; p < particles.nbParticles; p++) {
            const particle = particles.particles[p];

            // Place particles at random positions with a cube
            particle.position.x = range();
            particle.position.y = range();
            particle.position.z = range();

            if (particle.color && Scalar.RandomRange(0, 10) > 8) {
                particle.color.r = 33 / 255;
                particle.color.g = 96 / 255;
                particle.color.b = 236 / 255;
            }

            if (Scalar.RandomRange(0, 10) > 9) {
                particle.scale = new Vector3(3.5, 3.5, 3.5);
            }
        }
    };

    particles.initParticles();
    particles.setParticles();
}
