// Conecta o olho 3D com o sistema de tema

document.addEventListener('DOMContentLoaded', () => {
    // Função para atualizar as cores do olho quando o tema muda
    function syncEyeWithTheme() {
        // Dispara um evento personalizado que será capturado pelo three-scroll-animation.js
        const isDarkMode = document.body.classList.contains('dark-mode');
        document.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { isDarkMode }
        }));
    }

    // Observa mudanças de tema (MutationObserver para detectar mudanças na classe dark-mode do body)
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                syncEyeWithTheme();
            }
        });
    });

    // Inicia a observação do elemento body e suas alterações de classe
    observer.observe(document.body, { attributes: true });

    // Sincroniza inicialmente
    syncEyeWithTheme();

    // Adiciona interatividade ao clicar no olho
    const eyeContainer = document.getElementById('eye-animation-container');
    if (eyeContainer) {
        eyeContainer.addEventListener('click', () => {
            // Efeito divertido ao clicar no olho - pisca rapidamente
            eyeContainer.style.transform = 'scale(0.9)';
            setTimeout(() => {
                eyeContainer.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    eyeContainer.style.transform = '';
                }, 150);
            }, 150);
        });
    }
});
