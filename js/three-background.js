// Configuração do Three.js para o background do portfólio
let scene, camera, renderer, particles;
let mouseX = 0, mouseY = 0;
let isDarkMode = false;

// Coordenadas do mouse
document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - window.innerWidth / 2) / 100;
    mouseY = (event.clientY - window.innerHeight / 2) / 100;
});

// Listen for theme changes
document.addEventListener('themeChanged', (event) => {
    isDarkMode = event.detail.isDarkMode;
    updateParticleColors();
});

function updateParticleColors() {
    if (!particles || !particles.geometry) return;
    
    const colorsArray = particles.geometry.attributes.color.array;
    const particlesCount = colorsArray.length / 3;
    
    for(let i = 0; i < particlesCount * 3; i += 3) {
        if (isDarkMode) {
            // Dark mode colors - brighter particles
            if (i % 6 === 0) {
                colorsArray[i] = Math.random() * 0.3 + 0.7; // R - higher for more visibility
                colorsArray[i+1] = Math.random() * 0.2; // G - low
                colorsArray[i+2] = Math.random() * 0.3; // B - low
            } else {
                colorsArray[i] = Math.random() * 0.2; // R - low
                colorsArray[i+1] = Math.random() * 0.2; // G - low
                colorsArray[i+2] = Math.random() * 0.5 + 0.5; // B - higher for more visibility
            }
        } else {
            // Light mode colors - original scheme
            if (i % 6 === 0) {
                colorsArray[i] = Math.random() * 0.2 + 0.8; // R - high for red
                colorsArray[i+1] = Math.random() * 0.1; // G - low
                colorsArray[i+2] = Math.random() * 0.2; // B - low
            } else {
                colorsArray[i] = Math.random() * 0.1; // R - low
                colorsArray[i+1] = Math.random() * 0.1; // G - low
                colorsArray[i+2] = Math.random() * 0.3 + 0.7; // B - high for blue
            }
        }
    }
    
    particles.geometry.attributes.color.needsUpdate = true;
}

function init() {
    // Configuração da cena
    scene = new THREE.Scene();
    
    // Configuração da câmera
    const fieldOfView = 75;
    const aspectRatio = window.innerWidth / window.innerHeight;
    const nearPlane = 0.1;
    const farPlane = 1000;
    
    camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
    camera.position.z = 30;
    
    // Configuração do renderer
    renderer = new THREE.WebGLRenderer({ 
        canvas: document.getElementById('bg-canvas'),
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Criação do sistema de partículas
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    
    const posArray = new Float32Array(particlesCount * 3);
    const colorsArray = new Float32Array(particlesCount * 3);
    
    // Check if dark mode is active
    isDarkMode = document.body.classList.contains('dark-mode');
    
    // Definir posições e cores aleatórias para as partículas
    for(let i = 0; i < particlesCount * 3; i++) {
        // Posições
        posArray[i] = (Math.random() - 0.5) * 60;
        
        // Cores baseadas no tema atual
        if (isDarkMode) {
            // Dark mode colors - brighter particles
            if (i % 6 === 0) {
                colorsArray[i] = Math.random() * 0.3 + 0.7; // R - higher for more visibility
                colorsArray[i+1] = Math.random() * 0.2; // G - low
                colorsArray[i+2] = Math.random() * 0.3; // B - low
            } else {
                colorsArray[i] = Math.random() * 0.2; // R - low
                colorsArray[i+1] = Math.random() * 0.2; // G - low
                colorsArray[i+2] = Math.random() * 0.5 + 0.5; // B - higher for more visibility
            }
        } else {
            // Light mode colors - original scheme
            if (i % 6 === 0) {
                colorsArray[i] = Math.random() * 0.2 + 0.8; // R - high for red
                colorsArray[i+1] = Math.random() * 0.1; // G - low
                colorsArray[i+2] = Math.random() * 0.2; // B - low
            } else {
                colorsArray[i] = Math.random() * 0.1; // R - low
                colorsArray[i+1] = Math.random() * 0.1; // G - low
                colorsArray[i+2] = Math.random() * 0.3 + 0.7; // B - high for blue
            }
        }
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({ 
        size: 0.1,
        transparent: true,
        opacity: 0.8,
        vertexColors: true,
        blending: THREE.AdditiveBlending
    });
    
    particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    
    window.addEventListener('resize', onWindowResize, false);
    
    animate();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    
    // Rotação suave das partículas
    particles.rotation.y += 0.001;
    particles.rotation.x += 0.0005;
    
    // Reage ao movimento do mouse
    particles.rotation.y += mouseX * 0.001;
    particles.rotation.x += mouseY * 0.001;
    
    renderer.render(scene, camera);
}

// Inicializa a animação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', init);
