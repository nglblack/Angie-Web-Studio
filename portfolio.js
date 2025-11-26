// ============================================================================
// NAVIGATION TOGGLE
// ============================================================================

const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('nav');
const navClose = document.querySelector('.nav-close');
const overlay = document.querySelector('.overlay');
const body = document.body;

// Open navigation
if (navToggle) {
    navToggle.addEventListener('click', () => {
        nav.classList.add('active');
        overlay.classList.add('active');
        navToggle.classList.add('hidden');
        body.style.overflow = 'hidden';
    });
}

// Close navigation
if (navClose) {
    navClose.addEventListener('click', closeNav);
}

if (overlay) {
    overlay.addEventListener('click', closeNav);
}

function closeNav() {
    nav.classList.remove('active');
    overlay.classList.remove('active');
    navToggle.classList.remove('hidden');
    body.style.overflow = '';
}

// Close nav when clicking on a link
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
        closeNav();
    });
});

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
// SCROLL REVEAL ANIMATION - DISABLED FOR NOW
// ============================================================================

// Commenting out scroll reveal as it may be hiding content
// Uncomment once CSS is fully working

/*
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe portfolio cards
document.querySelectorAll('.portfolio-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});
*/

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
