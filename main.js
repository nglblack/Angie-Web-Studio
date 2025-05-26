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
        navToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    });

    const closeNav = () => {
        nav.classList.remove('active');
        overlay.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    };

    navClose.addEventListener('click', closeNav);
    overlay.addEventListener('click', closeNav);
}


// Scroll to Top Button
const scrollTopBtn = document.createElement('button');
scrollTopBtn.classList.add('scroll-top');
scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
document.body.appendChild(scrollTopBtn);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollTopBtn.classList.add('active');
    } else {
        scrollTopBtn.classList.remove('active');
    }

    const header = document.querySelector('header');
    if (header) {
        if (window.pageYOffset > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    handleScrollAnimation();
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Scroll Animation
const scrollElements = document.querySelectorAll(
    '.feature-item, .card, .testimonial, .template-card, .portfolio-card, .about-image, .about-content, .belief-item'
);

const elementInView = (el, percentageScroll = 90) => {
    const elementTop = el.getBoundingClientRect().top;
    return elementTop <= ((window.innerHeight || document.documentElement.clientHeight) * (percentageScroll / 100));
};

const displayScrollElement = el => el.classList.add('in-view');
const hideScrollElement = el => el.classList.remove('in-view');

const handleScrollAnimation = () => {
    scrollElements.forEach(el => {
        if (elementInView(el)) {
            displayScrollElement(el);
        } else {
            hideScrollElement(el);
        }
    });
};

window.addEventListener('load', handleScrollAnimation);

// FAQ Accordion functionality
const initFAQAccordion = () => {
    const faqItems = document.querySelectorAll('.faq-accordion-item');
    
    if (faqItems.length === 0) return; // Exit if no FAQ items found
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (question && answer) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                if (!isActive) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
            
            // Add keyboard support
            question.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    question.click();
                }
            });
            
            // Make focusable for accessibility
            question.setAttribute('tabindex', '0');
            question.setAttribute('role', 'button');
            question.setAttribute('aria-expanded', 'false');
            
            // Update aria-expanded when item becomes active
            const observer = new MutationObserver(() => {
                const isActive = item.classList.contains('active');
                question.setAttribute('aria-expanded', isActive.toString());
            });
            
            observer.observe(item, {
                attributes: true,
                attributeFilter: ['class']
            });
        }
    });
};

// Initialize FAQ accordion when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFAQAccordion);
} else {
    initFAQAccordion();
}