// ==============================
// Angie Web Studio – Universal Core JavaScript
// ==============================

// ==============================
// MOBILE NAVIGATION
// ==============================
// ==============================
// MOBILE NAVIGATION
// ==============================
const initMobileNavigation = () => {
    const navToggle = document.querySelector('.nav-toggle');
    const navClose = document.querySelector('.nav-close');
    const nav = document.querySelector('nav');
    const overlay = document.querySelector('.overlay');

    if (!navToggle || !nav || !overlay) return;

navToggle.addEventListener('click', () => {
    console.log('🍔 Adding hidden class to hamburger');
    nav.classList.add('active');
    overlay.classList.add('active');
    navToggle.classList.add('hidden'); // Hide hamburger
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
});
    const closeNav = () => {
    nav.classList.remove('active');
    overlay.classList.remove('active');
    navToggle.classList.remove('hidden'); // Show hamburger again
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
};
    // Close navigation event listeners
    if (navClose) {
        navClose.addEventListener('click', closeNav);
    }
    overlay.addEventListener('click', closeNav);

    // Close navigation on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('active')) {
            closeNav();
        }
    });
};
// ==============================
// SCROLL TO TOP BUTTON
// ==============================
const initScrollToTop = () => {
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.classList.add('scroll-top');
    scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollTopBtn);

    // Show/hide button based on scroll position
    const toggleScrollButton = () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('active');
        } else {
            scrollTopBtn.classList.remove('active');
        }
    };

    // Scroll to top functionality
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Listen for scroll events
    window.addEventListener('scroll', toggleScrollButton);

    return scrollTopBtn;
};

// ==============================
// HEADER SCROLL EFFECTS
// ==============================
const initHeaderScrollEffects = () => {
    const header = document.querySelector('header');
    if (!header) return;

    const handleHeaderScroll = () => {
        if (window.pageYOffset > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleHeaderScroll);
};

// ==============================
// SCROLL ANIMATIONS
// ==============================
const initScrollAnimations = () => {
    const scrollElements = document.querySelectorAll(
        '.feature-item, .card, .testimonial, .template-card, .portfolio-card, .about-image, .about-content, .belief-item, .scroll-animation'
    );

    if (scrollElements.length === 0) return;

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

    // Listen for scroll events
    window.addEventListener('scroll', handleScrollAnimation);
    
    // Run on page load
    window.addEventListener('load', handleScrollAnimation);
    
    // Run immediately in case page is already loaded
    handleScrollAnimation();
};

// ==============================
// FAQ ACCORDION
// ==============================
const initFAQAccordion = () => {
    const faqItems = document.querySelectorAll('.faq-accordion-item');
    
    if (faqItems.length === 0) return;
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (!question || !answer) return;

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherQuestion = otherItem.querySelector('.faq-question');
                    if (otherQuestion) {
                        otherQuestion.setAttribute('aria-expanded', 'false');
                    }
                }
            });
            
            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
            } else {
                item.classList.remove('active');
                question.setAttribute('aria-expanded', 'false');
            }
        });
        
        // Add keyboard support
        question.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                question.click();
            }
        });
        
        // Set initial accessibility attributes
        question.setAttribute('tabindex', '0');
        question.setAttribute('role', 'button');
        question.setAttribute('aria-expanded', 'false');
    });
};

// ==============================
// SMOOTH SCROLLING FOR ANCHOR LINKS
// ==============================
const initSmoothScrolling = () => {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Skip if it's just a hash
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
};

// ==============================
// FORM ENHANCEMENT
// ==============================
const initFormEnhancements = () => {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // Add loading state to submit buttons
        const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
        
        if (submitBtn) {
            form.addEventListener('submit', (e) => {
                submitBtn.disabled = true;
                const originalText = submitBtn.textContent || submitBtn.value;
                
                if (submitBtn.tagName === 'BUTTON') {
                    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                } else {
                    submitBtn.value = 'Sending...';
                }
                
                // Re-enable after 3 seconds (in case form doesn't redirect)
                setTimeout(() => {
                    submitBtn.disabled = false;
                    if (submitBtn.tagName === 'BUTTON') {
                        submitBtn.textContent = originalText;
                    } else {
                        submitBtn.value = originalText;
                    }
                }, 3000);
            });
        }
        
        // Add focus styles to form inputs
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement?.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                input.parentElement?.classList.remove('focused');
            });
        });
    });
};

// ==============================
// UTILITY FUNCTIONS
// ==============================

// Debounce function for performance optimization
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Check if element is in viewport
const isInViewport = (element) => {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};

// Add ripple effect to buttons
const addRippleEffect = (button, event) => {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
    `;
    
    // Add ripple animation keyframes if not already added
    if (!document.getElementById('ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
        ripple.remove();
    }, 600);
};

// ==============================
// BUTTON ENHANCEMENTS
// ==============================
const initButtonEnhancements = () => {
    const buttons = document.querySelectorAll('.btn:not(.no-ripple)');
    
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            addRippleEffect(button, e);
        });
        
        // Add focus visible for keyboard navigation
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                button.classList.add('focus-visible');
            }
        });
        
        button.addEventListener('blur', () => {
            button.classList.remove('focus-visible');
        });
    });
};

// ==============================
// INITIALIZATION
// ==============================
const initializeCore = () => {
    // Initialize all core functionality
    initMobileNavigation();
    initScrollToTop();
    initHeaderScrollEffects();
    initScrollAnimations();
    initFAQAccordion();
    initSmoothScrolling();
    initFormEnhancements();
    initButtonEnhancements();
    
    // Add body class when JS is loaded
    document.body.classList.add('js-loaded');
};

// Initialize when DOM is ready - Enhanced version
const domReady = (fn) => {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fn);
    } else {
        setTimeout(fn, 0); // Ensures it runs after current call stack
    }
};

// Initialize everything
domReady(() => {
    initializeCore();
    
    // Debug: Check if nav close button exists
    const navClose = document.querySelector('.nav-close');
    console.log('Nav close button found:', navClose ? 'YES' : 'NO');
    
    // Additional failsafe - re-initialize mobile nav after a short delay
    setTimeout(() => {
        initMobileNavigation();
    }, 100);
});

// Also run on window load for any late-loading content
window.addEventListener('load', () => {
    // Re-run scroll animations in case content loaded after DOM ready
    initScrollAnimations();
});

// Export functions for use in other scripts (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initMobileNavigation,
        initScrollToTop,
        initHeaderScrollEffects,
        initScrollAnimations,
        initFAQAccordion,
        initSmoothScrolling,
        initFormEnhancements,
        initButtonEnhancements,
        debounce,
        isInViewport,
        addRippleEffect
    };
}