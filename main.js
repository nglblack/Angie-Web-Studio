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
// ==============================
// Template Filtering Functionality
// ==============================

const initTemplateFiltering = () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const templateCards = document.querySelectorAll('.template-grid .template-card');
    
    // Exit if no filter elements found (not on templates page)
    if (filterButtons.length === 0 || templateCards.length === 0) return;
    
    // Filter function
    const filterTemplates = (category) => {
        templateCards.forEach((card, index) => {
            const cardCategory = card.getAttribute('data-category');
            const shouldShow = category === 'all' || cardCategory === category;
            
            if (shouldShow) {
                // Remove hidden class and add stagger delay for animation
                setTimeout(() => {
                    card.classList.remove('hidden', 'filtered-out');
                    card.style.animationDelay = `${index * 0.1}s`;
                }, index * 50);
            } else {
                // Add hidden class immediately
                card.classList.add('hidden');
                // Add filtered-out class after animation completes
                setTimeout(() => {
                    card.classList.add('filtered-out');
                }, 300);
            }
        });
        
        // Update the visible count after filtering
        setTimeout(() => {
            updateResultsCount(category);
        }, 500);
    };
    
    // Update results count (optional visual feedback)
    const updateResultsCount = (category) => {
        const visibleCards = document.querySelectorAll('.template-card:not(.filtered-out)');
        const resultsInfo = document.querySelector('.results-info');
        
        if (resultsInfo) {
            const count = visibleCards.length;
            const categoryText = category === 'all' ? 'templates' : `${category.replace('-', ' ')} templates`;
            resultsInfo.textContent = `Showing ${count} ${categoryText}`;
        }
    };
    
    // Add click event listeners to filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Get the filter category
            const filterValue = button.getAttribute('data-filter');
            
            // Apply the filter
            filterTemplates(filterValue);
            
            // Update URL hash for bookmarking (optional)
            if (filterValue !== 'all') {
                window.history.replaceState(null, null, `#${filterValue}`);
            } else {
                window.history.replaceState(null, null, window.location.pathname);
            }
            
            // Scroll to template grid on mobile
            if (window.innerWidth <= 768) {
                const templateGrid = document.querySelector('.template-grid');
                if (templateGrid) {
                    templateGrid.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                    });
                }
            }
        });
        
        // Add keyboard support
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                button.click();
            }
        });
    });
    
    // Check URL hash on page load for deep linking
    const initializeFromHash = () => {
        const hash = window.location.hash.replace('#', '');
        if (hash && document.querySelector(`[data-filter="${hash}"]`)) {
            const targetButton = document.querySelector(`[data-filter="${hash}"]`);
            if (targetButton) {
                targetButton.click();
            }
        } else {
            // Default to showing all templates
            filterTemplates('all');
        }
    };
    
    // Search functionality (bonus feature)
    const initTemplateSearch = () => {
        const searchInput = document.querySelector('.template-search-input');
        if (!searchInput) return;
        
        let searchTimeout;
        
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value.toLowerCase().trim();
            
            // Debounce search for better performance
            searchTimeout = setTimeout(() => {
                templateCards.forEach(card => {
                    const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
                    const description = card.querySelector('p')?.textContent.toLowerCase() || '';
                    const features = Array.from(card.querySelectorAll('.template-features span'))
                        .map(span => span.textContent.toLowerCase()).join(' ');
                    
                    const searchContent = `${title} ${description} ${features}`;
                    const matches = !query || searchContent.includes(query);
                    
                    if (matches) {
                        card.classList.remove('search-hidden');
                    } else {
                        card.classList.add('search-hidden');
                    }
                });
            }, 300);
        });
    };
    
    // Initialize everything
    initializeFromHash();
    initTemplateSearch();
    
    // Handle browser back/forward
    window.addEventListener('hashchange', initializeFromHash);
    
    // Add CSS class for search hidden state
    const style = document.createElement('style');
    style.textContent = `
        .template-card.search-hidden {
            display: none !important;
        }
        
        .results-info {
            text-align: center;
            margin: 1rem 0;
            color: var(--secondary);
            font-style: italic;
        }
    `;
    document.head.appendChild(style);
};

// ==============================
// Template Card Interactions
// ==============================

const initTemplateCardInteractions = () => {
    const templateCards = document.querySelectorAll('.template-card');
    
    templateCards.forEach(card => {
        // Add click tracking for analytics (optional)
        const viewDemoBtn = card.querySelector('.btn');
        if (viewDemoBtn) {
            viewDemoBtn.addEventListener('click', (e) => {
                const templateTitle = card.querySelector('.card-title')?.textContent;
                const templateCategory = card.getAttribute('data-category');
                
                // Track template demo views (replace with your analytics)
                console.log(`Template demo viewed: ${templateTitle} (${templateCategory})`);
            });
        }
        
        // Add hover effect for feature tags
        const featureTags = card.querySelectorAll('.template-features span');
        featureTags.forEach(tag => {
            tag.addEventListener('mouseenter', () => {
                tag.style.transform = 'translateY(-2px)';
                tag.style.boxShadow = '0 4px 8px rgba(109, 0, 26, 0.2)';
            });
            
            tag.addEventListener('mouseleave', () => {
                tag.style.transform = '';
                tag.style.boxShadow = '';
            });
        });
    });
};

