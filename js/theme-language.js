/**
 * Theme and Language Toggle functionality
 * This script manages dark/light mode toggling and language switching between English and Portuguese
 */

document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Check for saved theme preference or respect OS preference
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const savedTheme = localStorage.getItem('theme');
    
    // Apply saved theme or OS preference
    if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
        document.body.classList.add('dark-mode');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
    
    // Theme toggle click handler
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        
        // Update icon
        if (document.body.classList.contains('dark-mode')) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        }
        
        // Update three.js colors if needed - could add callback or event here
    });
    
    // Language Toggle functionality
    const langToggle = document.getElementById('lang-toggle');
    const langIcon = langToggle.querySelector('i');
    
    // Check for saved language preference
    const savedLang = localStorage.getItem('language') || 'pt';
    
    // Apply saved language preference
    if (savedLang === 'en') {
        document.documentElement.setAttribute('lang', 'en');
        translateToEnglish();
        document.title = "Arthur Candian Rocha - Portfolio";
    }
    
    // Language toggle click handler
    langToggle.addEventListener('click', function() {
        const currentLang = document.documentElement.getAttribute('lang');
        
        if (currentLang === 'en') {
            // Switch to Portuguese
            document.documentElement.setAttribute('lang', 'pt-BR');
            translateToPortuguese();
            localStorage.setItem('language', 'pt');
            document.title = "Arthur Candian Rocha - Portfólio";
        } else {
            // Switch to English
            document.documentElement.setAttribute('lang', 'en');
            translateToEnglish();
            localStorage.setItem('language', 'en');
            document.title = "Arthur Candian Rocha - Portfolio";
        }
    });
    
    // Translation functions
    function translateToEnglish() {
        const elements = document.querySelectorAll('[data-en]');
        elements.forEach(element => {
            const englishText = element.getAttribute('data-en');
            if (englishText) {
                element.textContent = englishText;
            }
        });
    }
    
    function translateToPortuguese() {
        const elements = document.querySelectorAll('[data-pt]');
        elements.forEach(element => {
            const portugueseText = element.getAttribute('data-pt');
            if (portugueseText) {
                element.textContent = portugueseText;
            }
        });
    }
    
    // Update Three.js background colors based on theme
    function updateThreeJsColors() {
        // This would be implemented if needed to change Three.js colors based on theme
        // You could dispatch a custom event that three-background.js listens for
        const themeChangeEvent = new CustomEvent('themeChanged', {
            detail: { isDarkMode: document.body.classList.contains('dark-mode') }
        });
        document.dispatchEvent(themeChangeEvent);
    }
    
    // Listen for OS theme preference changes
    prefersDarkScheme.addEventListener('change', function(e) {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                document.body.classList.add('dark-mode');
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            } else {
                document.body.classList.remove('dark-mode');
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
            updateThreeJsColors();
        }
    });
    
    // Initial Three.js color update
    updateThreeJsColors();
});
