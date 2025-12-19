// ============================================================================
// NAVIGATION TOGGLE - PORTFOLIO PAGES
// ============================================================================

const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('nav');
const navClose = document.querySelector('.nav-close');
const overlay = document.querySelector('.overlay');
const body = document.body;

// Only initialize if elements exist (prevents errors)
if (navToggle && nav && overlay) {
    // Open navigation
    navToggle.addEventListener('click', () => {
        nav.classList.add('active');
        overlay.classList.add('active');
        navToggle.classList.add('hidden');
        navToggle.setAttribute('aria-expanded', 'true');
        body.style.overflow = 'hidden';
    });

    // Close navigation function
    function closeNav() {
        nav.classList.remove('active');
        overlay.classList.remove('active');
        navToggle.classList.remove('hidden');
        navToggle.setAttribute('aria-expanded', 'false');
        body.style.overflow = '';
    }

    // Close button click
    if (navClose) {
        navClose.addEventListener('click', closeNav);
    }

    // Overlay click
    overlay.addEventListener('click', closeNav);

    // Close nav when clicking on a link
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', () => {
            closeNav();
        });
    });

    // Close nav with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('active')) {
            closeNav();
        }
    });
}

// ============================================================================
// HEADER SCROLL EFFECT
// ============================================================================

const header = document.querySelector('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ============================================================================
// DYNAMIC YEAR IN FOOTER
// ============================================================================

const yearElement = document.getElementById('year');
if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

// ============================================================================
// PREVENT HORIZONTAL SCROLL
// ============================================================================

document.body.style.overflowX = 'hidden';
document.documentElement.style.overflowX = 'hidden';
