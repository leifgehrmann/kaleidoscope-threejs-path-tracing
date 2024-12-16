import {
    Scene,
    MeshStandardMaterial,
    Mesh,
    BoxGeometry,
    PerspectiveCamera,
    SRGBColorSpace,
    WebGLRenderer,
    TextureLoader,
    LinearToneMapping, MeshPhysicalMaterial,
} from 'three';
import {WebGLPathTracer, GradientEquirectTexture} from 'three-gpu-pathtracer';
import example1 from "./traquair.jpg";
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

        // Arrange the mirrors.
        // for (let i = 0; i < 1; i++) {
        //     const panel = new Mesh(
        //         new BoxGeometry(4.5, 0.02, 4.5),
        //         new MeshStandardMaterial({
        //             color,
        //             roughness,
        //             metalness,
        //         })
        //     );
        //     const distance = 1.25;
        //     const thetaOffset = 0;
        //     panel.translateY(Math.cos(thetaOffset + i / sides * Math.PI) * distance)
        //     panel.translateX(Math.sin(thetaOffset + i / sides * Math.PI) * distance)
        //     panel.translateZ(-4.5 / 2 - 0.02);
        //     panel.rotateZ(thetaOffset + (-i) / sides * Math.PI * 2)
        //     scene.add(panel);
        // }

        // Arrange the mirrors.
        // const angles = [-Math.PI / 10, Math.PI / 10]
        // for (let i = 0; i < 2; i++) {
        //     const panel = new Mesh(
        //         new BoxGeometry(4.5, 0.02, 4.5),
        //         new MeshStandardMaterial({
        //             color,
        //             roughness,
        //             metalness,
        //         })
        //     );
        //     const distance = 1.25;
        //     const thetaOffset = 0;
        //     panel.translateY(-0.5)
        //     panel.translateX(Math.sin(thetaOffset + angles[i]) * 4.58 / 2)
        //     panel.translateZ(-4.5 / 2 - 0.02);
        //     panel.rotateZ(thetaOffset + angles[i] + Math.PI / 2)
        //     scene.add(panel);
        // }

        // Arrange the mirrors.
        for (let i = 0; i < 3; i++) {
            const sideLength = 3.4;
            const height = 4.5
            const panel = new Mesh(
                new BoxGeometry(sideLength, 0.02, height),
                new MeshStandardMaterial({
                    color,
                    roughness,
                    metalness,
                })
            );
            const distance = sideLength * (1.303 / 4.5);
            const thetaOffset = 0.2;
            panel.translateY(Math.cos(thetaOffset + i / sides * Math.PI * 2) * distance)
            panel.translateX(Math.sin(thetaOffset + i / sides * Math.PI * 2) * distance)
            panel.translateZ(-height / 2 - 0.02);
            panel.rotateZ(-thetaOffset + (-i) / sides * Math.PI * 2)
            scene.add(panel);

            const outerPanel = new Mesh(
                new BoxGeometry(sideLength + 0.02, 0.002, height),
                new MeshStandardMaterial({
                    color: '#FF0000',
                    roughness: 0.4,
                    metalness: 0.5
                })
            );
            outerPanel.translateY(Math.cos(thetaOffset + i / sides * Math.PI * 2) * distance*1.01)
            outerPanel.translateX(Math.sin(thetaOffset + i / sides * Math.PI * 2) * distance*1.01)
            outerPanel.translateZ(-height / 2 - 0.02);
            outerPanel.rotateZ(-thetaOffset + (-i) / sides * Math.PI * 2)
            scene.add(outerPanel);
        }

        function startRenderer(scene) {
            // set the environment map
            const texture = new GradientEquirectTexture();
            texture.topColor.set(0xFFFFFF);
            texture.bottomColor.set(0xFFFFFF);
            texture.update();
            scene.environment = texture;
            scene.background = texture;

            // camera.position.set(0, -4, -length);
            // camera.lookAt(0, 2, 0);

            camera.position.set(0, -6, -length / 1.2);
            camera.lookAt(0, 2, 0);

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

        const light= false
        const backdrop = new Mesh(
            new BoxGeometry(1000, 0.01, 1000),
            new MeshStandardMaterial({
                color: light ? "#F8F8F8" : "#EEEEEE",
            })
        );
        backdrop.rotateX(-Math.PI / 2);
        backdrop.rotateZ(-Math.PI);
        backdrop.translateY(0.02);
        scene.add(backdrop);

        new TextureLoader().load(image, (texture) => {
            texture.colorSpace = SRGBColorSpace;
            const mat = new MeshPhysicalMaterial({
                color: "#FFFFFF",
                map: texture,
                roughness: 1,
                metalness: 0,
            });
            const geom = new BoxGeometry(4, 0.01, 4);
            const mesh = new Mesh(geom, mat);
            mesh.rotateX(-Math.PI / 2);
            mesh.rotateZ(-Math.PI);
            scene.add(mesh);

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
