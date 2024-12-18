import {
    Scene,
    MeshStandardMaterial,
    Mesh,
    BoxGeometry,
    SphereGeometry,
    PerspectiveCamera,
    SRGBColorSpace,
    WebGLRenderer,
    TextureLoader,
    LinearToneMapping, MeshPhysicalMaterial,
} from 'three';
import {WebGLPathTracer, GradientEquirectTexture} from 'three-gpu-pathtracer';
import example1 from "./lady.png";
import example2 from "./jawlensky.jpg";
import example3 from "./mackintosh.jpg";
import gradient from "./gradient.png";

// If the value is changing for the input image, assume that the user is wanting to use that image.
document.getElementById('inputImage').addEventListener('change', () => {
    document.getElementById('custom').click();
});

document.getElementById('submit')
    .addEventListener('click', () => {
        // Get form details.
        const sides = Number.parseFloat(document.getElementById('sides').value);
        const roughness = Number.parseFloat(document.getElementById('roughness').value);
        const metalness = Number.parseFloat(document.getElementById('metalness').value);
        const color = document.getElementById('color').value;
        const length = Number.parseFloat(document.getElementById('length').value);
        const bounces = Number.parseInt(document.getElementById('bounces').value);
        const samples = Number.parseInt(document.getElementById('samples').value);
        const size = Number.parseInt(document.getElementById('size').value);

        const imageOption = document.getElementById('image').elements['image'].value;
        let image = gradient;
        switch (imageOption) {
            case 'example1':
                image = example1;
                break;
            case 'example2':
                image = example2;
                break;
            case 'example3':
                image = example3;
                break;
            case 'custom':
                let inputImage = document.getElementById('inputImage').files[0];
                if (inputImage !== undefined) {
                    image = URL.createObjectURL(inputImage);
                }
                break;
        }

        // Initialise scene, renderer, camera, etc.
        const renderer = new WebGLRenderer({
            antialias: true,
            preserveDrawingBuffer: true
        });
        const camera = new PerspectiveCamera();
        const scene = new Scene();
        const pathTracer = new WebGLPathTracer(renderer);
        const elementContainer = document.createElement('div');
        elementContainer.insertAdjacentElement('afterbegin', renderer.domElement)
        const element = document.getElementById('gallery').insertAdjacentElement('afterbegin', elementContainer);
        setTimeout(function () {
            element.scrollIntoView();
        }, 10);
        element.dataset.totalSamples = samples;

        const ballRadius = 3;
        const addBall = false;
        const ball = new Mesh(
            new SphereGeometry(ballRadius, 60, 60),
            new MeshPhysicalMaterial({
                color: "#FFF",
                transparent: true,
                emissive: '#000000',
                emissiveIntensity: 1,
                roughness: 0,
                metalness: 0,
                ior: 1.52, // Window glass
                transmission: 1.0,
                thinFilm: false,
                attenuationColor: '#ffffff',
                attenuationDistance: 1,
                opacity: 1.0,
                clearcoat: 0.0,
                clearcoatRoughness: 0.0,
                sheenColor: '#000000',
                sheenRoughness: 0.0,
                iridescence: 0.0,
                iridescenceIOR: 0,
                iridescenceThickness: 1000,
                specularColor: '#FFFFFF',
                specularIntensity: 0.0, // Changing this to 1 makes it more visible
                matte: false,
                flatShading: false,
                castShadow: true,
            })
        );
        ball.translateX(0)
        ball.translateZ(ballRadius)
        ball.translateY(0)
        if (addBall) {
            scene.add(ball);
        }

        // Arrange the mirrors.
        for (let i = 0; i < sides; i++) {
            const panel = new Mesh(
                new BoxGeometry(3.43, 0.02, length),
                new MeshStandardMaterial({
                    color,
                    roughness,
                    metalness,
                })
            );
            panel.translateY(Math.cos(i / sides * Math.PI * 2))
            panel.translateX(Math.sin(i / sides * Math.PI * 2))
            panel.translateZ(-length / 2);
            panel.rotateZ((-i) / sides * Math.PI * 2)
            scene.add(panel);

            const casing = new Mesh(
                new BoxGeometry(3.48, 0.001, length),
                new MeshStandardMaterial({
                    color: "#FF0000",
                    roughness: 1,
                    metalness,
                })
            );
            casing.translateY(Math.cos(i / sides * Math.PI * 2)*1.011)
            casing.translateX(Math.sin(i / sides * Math.PI * 2)*1.011)
            casing.translateZ(-length / 2);
            casing.rotateZ((-i) / sides * Math.PI * 2)
            scene.add(casing);

            // if (addBall) {
            //     const outerCasing = new Mesh(
            //         new BoxGeometry(ballRadius * 2 * Math.sqrt(3), 0.001, length + ballRadius),
            //         new MeshStandardMaterial({
            //             color: "#00FF00",
            //             roughness: 1,
            //             metalness,
            //         })
            //     );
            //     outerCasing.translateY(Math.cos(i / sides * Math.PI * 2) * ballRadius)
            //     outerCasing.translateX(Math.sin(i / sides * Math.PI * 2) * ballRadius)
            //     outerCasing.translateZ(-(length + ballRadius) / 2);
            //     outerCasing.rotateZ((-i) / sides * Math.PI * 2)
            //     scene.add(outerCasing);
            // }
        }

        function startRenderer(scene) {
            // set the environment map
            const texture = new GradientEquirectTexture();
            texture.bottomColor.set(0xffffff);
            texture.bottomColor.set(0xffffff);
            texture.update();
            scene.environment = texture;
            scene.background = texture;

            camera.position.set(0, 0, -length);
            camera.lookAt(0, 0, 0);

            // camera.position.set(4, length, -length*3);
            // camera.lookAt(0, 0, 0);

            camera.position.set(5, 2, -length*1.5);
            camera.lookAt(0, 0, 0);

            renderer.toneMapping = LinearToneMapping;


            pathTracer.bounces = bounces + 1
            pathTracer.renderScale = 1 / window.devicePixelRatio;
            pathTracer.tiles.setScalar(3);
            pathTracer.setScene(scene, camera);

            const w = size;
            const h = size;

            renderer.setSize(w, h);
            renderer.setPixelRatio(window.devicePixelRatio);

            camera.aspect = w / h;
            camera.updateProjectionMatrix();

            pathTracer.setScene(scene, camera);

            animate();
        }

        new TextureLoader().load(image, (texture) => {
            texture.colorSpace = SRGBColorSpace;
            const mat = new MeshPhysicalMaterial({
                map: texture,
                // transparent: true,
                // opacity: 1,
                // transmission: 1,
                roughness: 1,
                metalness: 0,
            });
            const geom = new BoxGeometry(100, 0.01, 100);
            const mesh = new Mesh(geom, mat);
            mesh.rotateX(-Math.PI / 2);
            mesh.rotateZ(-Math.PI);
            mesh.translateY(100);
            mesh.translateZ(0);
            scene.add(mesh);

            const backdropMat = new MeshPhysicalMaterial({
                color: '#000',
                roughness: 1,
                metalness: 0,
            });
            const backdropGeom = new BoxGeometry(200, 0.01, 200);
            const backdrop = new Mesh(backdropGeom, backdropMat);
            backdrop.rotateX(-Math.PI / 2);
            backdrop.rotateZ(-Math.PI);
            backdrop.translateY(101);
            scene.add(backdrop);

            startRenderer(scene);
        }, () => {
        });

        let sampleCount = 0;

        function animate() {
            element.dataset.samples = sampleCount.toString();
            sampleCount++;
            if (sampleCount > samples) {
                delete element.dataset.samples;
                delete element.dataset.totalSamples;
                const canvas = element.getElementsByTagName('canvas')[0];
                canvas.addEventListener('click', () => {
                    const image = canvas
                        .toDataURL('image/jpeg', 1.0);
                    const a = document.createElement('a');
                    a.href = image;
                    a.download = 'kaleidoscope.jpg';
                    a.click();
                })
                return;
            }
            requestAnimationFrame(animate);
            pathTracer.renderSample();
        }
    })
