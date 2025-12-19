// ==============================
// Angie Web Studio – Main Script
// ==============================

// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navClose = document.querySelector('.nav-close');
const nav = document.querySelector('nav');
const overlay = document.querySelector('.overlay');

if (navToggle && nav && overlay) {
    navToggle.addEventListener('click', () => {
        nav.classList.add('active');
        overlay.classList.add('active');
        navToggle.classList.add('hidden');
        navToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    });

    const closeNav = () => {
        nav.classList.remove('active');
        overlay.classList.remove('active');
        navToggle.classList.remove('hidden');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    };

    navClose.addEventListener('click', closeNav);
    overlay.addEventListener('click', closeNav);
}

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (header) {
        if (window.pageYOffset > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
});

// Update copyright year
const yearSpan = document.getElementById('year');
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}