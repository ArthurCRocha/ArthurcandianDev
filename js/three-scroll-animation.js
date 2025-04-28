// Configuração do Three.js para animação de scroll
let scrollScene, scrollCamera, scrollRenderer;
let eye; 
let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;
let irisGroup; // Grupo para a íris e pupila

// Adicionar event listener para seguir o mouse
document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

function initScrollAnimation() {
    // Container onde será inserido o canvas
    const container = document.getElementById('eye-animation-container');
    if (!container) return;
    
    // Configuração da cena
    scrollScene = new THREE.Scene();
    
    // Configuração da câmera
    const aspectRatio = container.clientWidth / container.clientHeight;
    scrollCamera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
    scrollCamera.position.z = 5;
    
    // Configuração do renderer
    scrollRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    scrollRenderer.setSize(container.clientWidth, container.clientHeight);
    scrollRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(scrollRenderer.domElement);
    
    // Luz ambiente
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scrollScene.add(ambientLight);
    
    // Luz direcional
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scrollScene.add(directionalLight);
    
    // Criação do globo ocular (esfera principal - branco do olho)
    const eyeGeometry = new THREE.SphereGeometry(1, 32, 32);
    const eyeMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff,
        roughness: 0.1,
        metalness: 0.1
    });
    eye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    scrollScene.add(eye);
    
    // Grupo para a íris e pupila, para que se movam juntas
    irisGroup = new THREE.Group();
    eye.add(irisGroup);
    irisGroup.position.z = 0.85; // Posiciona na frente do olho
    
    // Criação da íris colorida
    const irisGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const irisMaterial = new THREE.MeshStandardMaterial({ 
        color: isDarkMode() ? 0x3498db : 0xe63946, // Cor baseada no tema
        roughness: 0.1,
        metalness: 0.2
    });
    const iris = new THREE.Mesh(irisGeometry, irisMaterial);
    irisGroup.add(iris);
    
    // Criação da pupila (centro do olho)
    const pupilGeometry = new THREE.SphereGeometry(0.25, 32, 32);
    const pupilMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x000000,
        roughness: 0.1,
        metalness: 0
    });
    const pupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    pupil.position.z = 0.2; // Posiciona na frente da íris
    irisGroup.add(pupil);
    
    // Adicionar reflexo nos olhos (pequena esfera branca)
    const reflectionGeometry = new THREE.SphereGeometry(0.08, 16, 16);
    const reflectionMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const reflection = new THREE.Mesh(reflectionGeometry, reflectionMaterial);
    reflection.position.set(0.15, 0.15, 0.3); // Posiciona no canto superior direito da pupila
    irisGroup.add(reflection);
    
    // Reflexo secundário menor
    const reflection2 = new THREE.Mesh(
        new THREE.SphereGeometry(0.04, 16, 16),
        reflectionMaterial
    );
    reflection2.position.set(-0.10, -0.10, 0.3); // Posiciona no canto inferior esquerdo da pupila
    irisGroup.add(reflection2);
    
    // Adicionar "pálpebras" (semiesferas achatadas)
    createEyelid(true);  // Pálpebra superior
    createEyelid(false); // Pálpebra inferior
    
    // Responde ao redimensionamento da janela
    window.addEventListener('resize', () => {
        if (!container) return;
        scrollCamera.aspect = container.clientWidth / container.clientHeight;
        scrollCamera.updateProjectionMatrix();
        scrollRenderer.setSize(container.clientWidth, container.clientHeight);
    });
    
    // Inicia animação
    animateScroll();
}

// Função para criar as pálpebras
function createEyelid(isUpper) {
    const eyelidGeometry = new THREE.SphereGeometry(1.01, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const eyelidMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xdddddd,
        side: THREE.DoubleSide,
        roughness: 0.4
    });
    
    const eyelid = new THREE.Mesh(eyelidGeometry, eyelidMaterial);
    
    if (isUpper) {
        eyelid.rotation.x = Math.PI;
        eyelid.position.y = 0.02; // Pequena sobreposição com o olho
    } else {
        eyelid.position.y = -0.02; // Pequena sobreposição com o olho
    }
    
    eyelid.userData = { isUpper }; // Armazenar qual pálpebra é
    eye.add(eyelid);
    
    return eyelid;
}

