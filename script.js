import { AnimationController } from './js/modules/AnimationController.js';
import { PortfolioSlider } from './js/modules/slider.js';
import { FormValidator } from './js/modules/form-validation.js';

// Datos de la galería
const galeriaItems = [
    { id: 1, categoria: 'retratos', imagen: 'retrato1.jpg', titulo: 'Retrato Urbano' },
    { id: 2, categoria: 'urbano', imagen: 'urbano1.jpg', titulo: 'Ciudad que Nunca Duerme' },
    { id: 3, categoria: 'eventos', imagen: 'evento1.jpg', titulo: 'Festival de Luces' },
    // Añadir más items aquí
];

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    initCursor();
    initGallery();
    initScrollReveal();
    optimizeScroll();
    initLightbox();
    initFormValidation();
    initLazyLoading();
  
    // Mejorar rendimiento de imágenes
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (img.complete) {
        img.classList.add('loaded');
      } else {
        img.addEventListener('load', () => img.classList.add('loaded'));
      }
    });

    // Añadir animación suave para el nombre "Sofi Bernal"
    const title = document.querySelector('.title-container h1');
    if (title) {
        setTimeout(() => {
            title.classList.add('visible');
        }, 500);
        title.style.opacity = '1';
        title.classList.add('visible');
    }

    // Inicializar cursor seguidor
    initCursorFollower();

    // Mejorar animación de scroll al hacer clic en Book Session
    document.querySelector('.cta-button').addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
          lenis.scrollTo(targetSection, {
            duration: 1.5,
            easing: (t) => 1 - Math.pow(1 - t, 5), // Easing más suave
            offset: -50 // Ajuste del offset
          });
        }
    });
});

function initCursor() {
    const cursor = document.querySelector('.custom-cursor');
    if (!cursor) return;

    // Movimiento del cursor
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Efecto hover
    document.querySelectorAll('a, button, .gallery-card').forEach(elem => {
        elem.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        elem.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
}

function initCursorFollower() {
    const follower = document.createElement('div');
    follower.classList.add('cursor-follower');
    document.body.appendChild(follower);

    document.addEventListener('mousemove', (e) => {
        follower.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });
}

function initGallery() {
    const filtros = document.querySelectorAll('.filtro-btn');
    const cards = document.querySelectorAll('.gallery-card');
    if (!filtros.length || !cards.length) return;

    // Sistema de filtrado
    filtros.forEach(btn => {
        btn.addEventListener('click', () => {
            // Actualizar botón activo
            document.querySelector('.filtro-btn.active')?.classList.remove('active');
            btn.classList.add('active');

            // Filtrar tarjetas
            const categoria = btn.dataset.categoria;
            filterGallery(categoria);
        });
    });

    // Animación inicial de las tarjetas
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                const index = Array.from(cards).indexOf(card);
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, observerOptions);

    cards.forEach(card => observer.observe(card));
}

function filterGallery(categoria) {
    document.querySelectorAll('.gallery-card').forEach(card => {
        if (categoria === 'todos' || card.dataset.categoria === categoria) {
            card.style.display = 'block';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 50);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => card.style.display = 'none', 300);
        }
    });
}

function setupVideo() {
    const video = document.getElementById('heroVideo');
    if (!video) return;

    video.addEventListener('load', () => {
        video.parentElement.classList.add('loaded');
    });
}

// Lightbox mejorado
function initLightbox() {
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = lightbox.querySelector('.lightbox-image');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    
    // Soporte para gestos táctiles
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.querySelectorAll('.gallery-card img').forEach(img => {
        img.addEventListener('click', (e) => {
            lightboxImg.src = e.target.src;
            lightboxImg.alt = e.target.alt;
            lightboxCaption.textContent = e.target.alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Gestos táctiles
    lightbox.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    lightbox.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
}

// Validación de formulario mejorada
function initFormValidation() {
    const form = document.querySelector('.contact-form');
    
    form.addEventListener('submit', handleSubmit);
    
    // Validación en tiempo real
    form.querySelectorAll('input, textarea').forEach(field => {
        field.addEventListener('input', () => validateField(field));
        field.addEventListener('blur', () => validateField(field));
    });
}

function validateField(field) {
    const errorElement = document.getElementById(`${field.id}-error`);
    
    if (!field.checkValidity()) {
        field.setAttribute('aria-invalid', 'true');
        errorElement.textContent = field.validationMessage;
    } else {
        field.setAttribute('aria-invalid', 'false');
        errorElement.textContent = '';
    }
}

// Lazy loading mejorado
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.srcset = img.dataset.srcset;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
}