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
// ==============================
// Certificate Modal Functionality  
// ==============================

const initCertificateModal = () => {
    // Create modal HTML
    const modalHTML = `
        <div id="certificate-modal" class="cert-modal">
            <div class="cert-modal-overlay"></div>
            <div class="cert-modal-content">
                <button class="cert-modal-close" aria-label="Close certificate viewer">
                    <i class="fas fa-times"></i>
                </button>
                <div class="cert-modal-body">
                    <img id="cert-modal-image" src="" alt="" class="cert-modal-img">
                    <div class="cert-modal-info">
                        <h3 id="cert-modal-title"></h3>
                        <p id="cert-modal-date"></p>
                        <a id="cert-modal-verify" href="#" target="_blank" class="btn btn-outline">
                            <i class="fas fa-external-link-alt"></i>
                            Verify Certificate
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Certificate data mapping
    const certificateData = {
        'ux-design.png': {
            title: 'Google UX Design Professional Certificate',
            date: 'Completed June 22, 2024',
            verifyUrl: 'https://coursera.org/verify/professional-cert/GE4YJJJCZEKL'
        },
        'foundations-of-user-experience.png': {
            title: 'Foundations of User Experience (UX) Design',
            date: 'Completed May 11, 2024',
            verifyUrl: 'https://coursera.org/verify/D4PAFS35M69P'
        },
        'start-ux-design-process-empathize-define-and-ideate.png': {
            title: 'Start the UX Design Process: Empathize, Define, and Ideate',
            date: 'Completed May 30, 2024',
            verifyUrl: 'https://coursera.org/verify/GAP3MGNSB495'
        },
        'build-wireframes-low-fidelity-prototypes.png': {
            title: 'Build Wireframes and Low-Fidelity Prototypes',
            date: 'Completed June 12, 2024',
            verifyUrl: 'https://coursera.org/verify/VGZDTT4ND9XM'
        },
        'conduct-uxresearch-test-early-concepts.png': {
            title: 'Conduct UX Research and Test Early Concepts',
            date: 'Completed June 15, 2024',
            verifyUrl: 'https://coursera.org/verify/X3PQ6X7DC222'
        },
        'create-high-fidelity-designs.png': {
            title: 'Create High-Fidelity Designs and Prototypes in Figma',
            date: 'Completed June 17, 2024',
            verifyUrl: 'https://coursera.org/verify/8528459LUP3R'
        },
        'build-dynamic-user-interfaces.png': {
            title: 'Build Dynamic User Interfaces (UI) for Websites',
            date: 'Completed June 20, 2024',
            verifyUrl: 'https://coursera.org/verify/QVCMUNYPSCXS'
        },
        'design-a-user-experience-for-social-good.png': {
            title: 'Design a User Experience for Social Good & Prepare for Jobs',
            date: 'Completed June 22, 2024',
            verifyUrl: 'https://coursera.org/verify/QCCH43MGRSV9'
        }
    };

    // Get modal elements
    const modal = document.getElementById('certificate-modal');
    const modalImage = document.getElementById('cert-modal-image');
    const modalTitle = document.getElementById('cert-modal-title');
    const modalDate = document.getElementById('cert-modal-date');
    const modalVerify = document.getElementById('cert-modal-verify');
    const modalClose = document.querySelector('.cert-modal-close');
    const modalOverlay = document.querySelector('.cert-modal-overlay');

    // Function to open modal
    const openModal = (imageSrc, imageAlt) => {
        const filename = imageSrc.split('/').pop();
        const certData = certificateData[filename];

        if (certData) {
            modalImage.src = imageSrc;
            modalImage.alt = imageAlt;
            modalTitle.textContent = certData.title;
            modalDate.textContent = certData.date;
            modalVerify.href = certData.verifyUrl;
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        modalClose.focus();
    };

    // Function to close modal
    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    // Add click listeners to all certificate images
    const addCertificateListeners = () => {
        // Main certificate image
        const mainCertImage = document.querySelector('.certificate-image');
        if (mainCertImage) {
            mainCertImage.addEventListener('click', () => {
                const img = mainCertImage.querySelector('.cert-img');
                openModal(img.src, img.alt);
            });
        }

        // Individual certificate thumbnails
        const certItems = document.querySelectorAll('.cert-image-container');
        certItems.forEach(container => {
            container.addEventListener('click', () => {
                const img = container.querySelector('.cert-thumbnail');
                openModal(img.src, img.alt);
            });
        });
    };

    // Close modal event listeners
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (modal.classList.contains('active') && e.key === 'Escape') {
            closeModal();
        }
    });

    // Initialize listeners
    addCertificateListeners();
};

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCertificateModal);
} else {
    initCertificateModal();
}
// ============================================================================
// BRAND DISCOVERY SECTION - INTERACTIVE FEATURES (Optional)
// ============================================================================

// Initialize brand discovery interactions when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initBrandDiscoveryInteractions();
});

function initBrandDiscoveryInteractions() {
    // Add click interaction to mock options in the browser preview
    const mockOptions = document.querySelectorAll('.mock-option');
    let selectedOption = null;
    
    mockOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selection from other options
            mockOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add selection to clicked option
            this.classList.add('selected');
            selectedOption = this;
            
            // Update progress bar
            updateMockProgress();
            
            // Add visual feedback
            this.style.transform = 'translateY(-2px) scale(1.05)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
        
        // Add hover effects
        option.addEventListener('mouseenter', function() {
            if (!this.classList.contains('selected')) {
                this.style.transform = 'translateY(-2px)';
            }
        });
        
        option.addEventListener('mouseleave', function() {
            if (!this.classList.contains('selected')) {
                this.style.transform = '';
            }
        });
    });
    
    // Add click tracking for the CTA button
    const ctaButton = document.querySelector('.brand-cta-btn');
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            // Add ripple effect
            createRippleEffect(this, e);
            
            // Optional: Track the click for analytics
            // gtag('event', 'click', {
            //     event_category: 'Brand Discovery',
            //     event_label: 'Start Brand Discovery CTA'
            // });
        });
    }
    
    // Add card hover interactions
    const discoveryCard = document.querySelector('.brand-discovery-card');
    if (discoveryCard) {
        discoveryCard.addEventListener('mouseenter', function() {
            // Pause the progress animation on hover for better UX
            const progressFill = document.querySelector('.mock-progress-fill');
            if (progressFill) {
                progressFill.style.animationPlayState = 'paused';
            }
        });
        
        discoveryCard.addEventListener('mouseleave', function() {
            // Resume the progress animation
            const progressFill = document.querySelector('.mock-progress-fill');
            if (progressFill) {
                progressFill.style.animationPlayState = 'running';
            }
        });
    }
    
    // Add intersection observer for scroll animations
    addScrollAnimations();
}

// Update the mock progress bar when an option is selected
function updateMockProgress() {
    const progressFill = document.querySelector('.mock-progress-fill');
    const statusText = document.querySelector('.mock-status');
    
    if (progressFill && statusText) {
        // Animate progress to next stage
        progressFill.style.animation = 'none';
        progressFill.style.width = '80%';
        
        // Update status text
        statusText.textContent = 'Module 2 of 5 starting...';
        statusText.style.color = 'var(--primary)';
        
        // Reset after a moment
        setTimeout(() => {
            progressFill.style.animation = 'brandProgressPulse 2s ease-in-out infinite';
            progressFill.style.width = '60%';
            statusText.textContent = 'Module 1 of 5 complete...';
            statusText.style.color = 'var(--secondary)';
        }, 2000);
    }
}

// Create ripple effect for button clicks
function createRippleEffect(button, event) {
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
}

// Add scroll-triggered animations
function addScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Add staggered animation to benefit items
                const benefitItems = entry.target.querySelectorAll('.benefit-item');
                benefitItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateX(0)';
                    }, index * 100);
                });
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });
    
    const discoverySection = document.querySelector('.brand-discovery-section');
    if (discoverySection) {
        observer.observe(discoverySection);
        
        // Set initial state for benefit items
        const benefitItems = discoverySection.querySelectorAll('.benefit-item');
        benefitItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });
    }
}

// Add CSS class for selected mock options
const additionalStyles = `
    .mock-option.selected {
        background: rgba(109, 0, 26, 0.15) !important;
        border-color: var(--primary) !important;
        color: var(--primary-dark) !important;
        font-weight: 600 !important;
        transform: translateY(-2px) scale(1.05) !important;
        box-shadow: 0 4px 12px rgba(109, 0, 26, 0.2) !important;
    }
    
    .brand-discovery-section.animate-in .brand-discovery-card {
        animation: slideInUp 0.8s ease forwards;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

// Add the additional styles to the page
if (!document.getElementById('brand-discovery-additional-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'brand-discovery-additional-styles';
    styleSheet.textContent = additionalStyles;
    document.head.appendChild(styleSheet);
}