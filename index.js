// ============================================================================
// NAVIGATION TOGGLE - FIXED VERSION
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
// SMOOTH SCROLLING FOR ANCHOR LINKS
// ============================================================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 100;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================================================
// PORTFOLIO FILTERING
// ============================================================================

const filterButtons = document.querySelectorAll('.filter-btn');
const featuredItems = document.querySelectorAll('.portfolio-featured-item');
const compactGrid = document.querySelector('.portfolio-compact-grid');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Get filter value
        const filterValue = button.getAttribute('data-filter');
        
        // Filter featured items
        featuredItems.forEach(item => {
            const category = item.getAttribute('data-category');
            
            if (filterValue === 'all') {
                showItem(item);
            } else if (category === filterValue) {
                showItem(item);
            } else {
                hideItem(item);
            }
        });
        
        // Show/hide compact grid
        if (compactGrid) {
            if (filterValue === 'all' || filterValue === 'website') {
                showItem(compactGrid);
            } else {
                hideItem(compactGrid);
            }
        }
    });
});

function showItem(item) {
    item.style.display = 'grid';
    setTimeout(() => {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
    }, 10);
}

function hideItem(item) {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    setTimeout(() => {
        item.style.display = 'none';
    }, 300);
}

// Add transition styles to portfolio items
featuredItems.forEach(item => {
    item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
});

if (compactGrid) {
    compactGrid.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
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
// ACTIVE NAV LINK ON SCROLL
// ============================================================================

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a[href^="#"]');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ============================================================================
// FORM SUBMISSION HANDLER
// ============================================================================

const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Here you would normally send to your backend
        console.log('Form submitted:', data);
        
        // Show success message (you can customize this)
        alert('Thank you! I\'ll get back to you within 24 hours.');
        
        // Reset form
        contactForm.reset();
    });
}

// ============================================================================
// SCROLL REVEAL ANIMATION
// ============================================================================

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

// Observe service cards
document.querySelectorAll('.service-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Observe featured portfolio items
document.querySelectorAll('.portfolio-featured-item').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(40px)';
    item.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(item);
});

// Observe compact items
document.querySelectorAll('.compact-item').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(item);
});

// Observe FAQ items
document.querySelectorAll('.faq-mini-item').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(item);
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