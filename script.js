// --- 1. 3D Scene Setup ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#bg3d'), alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 45;

const objects = [];

// Function: Create 3D Heart
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

// Function: Create 3D Balloon
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

// Setup Lights
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(10, 10, 10);
scene.add(light, new THREE.AmbientLight(0xffffff, 0.6));

// Populate 3D Objects
for (let i = 0; i < 50; i++) {
    const obj = Math.random() > 0.5 ? createHeart() : createBalloon();
    obj.position.set((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 40);
    scene.add(obj);
    objects.push(obj);
}

// --- 2. Animation Loop ---
function animate() {
    requestAnimationFrame(animate);
    
    // Check if we are on Screen 4
    const screen4 = document.getElementById('screen4');
    const isScreen4 = screen4 && screen4.classList.contains('active');

    objects.forEach(obj => {
        if (isScreen4) {
            obj.position.y += 0.3; // Floating UP on Screen 4
            obj.rotation.x += 0.02;
        } else {
            obj.position.y -= 0.15; // Raining DOWN on other screens
        }

        // Reset positions when they go off screen
        if (obj.position.y < -55) obj.position.y = 55;
        if (obj.position.y > 55) obj.position.y = -55;
        obj.rotation.y += 0.01;
    });
    renderer.render(scene, camera);
}
animate();

// --- 3. Navigation & Video Logic ---
function nextScreen(num) {
    // 1. Hide all screens and remove active class
    document.querySelectorAll(".screen").forEach(s => {
        s.style.display = "none";
        s.classList.remove("active");
    });

    // 2. Show the target screen
    const currentScreen = document.getElementById("screen" + num);
    if (currentScreen) {
        currentScreen.style.display = "flex";
        currentScreen.classList.add("active");
    }

    // 3. Screen 4 Specific Surprise Logic
    if (num === 4) {
        const video = document.getElementById("bdayVideo");
        const endContent = document.getElementById("endContent");

        // Try to play the video (browsers might block sound initially)
        video.play().catch(e => console.log("User interaction required for video"));

        video.onended = () => {
            // Fade out the video
            video.style.opacity = "0";

            setTimeout(() => {
                video.style.display = "none";

                // Show the Collage Image and Final Wish
                if (endContent) {
                    endContent.style.display = "flex";
                    
                    // Trigger fade-in
                    setTimeout(() => {
                        endContent.style.opacity = "1";
                        // Romantic background change
                        document.body.style.background = "radial-gradient(circle, #2a0033, #000)";
                    }, 50);
                }
            }, 1000); // 1-second delay for fade-out
        };
    }
}

// Handle Window Resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});