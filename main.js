/**
 * ARCHIVO: main.js
 * Rafael López Bueno - Portafolio DAW
 * Lógica: Cursor interactivo, Partículas de fondo, Escritura y Revelado de Scroll.
 */

// 1. SELECTORES PRINCIPALES
const cursorDot = document.querySelector(".cursor-dot");
const cursorOutline = document.querySelector(".cursor-outline");
const bgCanvas = document.getElementById("bg-canvas");
const highlight = document.querySelector(".highlight");

// 2. INTERACCIÓN DEL MOUSE (Cursor + Partículas)
window.addEventListener("mousemove", (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    // Movimiento del cursor personalizado
    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 250, fill: "forwards" });

    // Creación de partículas (ajustado para que no sature la pantalla)
    if (Math.random() > 0.85) {
        createParticle(posX, posY);
    }
});

// 3. FUNCIÓN DE PARTÍCULAS INTERACTIVAS
function createParticle(x, y) {
    const p = document.createElement("div");
    p.classList.add("particle");
    
    // Tamaño aleatorio para variedad visual
    const size = Math.random() * 4 + 2; 
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    
    // Posición inicial
    p.style.left = `${x}px`;
    p.style.top = `${y}px`;

    bgCanvas.appendChild(p);

    // Dirección de movimiento aleatoria
    const destX = (Math.random() - 0.5) * 120;
    const destY = (Math.random() - 0.5) * 120;

    const animation = p.animate([
        { transform: 'translate(0, 0)', opacity: 0.8 },
        { transform: `translate(${destX}px, ${destY}px)`, opacity: 0 }
    ], {
        duration: 1000 + Math.random() * 1000,
        easing: 'ease-out'
    });

    // Eliminar del DOM al terminar para mantener el rendimiento
    animation.onfinish = () => p.remove();
}

// 4. EFECTO DE ESCRITURA (Typing Effect)
const fullName = "López Bueno.";
let charIndex = 0;

function typeWriter() {
    if (charIndex < fullName.length) {
        highlight.innerHTML += fullName.charAt(charIndex);
        charIndex++;
        setTimeout(typeWriter, 130);
    }
}

// 5. ANIMACIÓN DE REVELADO (Intersection Observer)
const revealOnScroll = () => {
    const observerOptions = {
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target); // Animación solo la primera vez
            }
        });
    }, observerOptions);

    document.querySelectorAll(".bento-item").forEach(item => {
        observer.observe(item);
    });
};

// 6. EFECTO DE HOVER PARA EL CURSOR
const handleHover = () => {
    const targets = document.querySelectorAll("a, button, .bento-item");
    
    targets.forEach(target => {
        target.addEventListener("mouseenter", () => {
            cursorOutline.style.transform = "translate(-50%, -50%) scale(1.6)";
            cursorOutline.style.backgroundColor = "rgba(0, 242, 255, 0.1)";
        });
        target.addEventListener("mouseleave", () => {
            cursorOutline.style.transform = "translate(-50%, -50%) scale(1)";
            cursorOutline.style.backgroundColor = "transparent";
        });
    });
};

// 7. INICIALIZACIÓN GLOBAL
window.addEventListener("DOMContentLoaded", () => {
    // Iniciar escritura con un pequeño retraso
    if (highlight) {
        highlight.innerHTML = "";
        setTimeout(typeWriter, 600);
    }

    // Activar funciones
    revealOnScroll();
    handleHover();
});