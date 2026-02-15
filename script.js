// --- 1. Premium 3D Universe Setup ---
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x05000a, 0.002); // Deep space fog

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 50;

const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#bg3d'), alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// --- 2. Starfield (Wormhole Particles) ---
const starGeometry = new THREE.BufferGeometry();
const starCount = 3000; // Tons of stars for cinematic effect
const starPositions = new Float32Array(starCount * 3);

for(let i=0; i < starCount * 3; i++) {
    starPositions[i] = (Math.random() - 0.5) * 200; // Spread stars wide
}
starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));

const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff, size: 0.2, transparent: true, opacity: 0.8
});
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// --- 3. Glowing 3D Hearts ---
const objects = [];
function createPremiumHeart() {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(0, -3, -5, -3, -5, 0);
    shape.bezierCurveTo(-5, 3, 0, 6, 0, 10);
    shape.bezierCurveTo(0, 6, 5, 3, 5, 0);
    shape.bezierCurveTo(5, -3, 0, -3, 0, 0);

    const geometry = new THREE.ExtrudeGeometry(shape, { depth: 2, bevelEnabled: true, bevelSize: 1, bevelThickness: 1 });
    
    // Premium glowing material
    const material = new THREE.MeshStandardMaterial({ 
        color: 0xff0055, 
        emissive: 0x4a001a, // Glows from within
        roughness: 0.2, metalness: 0.5 
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = Math.PI;
    mesh.scale.set(0.12, 0.12, 0.12);
    return mesh;
}

// Lighting for Premium look
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
const pointLight = new THREE.PointLight(0xff4d6d, 2, 100);
pointLight.position.set(10, 10, 20);
const goldLight = new THREE.PointLight(0xffd700, 1, 100); // Gold tint
goldLight.position.set(-10, -10, 20);
scene.add(ambientLight, pointLight, goldLight);

// Add Hearts
for (let i = 0; i < 30; i++) {
    const obj = createPremiumHeart();
    obj.position.set((Math.random() - 0.5) * 80, (Math.random() - 0.5) * 80, (Math.random() - 0.5) * 40);
    scene.add(obj);
    objects.push(obj);
}

// --- 4. Animation & Warp Speed Logic ---
let warpSpeed = 0.05; // Normal star speed
let isWarping = false;

function animate() {
    requestAnimationFrame(animate);

    // Starfield Movement (Warp Effect)
    const positions = stars.geometry.attributes.position.array;
    for(let i=2; i < starCount * 3; i+=3) {
        positions[i] += warpSpeed; // Move stars towards camera
        if (positions[i] > 50) positions[i] = -150; // Reset far back
    }
    stars.geometry.attributes.position.needsUpdate = true;
    stars.rotation.z += 0.0005; // Slowly rotate the galaxy

    // Heart Movement
    objects.forEach((obj, index) => {
        obj.rotation.y += 0.01;
        obj.rotation.x += 0.005;
        // Float gently up and down
        obj.position.y += Math.sin(Date.now() * 0.001 + index) * 0.02; 
    });

    renderer.render(scene, camera);
}
animate();

// --- 5. Cinematic Navigation ---
function nextScreen(num) {
    const currentScreen = document.querySelector(".screen.active");
    const nextScreenElement = document.getElementById("screen" + num);

    // Trigger WARP SPEED effect!
    warpSpeed = 3.0; 
    isWarping = true;
    
    // Fade out current text
    if(currentScreen) {
        currentScreen.style.opacity = "0";
        setTimeout(() => {
            currentScreen.classList.remove("active");
            currentScreen.style.display = "none";
        }, 800);
    }

    // Slow down warp speed and show next screen after delay
    setTimeout(() => {
        warpSpeed = 0.05; // Back to romantic slow speed
        isWarping = false;

        if (nextScreenElement) {
            nextScreenElement.style.display = "flex";
            // Tiny delay to allow display:flex to apply before fading in
            setTimeout(() => {
                nextScreenElement.classList.add("active");
                nextScreenElement.style.opacity = "1";
            }, 50);
        }

        // Screen 4 Reveal Logic
        if (num === 4) {
            const video = document.getElementById("bdayVideo");
            const endContent = document.getElementById("endContent");

            video.play().catch(e => console.log("User click required for video"));

            video.onended = () => {
                video.style.opacity = "0"; // Fade out video
                
                setTimeout(() => {
                    video.style.display = "none";
                    endContent.style.display = "flex";
                    
                    setTimeout(() => {
                        endContent.style.opacity = "1";
                        // Make the background completely magical
                        pointLight.color.setHex(0xd4af37); // Shift light to Gold
                        warpSpeed = 0.1; // Slightly faster stars for finale
                    }, 100);
                }, 1000);
            };
        }
    }, 1000); // 1 second in warp space
}

// Handle Window Resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});