// ==============================
// Mobile Filter Improvements
// ==============================

const initMobileFilterEnhancements = () => {
    const filterSidebar = document.querySelector('.filter-sidebar');
    const filterOptions = document.querySelector('.filter-options');
    
    if (!filterSidebar || !filterOptions) return;
    
    // Add touch scrolling indicators for mobile
    if (window.innerWidth <= 768) {
        filterOptions.classList.add('mobile-scroll');
        
        // Add scroll indicators
        const scrollIndicator = document.createElement('div');
        scrollIndicator.className = 'scroll-indicator';
        scrollIndicator.innerHTML = '<i class="fas fa-chevron-right"></i>';
        filterOptions.appendChild(scrollIndicator);
        
        // Hide indicator when scrolled to end
        filterOptions.addEventListener('scroll', () => {
            const isAtEnd = filterOptions.scrollLeft >= 
                (filterOptions.scrollWidth - filterOptions.clientWidth - 10);
            scrollIndicator.style.opacity = isAtEnd ? '0' : '1';
        });
    }
};

// ==============================
// Bundle Card Animations
// ==============================

const initBundleAnimations = () => {
    const bundleCards = document.querySelectorAll('.featured-bundle');
    
    bundleCards.forEach((card, index) => {
        // Stagger the entrance animations
        card.style.animationDelay = `${index * 0.2}s`;
        
        // Add parallax effect to bundle badges
        const badge = card.querySelector('.bundle-badge');
        if (badge) {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const xPercent = (x / rect.width - 0.5) * 10;
                const yPercent = (y / rect.height - 0.5) * 10;
                
                badge.style.transform = `translate(${xPercent}px, ${yPercent}px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                badge.style.transform = '';
            });
        }
    });
};

// ==============================
// Initialize All Template Page Functions
// ==============================

const initTemplatePage = () => {
    initTemplateFiltering();
    initTemplateCardInteractions();
    initMobileFilterEnhancements();
    initBundleAnimations();
};

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTemplatePage);
} else {
    initTemplatePage();
}

// Also initialize when navigating to the page (for SPAs)
window.addEventListener('load', initTemplatePage);

// Guided Decision Tool JavaScript 

    // Guided Decision Tool Logic
const initGuidedDecisionTool = () => {
    const businessTypeSelect = document.getElementById('business-type');
    const formNeedsSelect = document.getElementById('form-needs');
    const complexitySelect = document.getElementById('complexity-level');
    const findTemplatesBtn = document.getElementById('find-templates-btn');
    const resetBtn = document.getElementById('reset-decision-btn');
    
    // Check if elements exist (in case we're not on templates page)
    if (!businessTypeSelect || !formNeedsSelect || !complexitySelect) return;
    
    // Template matching logic
    const templateMatchingRules = {
        'event': {
            categories: ['event', 'bundle'],
            description: 'event organizers and community builders',
            keywords: ['Event', 'RSVP', 'Community', 'Launch']
        },
        'local-service': {
            categories: ['local-service', 'bundle'],
            description: 'local service providers and professionals',
            keywords: ['Professional', 'Service', 'Business', 'Solo']
        },
        'creative': {
            categories: ['creative', 'bundle'],
            description: 'entertainers and creative professionals',
            keywords: ['Portfolio', 'Performer', 'Creative', 'Gallery']
        },
        'utility': {
            categories: ['utility'],
            description: 'simple utility pages and placeholders',
            keywords: ['Simple', 'Basic', 'Coming Soon', 'FAQ']
        }
    };
    
    const formMatchingRules = {
        'contact': ['contact'],
        'rsvp': ['rsvp', 'event'],
        'booking': ['booking', 'appointment'],
        'none': ['none']
    };
    
    const complexityMatchingRules = {
        'simple': ['simple', 'one-page'],
        'detailed': ['detailed', 'multi-section'],
        'portfolio': ['portfolio', 'gallery']
    };
    
    // Enable/disable find button based on selections
    const checkFormCompletion = () => {
        const allSelected = businessTypeSelect.value && 
                           formNeedsSelect.value && 
                           complexitySelect.value;
        
        findTemplatesBtn.disabled = !allSelected;
        
        if (allSelected) {
            findTemplatesBtn.classList.add('pulse-ready');
        } else {
            findTemplatesBtn.classList.remove('pulse-ready');
        }
    };
    
    // Add event listeners to all selects
    [businessTypeSelect, formNeedsSelect, complexitySelect].forEach(select => {
        select.addEventListener('change', checkFormCompletion);
    });
    
    // Find templates based on selections
    const findMatchingTemplates = () => {
        const businessType = businessTypeSelect.value;
        const formNeeds = formNeedsSelect.value;
        const complexity = complexitySelect.value;
        
        if (!businessType || !formNeeds || !complexity) {
            return;
        }
        
        // Get template matching rules
        const businessRules = templateMatchingRules[businessType];
        const formRules = formMatchingRules[formNeeds];
        const complexityRules = complexityMatchingRules[complexity];
        
        // Show visual feedback and filter templates
        // ONLY filter templates in the main gallery, NOT the featured section
        const templateCards = document.querySelectorAll('.template-grid .template-card');
        let matchingCount = 0;
        
        templateCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            const cardForm = card.getAttribute('data-form');
            const cardDetail = card.getAttribute('data-detail');
            const cardTitle = card.querySelector('.card-title').textContent;
            const cardDescription = card.querySelector('p').textContent;
            const cardText = `${cardTitle} ${cardDescription}`.toLowerCase();
            
            // Check business type match
            const businessMatch = businessRules.categories.includes(cardCategory);
            
            // Check form needs match (using data attributes and keywords)
            let formMatch = false;
            if (formNeeds === 'none') {
                formMatch = cardForm === 'none' || (!cardText.includes('form') && !cardText.includes('rsvp') && !cardText.includes('booking'));
            } else {
                formMatch = cardForm === formNeeds || formRules.some(keyword => 
                    cardText.includes(keyword.toLowerCase()) || 
                    cardTitle.toLowerCase().includes(keyword.toLowerCase())
                );
            }
            
            // Check complexity match (using data attributes and keywords)
            const complexityMatch = cardDetail === complexity || complexityRules.some(keyword => 
                cardText.includes(keyword.toLowerCase()) ||
                (complexity === 'simple' && (cardText.includes('one-page') || cardText.includes('basic'))) ||
                (complexity === 'detailed' && (cardText.includes('multi') || cardText.includes('section'))) ||
                (complexity === 'portfolio' && (cardText.includes('gallery') || cardText.includes('portfolio')))
            );
            
            // Score the match (business type is most important)
            let matchScore = 0;
            if (businessMatch) matchScore += 3;
            if (formMatch) matchScore += 2;
            if (complexityMatch) matchScore += 1;
            
            if (matchScore >= 3) { // Must at least match business type
                card.classList.remove('hidden', 'filtered-out');
                matchingCount++;
            } else {
                card.classList.add('hidden');
                setTimeout(() => {
                    card.classList.add('filtered-out');
                }, 300);
            }
        });
        
        // Update filter buttons to show custom filtering is active
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add visual feedback to the button
        findTemplatesBtn.innerHTML = `<i class="fas fa-check"></i> Found ${matchingCount} Perfect Match${matchingCount !== 1 ? 'es' : ''}!`;
        findTemplatesBtn.style.background = '#28a745';
        
        // Reset button text after 3 seconds
        setTimeout(() => {
            findTemplatesBtn.innerHTML = `<i class="fas fa-search"></i> Find My Templates`;
            findTemplatesBtn.style.background = '';
        }, 3000);
        
        // Smooth scroll to see filtered results
        if (matchingCount > 0) {
            const filterSidebar = document.querySelector('.filter-sidebar');
            if (filterSidebar) {
                setTimeout(() => {
                    filterSidebar.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                    });
                }, 400);
            }
        }
    };
    
    // Reset form
    const resetForm = () => {
        businessTypeSelect.value = '';
        formNeedsSelect.value = '';
        complexitySelect.value = '';
        findTemplatesBtn.disabled = true;
        findTemplatesBtn.classList.remove('pulse-ready');
        
        // Reset button text and style
        findTemplatesBtn.innerHTML = `<i class="fas fa-search"></i> Find My Templates`;
        findTemplatesBtn.style.background = '';
        
        // Reset template visibility - ONLY in the main gallery
        const templateCards = document.querySelectorAll('.template-grid .template-card');
        templateCards.forEach(card => {
            card.classList.remove('hidden', 'filtered-out');
        });
        
        // Reset filter buttons
        const allBtn = document.querySelector('[data-filter="all"]');
        if (allBtn) {
            const filterButtons = document.querySelectorAll('.filter-btn');
            filterButtons.forEach(btn => btn.classList.remove('active'));
            allBtn.classList.add('active');
        }
    };
    
    // Event listeners
    findTemplatesBtn.addEventListener('click', findMatchingTemplates);
    resetBtn.addEventListener('click', resetForm);
};

// Initialize the guided decision tool when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGuidedDecisionTool);
} else {
    initGuidedDecisionTool();
}