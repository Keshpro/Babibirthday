// 1. 3D Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#bg3d'), alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 45;

const objects = [];

// Function: 3D Heart
function createHeart() {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(0, -3, -5, -3, -5, 0);
    shape.bezierCurveTo(-5, 3, 0, 6, 0, 10);
    shape.bezierCurveTo(0, 6, 5, 3, 5, 0);
    shape.bezierCurveTo(5, -3, 0, -3, 0, 0);

    const geometry = new THREE.ExtrudeGeometry(shape, { depth: 2, bevelEnabled: true, bevelSize: 1, bevelThickness: 1 });
    const material = new THREE.MeshPhongMaterial({ color: 0xff4d6d });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = Math.PI;
    mesh.scale.set(0.15, 0.15, 0.15);
    return mesh;
}

// Function: 3D Balloon
function createBalloon() {
    const group = new THREE.Group();
    const body = new THREE.Mesh(new THREE.SphereGeometry(2, 20, 20), new THREE.MeshPhongMaterial({ color: 0xffd700 }));
    body.scale.set(1, 1.3, 1);
    const string = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 8), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    string.position.y = -6;
    group.add(body, string);
    group.scale.set(0.7, 0.7, 0.7);
    return group;
}

// Lights
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(10, 10, 10);
scene.add(light, new THREE.AmbientLight(0xffffff, 0.6));

// Populate Objects
for (let i = 0; i < 50; i++) {
    const obj = Math.random() > 0.5 ? createHeart() : createBalloon();
    obj.position.set((Math.random()-0.5)*100, (Math.random()-0.5)*100, (Math.random()-0.5)*40);
    scene.add(obj);
    objects.push(obj);
}

// 2. Animation Logic
function animate() {
    requestAnimationFrame(animate);
    const isScreen4 = document.getElementById('screen4').classList.contains('active');

    objects.forEach(obj => {
        if (isScreen4) {
            obj.position.y += 0.3; // Screen 4 nam uda yanawa
            obj.rotation.x += 0.02;
        } else {
            obj.position.y -= 0.15; // Anith welawata wessak wage wetenawa
        }

        if (obj.position.y < -55) obj.position.y = 55;
        if (obj.position.y > 55) obj.position.y = -55;
        obj.rotation.y += 0.01;
    });
    renderer.render(scene, camera);
}
animate();

// 3. Navigation
function nextScreen(num) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    document.getElementById("screen" + num).classList.add("active");

    if (num === 4) {
        const video = document.getElementById("bdayVideo");
        const wish = document.getElementById("finalWish");
        video.play();
        video.onended = () => {
            video.style.opacity = "0";
            setTimeout(() => {
                video.style.display = "none";
                wish.style.opacity = "1";
                document.body.style.background = "radial-gradient(circle, #2a0033, #000)";
            }, 1000);
        };
    }
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});