// Verifica se o modo escuro está ativo
function isDarkMode() {
    return document.body.classList.contains('dark-mode');
}

// Função para atualizar cores baseado no tema
function updateEyeColors() {
    if (!irisGroup || !irisGroup.children || irisGroup.children.length < 1) return;
    
    // Atualiza a cor da íris baseada no tema atual
    const iris = irisGroup.children[0];
    if (iris && iris.material) {
        iris.material.color.set(isDarkMode() ? 0x3498db : 0xe63946);
    }
}

// Adicionar listener para mudanças de tema
document.addEventListener('themeChanged', updateEyeColors);

function animateScroll() {
    requestAnimationFrame(animateScroll);
    
    if (!scrollRenderer) return;
    
    // Obter posição de scroll para animar a rotação
    const scrollPosition = window.scrollY;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const scrollFraction = scrollPosition / maxScroll;
    
    // Limite o movimento do olho
    const maxEyeRotation = 0.3;
    targetX = mouseX * maxEyeRotation;
    targetY = mouseY * maxEyeRotation;
    
    // Movimento de íris/pupila (mais realista)
    if (irisGroup) {
        // Movimento mais limitado para a íris (70% do movimento do mouse)
        const irisMovementFactor = 0.2; 
        irisGroup.position.x = THREE.MathUtils.lerp(irisGroup.position.x, mouseX * irisMovementFactor, 0.05);
        irisGroup.position.y = THREE.MathUtils.lerp(irisGroup.position.y, mouseY * irisMovementFactor, 0.05);
        
        // Manter a íris na superfície do olho
        const distanceFromCenter = Math.sqrt(irisGroup.position.x**2 + irisGroup.position.y**2);
        const maxDistance = 0.5; // Limitar quão longe a íris pode ir
        
        if (distanceFromCenter > maxDistance) {
            const angle = Math.atan2(irisGroup.position.y, irisGroup.position.x);
            irisGroup.position.x = Math.cos(angle) * maxDistance;
            irisGroup.position.y = Math.sin(angle) * maxDistance;
        }
        
        // Manter a posição Z constante
        irisGroup.position.z = 0.85;
    }
    
    // Rotação do olho para seguir o mouse com efeito smooth
    eye.rotation.y += (targetX - eye.rotation.y) * 0.05;
    eye.rotation.x += (targetY - eye.rotation.x) * 0.05;
    
    // Pequena animação com base no scroll para dar movimento adicional
    eye.position.y = Math.sin(scrollFraction * Math.PI * 2) * 0.05;
    
    // Piscar o olho ocasionalmente
    const time = Date.now() * 0.001;
    const blinkInterval = 4; // Intervalo de piscar em segundos
    const blinkDuration = 0.2; // Duração do piscar em segundos
    
    const modTime = time % blinkInterval;
    let blinkAmount = 0;
    
    if (modTime < blinkDuration) {
        // Calcular quanto a pálpebra deve fechar (0 = aberto, 1 = fechado)
        blinkAmount = Math.sin((modTime / blinkDuration) * Math.PI);
    }
    
    // Animar as pálpebras
    eye.children.forEach(child => {
        if (child.userData && child.userData.hasOwnProperty('isUpper')) {
            const isUpper = child.userData.isUpper;
            const rotationDirection = isUpper ? -1 : 1;
            const baseRotation = isUpper ? Math.PI : 0;
            const targetRotation = baseRotation + rotationDirection * (blinkAmount * 0.5);
            
            child.rotation.x = targetRotation;
        }
    });
    
    scrollRenderer.render(scrollScene, scrollCamera);
}

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    // Verifica se há suporte para WebGL antes de inicializar
    if (WebGLRenderingContext) {
        // Inicializa depois de um breve delay para garantir que o DOM esteja totalmente carregado
        setTimeout(initScrollAnimation, 100);
    } else {
        console.warn('WebGL não suportado. Não foi possível inicializar animação de olho.');
    }
});
