document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Fiber Go carregado!');
    
    const elements = document.querySelectorAll('.group');
    elements.forEach(function(el) {
        el.style.opacity = '0';
        el.style.animation = 'fadeUp 0.5s ease-out forwards';
    });
});
