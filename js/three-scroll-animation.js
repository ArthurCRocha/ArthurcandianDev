// Configuração do Three.js para animação de scroll
let scrollScene, scrollCamera, scrollRenderer;
let cube;

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
    
    // Criação do cubo
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshStandardMaterial({ 
        color: 0xe63946, // Cor secundária do seu site
        roughness: 0.5,
        metalness: 0.7
    });
    cube = new THREE.Mesh(geometry, material);
    scrollScene.add(cube);
    
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
    
    // Rotação baseada na posição de scroll
    const scrollPosition = window.scrollY;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const scrollFraction = scrollPosition / maxScroll;
    
    // Rotação proporcional ao scroll
    cube.rotation.x = scrollFraction * Math.PI * 2; // Rotação completa em X
    cube.rotation.y = scrollFraction * Math.PI * 4; // Duas rotações completas em Y
    
    // Mudança de cor baseada no scroll
    const hue = (scrollFraction * 360) % 360;
    cube.material.color.setHSL(hue / 360, 0.8, 0.5);
    
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
            container.style.borderRadius = '8px';
            container.style.overflow = 'hidden';
            
            // Insere o container antes da seção Projetos
            const projectsSection = document.getElementById('projetos');
            projectsSection.parentNode.insertBefore(container, projectsSection);
        }
        
        initScrollAnimation();
    }
});
