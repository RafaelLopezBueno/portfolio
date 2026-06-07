/**
 * ARCHIVO: main.js
 * Rafael López Bueno - Portfolio interactivo
 * Funcionalidad: Cursor personalizado, partículas, scroll reveal, form validation
 */

// ======================================
// 1. SELECTORES PRINCIPALES
// ======================================
const cursorDot = document.querySelector(".cursor-dot");
const cursorOutline = document.querySelector(".cursor-outline");
const bgCanvas = document.getElementById("bg-canvas");

// ======================================
// 2. CURSOR PERSONALIZADO + PARTÍCULAS
// ======================================
window.addEventListener("mousemove", (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    cursorOutline.style.left = `${posX}px`;
    cursorOutline.style.top = `${posY}px`;

    // Crear partículas al mover el ratón (20% de probabilidad)
    if (Math.random() > 0.8) {
        createParticle(posX, posY);
    }
});

// ======================================
// 3. FUNCIÓN DE CREACIÓN DE PARTÍCULAS
// ======================================
function createParticle(x, y) {
    const particle = document.createElement("div");
    particle.classList.add("particle");
    
    const size = Math.random() * 5 + 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;

    // Alternar entre colores primario y secundario
    const colors = ['#ff2e5b', '#008eff'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    particle.style.background = color;
    particle.style.boxShadow = `0 0 14px ${color}`;

    bgCanvas.appendChild(particle);

    // Animación de dispersión
    const destX = (Math.random() - 0.5) * 140;
    const destY = (Math.random() - 0.5) * 140;
    const duration = 800 + Math.random() * 700;

    const animation = particle.animate([
        { transform: 'translate(0, 0)', opacity: 1 },
        { transform: `translate(${destX}px, ${destY}px)`, opacity: 0 }
    ], {
        duration: duration,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    });

    animation.onfinish = () => particle.remove();
}

// ======================================
// 4. ANIMACIÓN DE REVELADO POR SCROLL
// ======================================
const revealOnScroll = () => {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observar elementos con clase reveal-card
    document.querySelectorAll(".reveal-card").forEach(card => {
        observer.observe(card);
    });
};

// ======================================
// 5. EFECTO HOVER DEL CURSOR
// ======================================
const setupCursorHover = () => {
    const interactiveElements = document.querySelectorAll(
        "a, button, .btn, .project-card, .project-mini-card, .about-card, [data-tilt]"
    );
    
    interactiveElements.forEach(el => {
        el.addEventListener("mouseenter", () => {
            cursorOutline.style.transform = "translate(-50%, -50%) scale(1.5)";
            cursorOutline.style.borderColor = "rgba(0, 142, 255, 0.95)";
        });
        
        el.addEventListener("mouseleave", () => {
            cursorOutline.style.transform = "translate(-50%, -50%) scale(1)";
            cursorOutline.style.borderColor = "rgba(255, 46, 91, 0.85)";
        });
    });
};

// ======================================
// 6. SCROLL SPY - NAVEGACIÓN ACTIVA
// ======================================
const setupScrollSpy = () => {
    const navLinks = document.querySelectorAll('.nav-list a');
    const sections = document.querySelectorAll('main section[id]');

    const updateActiveLink = () => {
        const scrollPos = window.pageYOffset + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const id = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-list a[href="#${id}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink();
};

// ======================================
// 7. EFECTO TILT 3D EN TARJETAS
// ======================================
const setupTiltCards = () => {
    const tiltElements = document.querySelectorAll('[data-tilt]');
    
    tiltElements.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(900px) rotateX(0) rotateY(0) scale(1)';
        });
    });
};

// ======================================
// 8. MOVIMIENTO PARALAJE DEL HERO
// ======================================
const setupHeroMotion = () => {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    document.addEventListener('mousemove', (e) => {
        const moveX = (e.clientX / window.innerWidth - 0.5) * 40;
        const moveY = (e.clientY / window.innerHeight - 0.5) * 25;

        hero.style.setProperty('--hero-x', `${moveX}px`);
        hero.style.setProperty('--hero-y', `${moveY}px`);
    });
};

// ======================================
// 9. VALIDACIÓN DE FORMULARIO
// ======================================
const setupFormValidation = () => {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const nameInput = form.querySelector('input[name="name"]');
    const emailInput = form.querySelector('input[name="email"]');
    const messageInput = form.querySelector('textarea[name="message"]');
    const submitBtn = form.querySelector('button[type="submit"]');
    const statusMsg = form.querySelector('.form-status');

    const validateForm = () => {
        const isValidName = nameInput.value.trim().length >= 2;
        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value);
        const isValidMessage = messageInput.value.trim().length >= 10;

        const isFormValid = isValidName && isValidEmail && isValidMessage;
        submitBtn.disabled = !isFormValid;

        return isFormValid;
    };

    [nameInput, emailInput, messageInput].forEach(input => {
        input.addEventListener('input', validateForm);
    });

    form.addEventListener('submit', (e) => {
        if (!validateForm()) {
            e.preventDefault();
            statusMsg.textContent = '⚠️ Por favor completa el formulario correctamente';
            statusMsg.style.opacity = '1';
            setTimeout(() => {
                statusMsg.style.opacity = '0';
            }, 3000);
        }
    });

    validateForm();
};

// ======================================
// 10. INICIALIZACIÓN AL CARGAR LA PÁGINA
// ======================================
document.addEventListener('DOMContentLoaded', () => {
    revealOnScroll();
    setupCursorHover();
    setupScrollSpy();
    setupTiltCards();
    setupHeroMotion();
    setupFormValidation();
});
