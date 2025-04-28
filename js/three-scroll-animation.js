// Configuração do Three.js para animação de scroll
let scrollScene, scrollCamera, scrollRenderer;
let eye; 
let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;

// Adicionar event listener para seguir o mouse
document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

function initScrollAnimation() {
    // Container onde será inserido o canvas
    const container = document.getElementById('scroll-animation-container');
    
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
    
    // Criação do globo ocular (esfera)
    const eyeGeometry = new THREE.SphereGeometry(1, 32, 32);
    const eyeMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff,
        roughness: 0.1,
        metalness: 0.1
    });
    eye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    scrollScene.add(eye);
    
    // Criação da íris/pupila
    const irisGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const irisMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xe63946, // Cor secundária do seu site
        roughness: 0.1,
        metalness: 0.2
    });
    const iris = new THREE.Mesh(irisGeometry, irisMaterial);
    iris.position.z = 0.85; // Posiciona na frente do olho
    eye.add(iris);
    
    // Criação da pupila (centro do olho)
    const pupilGeometry = new THREE.SphereGeometry(0.25, 32, 32);
    const pupilMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x000000,
        roughness: 0.1,
        metalness: 0
    });
    const pupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    pupil.position.z = 0.2; // Posiciona na frente da íris
    iris.add(pupil);
    
    // Responde ao redimensionamento da janela
    window.addEventListener('resize', () => {
        scrollCamera.aspect = container.clientWidth / container.clientHeight;
        scrollCamera.updateProjectionMatrix();
        scrollRenderer.setSize(container.clientWidth, container.clientHeight);
    });
    
    // Inicia animação
    animateScroll();
}

function animateScroll() {
    requestAnimationFrame(animateScroll);
    
    // Obter posição de scroll para animar a rotação
    const scrollPosition = window.scrollY;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const scrollFraction = scrollPosition / maxScroll;
    
    // Interpolação suave para seguir o mouse
    targetX = mouseX * 0.5; // Limita o movimento
    targetY = mouseY * 0.5;
    
    // Rotação do olho para seguir o mouse com efeito smooth
    eye.rotation.y += (targetX - eye.rotation.y) * 0.1;
    eye.rotation.x += (targetY - eye.rotation.x) * 0.1;
    
    // Pequena animação com base no scroll para dar movimento adicional
    eye.position.y = Math.sin(scrollFraction * Math.PI * 2) * 0.2;
    
    // Piscar o olho ocasionalmente (baseado no tempo)
    const time = Date.now() * 0.001;
    if (Math.sin(time) > 0.99) {
        eye.scale.y = 0.1; // Olho quase fechado
    } else {
        eye.scale.y = 1 + Math.sin(time * 0.5) * 0.1; // Variação suave na altura
    }
    
    scrollRenderer.render(scrollScene, scrollCamera);
}

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    // Verifica se há suporte para WebGL antes de inicializar
    if (WebGLRenderingContext) {
        // Cria o container para a animação se ainda não existir
        if (!document.getElementById('scroll-animation-container')) {
            const container = document.createElement('div');
            container.id = 'scroll-animation-container';
            container.style.width = '300px';
            container.style.height = '300px';
            container.style.position = 'relative';
            container.style.margin = '30px auto';
            container.style.borderRadius = '150px'; // Forma circular para o container
            container.style.overflow = 'hidden';
            container.style.boxShadow = '0 0 20px rgba(230, 57, 70, 0.5)'; // Brilho com cor secundária
            
            // Insere o container antes da seção Projetos
            const projectsSection = document.getElementById('projetos');
            if (projectsSection) {
                projectsSection.parentNode.insertBefore(container, projectsSection);
            } else {
                // Fallback se não encontrar a seção de projetos
                document.body.appendChild(container);
            }
        }
        
        initScrollAnimation();
    }
});
