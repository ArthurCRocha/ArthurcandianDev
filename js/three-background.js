// Configuração do Three.js para o background do portfólio
let scene, camera, renderer, particles;
let mouseX = 0, mouseY = 0;

// Coordenadas do mouse
document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - window.innerWidth / 2) / 100;
    mouseY = (event.clientY - window.innerHeight / 2) / 100;
});

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
    
    // Definir posições e cores aleatórias para as partículas
    for(let i = 0; i < particlesCount * 3; i++) {
        // Posições
        posArray[i] = (Math.random() - 0.5) * 60;
        
        // Cores - tons de azul e vermelho para matching com a cor secundária do portfólio
        if (i % 3 === 0) {
            colorsArray[i] = Math.random() * 0.2 + 0.8; // R - valor alto para vermelho
            colorsArray[i+1] = Math.random() * 0.1; // G - baixo
            colorsArray[i+2] = Math.random() * 0.2; // B - baixo
        } else {
            colorsArray[i] = Math.random() * 0.1; // R - baixo
            colorsArray[i+1] = Math.random() * 0.1; // G - baixo
            colorsArray[i+2] = Math.random() * 0.3 + 0.7; // B - alto para azul
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
