// ==============================
// Angie Web Studio – Advanced Templates Page JavaScript
// Comprehensive filtering, discovery, and interactive system
// ==============================

class TemplatesPageManager {
    constructor() {
        this.templateData = null;
        this.currentFilters = {
            category: 'all',
            search: '',
            complexity: '',
            features: ''
        };
        this.activeModal = null;
        this.debounceTimers = {};
        
        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    // ==============================
    // INITIALIZATION
    // ==============================
    init() {
        try {
            this.loadTemplateData();
            this.initializeElements();
            
            // Fix missing data attributes before binding events
            this.fixMissingDataAttributes();
            
            this.bindEvents();
            this.setupKeyboardNavigation();
            this.initializeFromURL();
            
            console.log('Templates page initialized successfully');
            
            // Debug specific button if it's still not working
            const problematicButton = document.querySelector("#popular-templates > div > div:nth-child(3) > button");
            if (problematicButton) {
                console.log('Found the problematic button:', problematicButton);
                this.bindSpecificButton("#popular-templates > div > div:nth-child(3) > button");
            } else {
                console.log('Problematic button not found, debugging...');
                this.debugButtonSelector("#popular-templates > div > div:nth-child(3) > button");
            }
            
        } catch (error) {
            console.error('Failed to initialize templates page:', error);
        }
    }

    loadTemplateData() {
        const dataScript = document.getElementById('template-data');
        if (dataScript) {
            try {
                this.templateData = JSON.parse(dataScript.textContent);
            } catch (error) {
                console.error('Failed to parse template data:', error);
                this.templateData = { whyThisWorks: {}, userTypeMapping: {}, recommendations: {} };
            }
        } else {
            console.warn('Template data script not found');
            this.templateData = { whyThisWorks: {}, userTypeMapping: {}, recommendations: {} };
        }
    }

    initializeElements() {
        // Cache DOM elements for better performance
        this.elements = {
            // Sections
            guidedDiscovery: document.querySelector('.guided-discovery-section'),
            browseAllSection: document.querySelector('.browse-all-section'),
            recommendationsSection: document.querySelector('.recommendations-section'),
            
            // Guided discovery
            guidedQuestionBtns: document.querySelectorAll('.guided-question-btn'),
            browseAllBtns: document.querySelectorAll('.browse-all-btn'),
            
            // Filtering
            categoryFilterCards: document.querySelectorAll('.category-filter-card'),
            searchInput: document.getElementById('template-search') || document.querySelector('.search-input'),
            searchClearBtn: document.querySelector('.search-clear-btn'),
            complexityFilter: document.getElementById('complexity-filter'),
            featuresFilter: document.getElementById('features-filter'),
            clearAllFilters: document.querySelector('.clear-all-filters'),
            
            // Template cards
            templateCards: document.querySelectorAll('.template-card'),
            allTemplatesGrid: document.querySelector('.all-templates-grid'),
            
            // Results
            resultsCount: document.querySelector('.results-count'),
            searchResultsSummary: document.querySelector('.search-results-summary'),
            
            // Modals and interactions
            whyThisWorksBtns: document.querySelectorAll('.why-this-works-btn'),
            moreLikeThisBtns: document.querySelectorAll('.more-like-this-btn'),
            modal: document.getElementById('why-this-works-modal'),
            modalOverlay: document.querySelector('.modal-overlay'),
            modalClose: document.querySelector('.modal-close'),
            modalBody: document.querySelector('.modal-body'),
            
            // Recommendations
            recommendationsGrid: document.querySelector('.recommendations-grid'),
            recommendationsTitle: document.querySelector('.recommendations-title'),
            closeRecommendations: document.querySelector('.close-recommendations')
        };

        // Create missing elements if needed
        this.createMissingElements();
    }

    createMissingElements() {
        // Create search clear button if it doesn't exist
        if (this.elements.searchInput && !this.elements.searchClearBtn) {
            const clearBtn = document.createElement('button');
            clearBtn.className = 'search-clear-btn';
            clearBtn.innerHTML = '<i class="fas fa-times"></i>';
            clearBtn.style.display = 'none';
            
            const container = this.elements.searchInput.closest('.search-input-container') || 
                            this.elements.searchInput.parentElement;
            if (container) {
                container.style.position = 'relative';
                container.appendChild(clearBtn);
                this.elements.searchClearBtn = clearBtn;
            }
        }

        // Create results summary if it doesn't exist
        if (!this.elements.searchResultsSummary && this.elements.allTemplatesGrid) {
            const summary = document.createElement('div');
            summary.className = 'search-results-summary';
            summary.style.display = 'none';
            summary.innerHTML = `
                <span class="results-count"></span>
                <button class="clear-all-filters">Clear all filters</button>
            `;
            
            this.elements.allTemplatesGrid.parentElement.insertBefore(summary, this.elements.allTemplatesGrid);
            this.elements.searchResultsSummary = summary;
            this.elements.resultsCount = summary.querySelector('.results-count');
            this.elements.clearAllFilters = summary.querySelector('.clear-all-filters');
        }
    }

    // ==============================
    // EVENT BINDING
    // ==============================
    bindEvents() {
        // Guided Discovery System
        this.bindGuidedDiscoveryEvents();
        
        // Filtering System
        this.bindFilteringEvents();
        
        // Template Card Interactions
        this.bindTemplateCardEvents();
        
        // Modal System
        this.bindModalEvents();
        
        // Recommendations System
        this.bindRecommendationEvents();
        
        // Navigation Events
        this.bindNavigationEvents();
    }

    bindGuidedDiscoveryEvents() {
        this.elements.guidedQuestionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const userType = btn.getAttribute('data-user-type');
                const analytics = btn.getAttribute('data-analytics');
                
                this.handleGuidedDiscovery(userType, analytics);
            });
        });

        this.elements.browseAllBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showBrowseAllSection();
            });
        });
    }

    bindFilteringEvents() {
        // Category filters
        this.elements.categoryFilterCards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const filter = card.getAttribute('data-filter');
                this.setActiveCategory(filter);
                this.applyFilters();
            });
        });

        // Search input
        if (this.elements.searchInput) {
            this.elements.searchInput.addEventListener('input', (e) => {
                this.debounceSearch(e.target.value);
            });

            this.elements.searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.clearSearch();
                }
            });
        }

        // Search clear button
        if (this.elements.searchClearBtn) {
            this.elements.searchClearBtn.addEventListener('click', () => {
                this.clearSearch();
            });
        }

        // Advanced filters
        if (this.elements.complexityFilter) {
            this.elements.complexityFilter.addEventListener('change', (e) => {
                this.currentFilters.complexity = e.target.value;
                this.applyFilters();
            });
        }

        if (this.elements.featuresFilter) {
            this.elements.featuresFilter.addEventListener('change', (e) => {
                this.currentFilters.features = e.target.value;
                this.applyFilters();
            });
        }

        // Clear all filters
        if (this.elements.clearAllFilters) {
            this.elements.clearAllFilters.addEventListener('click', () => {
                this.clearAllFilters();
            });
        }
    }

    bindTemplateCardEvents() {
        // Use event delegation for better compatibility with dynamic content
        document.addEventListener('click', (e) => {
            // Why This Works buttons
            if (e.target.matches('.why-this-works-btn, .why-this-works-btn *')) {
                e.preventDefault();
                const btn = e.target.closest('.why-this-works-btn');
                if (btn) {
                    const template = btn.getAttribute('data-template');
                    this.showWhyThisWorksModal(template);
                }
            }
            
            // More Like This buttons
            if (e.target.matches('.more-like-this-btn, .more-like-this-btn *')) {
                e.preventDefault();
                const btn = e.target.closest('.more-like-this-btn');
                if (btn) {
                    const template = btn.getAttribute('data-template');
                    this.showRecommendations(template);
                }
            }
            
            // Demo button analytics
            if (e.target.matches('.btn-primary, .template-card .btn:first-of-type')) {
                const card = e.target.closest('.template-card');
                if (card) {
                    const title = card.querySelector('.card-title')?.textContent;
                    const category = card.getAttribute('data-category');
                    this.trackTemplateDemo(title, category);
                }
            }
        });

        // Also bind to existing buttons for immediate functionality
        this.elements.whyThisWorksBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const template = btn.getAttribute('data-template');
                this.showWhyThisWorksModal(template);
            });
        });

        this.elements.moreLikeThisBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const template = btn.getAttribute('data-template');
                this.showRecommendations(template);
            });
        });
    }

    bindModalEvents() {
        if (this.elements.modal) {
            // Close button
            if (this.elements.modalClose) {
                this.elements.modalClose.addEventListener('click', () => {
                    this.closeModal();
                });
            }

            // Overlay click
            if (this.elements.modalOverlay) {
                this.elements.modalOverlay.addEventListener('click', () => {
                    this.closeModal();
                });
            }
        }
    }

    bindRecommendationEvents() {
        if (this.elements.closeRecommendations) {
            this.elements.closeRecommendations.addEventListener('click', () => {
                this.hideRecommendations();
            });
        }
    }

    bindNavigationEvents() {
        // Hash change for deep linking
        window.addEventListener('hashchange', () => {
            this.handleHashChange();
        });

        // Smooth scrolling for anchor links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link) {
                const href = link.getAttribute('href');
                if (href !== '#') {
                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        this.smoothScrollTo(target);
                    }
                }
            }
        });
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Escape key to close modals
            if (e.key === 'Escape') {
                if (this.activeModal) {
                    this.closeModal();
                } else if (this.elements.recommendationsSection?.style.display !== 'none') {
                    this.hideRecommendations();
                }
            }

            // Enter/Space for buttons
            if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('button, .btn')) {
                e.preventDefault();
                e.target.click();
            }
        });
    }

    // ==============================
    // GUIDED DISCOVERY SYSTEM
    // ==============================
    handleGuidedDiscovery(userType, analytics) {
        console.log(`Guided discovery: ${userType}`, analytics);
        
        // Track analytics
        this.trackDiscoveryClick(userType, analytics);
        
        // Filter templates by user type
        this.filterByUserType(userType);
        
        // Show browse all section
        this.showBrowseAllSection();
        
        // Set active category filter
        this.setActiveCategory(userType);
        
        // Smooth scroll to filtered results
        setTimeout(() => {
            if (this.elements.browseAllSection) {
                this.smoothScrollTo(this.elements.browseAllSection);
            }
        }, 400);
    }

    filterByUserType(userType) {
        const mapping = this.templateData.userTypeMapping || {};
        const templateIds = mapping[userType] || [];
        
        this.elements.templateCards.forEach(card => {
            const cardTitle = card.querySelector('.card-title')?.textContent;
            const cardCategory = card.getAttribute('data-category');
            
            // Check if template matches user type
            const matches = cardCategory === userType || 
                          templateIds.some(id => cardTitle?.toLowerCase().includes(id.toLowerCase()));
            
            if (matches) {
                this.showTemplateCard(card);
            } else {
                this.hideTemplateCard(card);
            }
        });
        
        this.updateResultsCount();
    }

    showBrowseAllSection() {
        if (this.elements.guidedDiscovery) {
            this.elements.guidedDiscovery.style.display = 'none';
        }
        
        if (this.elements.browseAllSection) {
            this.elements.browseAllSection.style.display = 'block';
        }
    }

    // ==============================
    // FILTERING SYSTEM
    // ==============================
    setActiveCategory(category) {
        this.currentFilters.category = category;
        
        // Update active states
        this.elements.categoryFilterCards.forEach(card => {
            const cardFilter = card.getAttribute('data-filter');
            if (cardFilter === category) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });
    }

    debounceSearch(query) {
        clearTimeout(this.debounceTimers.search);
        
        this.debounceTimers.search = setTimeout(() => {
            this.currentFilters.search = query.toLowerCase().trim();
            this.applyFilters();
            this.updateSearchUI(query);
        }, 300);
    }

    updateSearchUI(query) {
        if (this.elements.searchClearBtn) {
            this.elements.searchClearBtn.style.display = query ? 'block' : 'none';
        }
    }

    clearSearch() {
        if (this.elements.searchInput) {
            this.elements.searchInput.value = '';
            this.currentFilters.search = '';
            this.updateSearchUI('');
            this.applyFilters();
            this.elements.searchInput.focus();
        }
    }

    clearAllFilters() {
        // Reset all filters
        this.currentFilters = {
            category: 'all',
            search: '',
            complexity: '',
            features: ''
        };
        
        // Reset UI elements
        if (this.elements.searchInput) {
            this.elements.searchInput.value = '';
        }
        
        if (this.elements.complexityFilter) {
            this.elements.complexityFilter.value = '';
        }
        
        if (this.elements.featuresFilter) {
            this.elements.featuresFilter.value = '';
        }
        
        this.setActiveCategory('all');
        this.updateSearchUI('');
        this.applyFilters();
    }

    applyFilters() {
        let visibleCount = 0;
        
        this.elements.templateCards.forEach(card => {
            if (this.cardMatchesFilters(card)) {
                this.showTemplateCard(card);
                visibleCount++;
            } else {
                this.hideTemplateCard(card);
            }
        });
        
        this.updateResultsCount(visibleCount);
        this.updateResultsSummary();
    }

    cardMatchesFilters(card) {
        const { category, search, complexity, features } = this.currentFilters;
        
        // Category filter
        if (category !== 'all') {
            const cardCategory = card.getAttribute('data-category');
            if (cardCategory !== category) {
                return false;
            }
        }
        
        // Search filter
        if (search) {
            const searchableContent = this.getCardSearchableContent(card);
            if (!this.matchesSearch(searchableContent, search)) {
                return false;
            }
        }
        
        // Complexity filter
        if (complexity) {
            const cardComplexity = card.getAttribute('data-complexity');
            if (cardComplexity !== complexity) {
                return false;
            }
        }
        
        // Features filter
        if (features) {
            const cardFeatures = card.getAttribute('data-features') || '';
            if (!cardFeatures.includes(features)) {
                return false;
            }
        }
        
        return true;
    }

    getCardSearchableContent(card) {
        const title = card.querySelector('.card-title')?.textContent || '';
        const description = card.querySelector('.card-description, .card-content p')?.textContent || '';
        const bestFor = card.querySelector('.card-best-for')?.textContent || '';
        const features = Array.from(card.querySelectorAll('.template-features span'))
            .map(span => span.textContent).join(' ');
        const category = card.querySelector('.template-category-tag')?.textContent || '';
        
        return [title, description, bestFor, features, category].join(' ').toLowerCase();
    }

    matchesSearch(content, search) {
        // Split search into words for better matching
        const searchWords = search.split(' ').filter(word => word.length > 1);
        
        // Match if any search word is found, or if the full search is found
        return searchWords.some(word => content.includes(word)) || content.includes(search);
    }

    showTemplateCard(card) {
        card.classList.remove('hidden', 'filtered-out', 'search-hidden');
        card.style.display = '';
    }

    hideTemplateCard(card) {
        card.classList.add('hidden');
        
        // Add filtered-out class after animation
        setTimeout(() => {
            card.classList.add('filtered-out');
        }, 300);
    }

    updateResultsCount(count) {
        if (count === undefined) {
            const visibleCards = document.querySelectorAll('.template-card:not(.filtered-out):not(.hidden)');
            count = visibleCards.length;
        }
        
        if (this.elements.resultsCount) {
            const { category, search } = this.currentFilters;
            let text = '';
            
            if (search) {
                text = `Found ${count} template${count !== 1 ? 's' : ''} matching "${search}"`;
            } else if (category !== 'all') {
                text = `Showing ${count} ${category} template${count !== 1 ? 's' : ''}`;
            } else {
                text = `Showing ${count} template${count !== 1 ? 's' : ''}`;
            }
            
            this.elements.resultsCount.textContent = text;
        }
    }

    updateResultsSummary() {
        const hasActiveFilters = this.currentFilters.search || 
                                this.currentFilters.category !== 'all' ||
                                this.currentFilters.complexity ||
                                this.currentFilters.features;
        
        if (this.elements.searchResultsSummary) {
            this.elements.searchResultsSummary.style.display = hasActiveFilters ? 'flex' : 'none';
        }
    }

    // ==============================
    // MODAL SYSTEM
    // ==============================
    showWhyThisWorksModal(templateKey) {
        if (!this.elements.modal || !this.elements.modalBody) return;
        
        const templateData = this.templateData.whyThisWorks[templateKey];
        if (!templateData) {
            console.warn(`No "Why This Works" data found for template: ${templateKey}`);
            return;
        }
        
        // Build modal content
        const content = this.buildModalContent(templateData);
        this.elements.modalBody.innerHTML = content;
        
        // Show modal
        this.elements.modal.style.display = 'flex';
        this.activeModal = templateKey;
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Focus trap
        setTimeout(() => {
            const firstFocusable = this.elements.modal.querySelector('button, [tabindex]:not([tabindex="-1"])');
            if (firstFocusable) {
                firstFocusable.focus();
            }
        }, 100);
        
        // Track modal view
        this.trackModalView(templateKey);
    }

    buildModalContent(data) {
        const pointsList = data.points.map(point => `<li>${point}</li>`).join('');
        
        return `
            <div class="modal-header">
                <h2>${data.title}</h2>
            </div>
            <div class="modal-content-body">
                <ul class="why-this-works-points">
                    ${pointsList}
                </ul>
                ${data.stats ? `<div class="modal-stats">
                    <p><strong>Real Results:</strong> ${data.stats}</p>
                </div>` : ''}
            </div>
        `;
    }

    closeModal() {
        if (!this.elements.modal) return;
        
        this.elements.modal.style.display = 'none';
        this.activeModal = null;
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Return focus to trigger element
        const triggerBtn = document.querySelector(`[data-template="${this.activeModal}"]`);
        if (triggerBtn) {
            triggerBtn.focus();
        }
    }

    // ==============================
    // RECOMMENDATIONS SYSTEM
    // ==============================
    showRecommendations(templateKey) {
        if (!this.elements.recommendationsSection || !this.elements.recommendationsGrid) return;
        
        const recommendations = this.templateData.recommendations[templateKey] || [];
        if (recommendations.length === 0) {
            console.warn(`No recommendations found for template: ${templateKey}`);
            return;
        }
        
        // Update title
        if (this.elements.recommendationsTitle) {
            this.elements.recommendationsTitle.textContent = 
                `Based on your interest in ${this.getTemplateName(templateKey)}`;
        }
        
        // Build recommendations grid
        const recommendationsHTML = this.buildRecommendationsHTML(recommendations);
        this.elements.recommendationsGrid.innerHTML = recommendationsHTML;
        
        // Show section
        this.elements.recommendationsSection.style.display = 'block';
        
        // Smooth scroll to recommendations
        setTimeout(() => {
            this.smoothScrollTo(this.elements.recommendationsSection);
        }, 100);
        
        // Track recommendations view
        this.trackRecommendationsView(templateKey, recommendations);
    }

    buildRecommendationsHTML(recommendations) {
        return recommendations.map(templateKey => {
            const card = this.findTemplateCard(templateKey);
            if (card) {
                return card.outerHTML;
            }
            return '';
        }).join('');
    }

    findTemplateCard(templateKey) {
        for (const card of this.elements.templateCards) {
            const title = card.querySelector('.card-title')?.textContent;
            if (title && title.toLowerCase().includes(templateKey.toLowerCase())) {
                return card.cloneNode(true);
            }
        }
        return null;
    }

    getTemplateName(templateKey) {
        const card = this.findTemplateCard(templateKey);
        return card?.querySelector('.card-title')?.textContent || templateKey;
    }

    hideRecommendations() {
        if (this.elements.recommendationsSection) {
            this.elements.recommendationsSection.style.display = 'none';
        }
    }

    // ==============================
    // NAVIGATION AND URL HANDLING
    // ==============================
    initializeFromURL() {
        const hash = window.location.hash.replace('#', '');
        if (hash) {
            // Handle deep linking to categories
            const categoryCard = document.querySelector(`[data-filter="${hash}"]`);
            if (categoryCard) {
                this.setActiveCategory(hash);
                this.applyFilters();
                this.showBrowseAllSection();
            }
        }
    }

    handleHashChange() {
        const hash = window.location.hash.replace('#', '');
        if (hash && hash !== this.currentFilters.category) {
            const categoryCard = document.querySelector(`[data-filter="${hash}"]`);
            if (categoryCard) {
                this.setActiveCategory(hash);
                this.applyFilters();
            }
        }
    }

    smoothScrollTo(element, offset = 100) {
        if (!element) return;
        
        const targetTop = element.getBoundingClientRect().top + window.pageYOffset - offset;
        
        window.scrollTo({
            top: targetTop,
            behavior: 'smooth'
        });
    }

    // ==============================
    // ANALYTICS AND TRACKING
    // ==============================
    trackDiscoveryClick(userType, analytics) {
        console.log('Discovery click:', { userType, analytics });
        // Implement your analytics tracking here
        // Example: gtag('event', 'discovery_click', { user_type: userType });
    }

    trackTemplateDemo(title, category) {
        console.log('Template demo viewed:', { title, category });
        // Implement your analytics tracking here
    }

    trackModalView(templateKey) {
        console.log('Modal viewed:', templateKey);
        // Implement your analytics tracking here
    }

    trackRecommendationsView(templateKey, recommendations) {
        console.log('Recommendations viewed:', { templateKey, recommendations });
        // Implement your analytics tracking here
    }

    // ==============================
    // UTILITY METHODS
    // ==============================
    debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }

    // ==============================
    // DEBUGGING AND TROUBLESHOOTING METHODS
    // ==============================
    
    // Method to help debug button selection issues
    debugButtonSelector(selector) {
        console.log('Debugging selector:', selector);
        const element = document.querySelector(selector);
        console.log('Element found:', element);
        
        if (!element) {
            console.log('Element not found. Let me check the DOM structure...');
            
            // Check if the container exists
            const container = document.querySelector('#popular-templates');
            if (container) {
                console.log('Container found:', container);
                console.log('Container children:', container.children);
                
                // Log all buttons in the container
                const buttons = container.querySelectorAll('button');
                console.log('All buttons in container:', buttons);
                buttons.forEach((btn, index) => {
                    console.log(`Button ${index}:`, btn, 'Classes:', btn.className, 'Data attributes:', btn.dataset);
                });
            } else {
                console.log('Container #popular-templates not found');
            }
        }
        
        return element;
    }
    
    // Method to manually bind a specific button
    bindSpecificButton(selector) {
        const button = document.querySelector(selector);
        if (button) {
            console.log('Binding button:', button);
            
            // Check if it has the right data attributes
            const template = button.getAttribute('data-template');
            console.log('Template data attribute:', template);
            
            // Add click handler
            button.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Button clicked:', button);
                
                if (button.classList.contains('why-this-works-btn')) {
                    this.showWhyThisWorksModal(template);
                } else if (button.classList.contains('more-like-this-btn')) {
                    this.showRecommendations(template);
                } else {
                    console.log('Button type not recognized, checking classes:', button.classList);
                }
            });
            
            return true;
        } else {
            console.log('Button not found with selector:', selector);
            return false;
        }
    }
    
    // Method to fix missing data attributes
    fixMissingDataAttributes() {
        console.log('Checking for buttons missing data-template attributes...');
        
        const whyThisWorksBtns = document.querySelectorAll('.why-this-works-btn');
        const moreLikeThisBtns = document.querySelectorAll('.more-like-this-btn');
        
        [...whyThisWorksBtns, ...moreLikeThisBtns].forEach(btn => {
            if (!btn.getAttribute('data-template')) {
                // Try to infer the template from the card
                const card = btn.closest('.template-card');
                if (card) {
                    const title = card.querySelector('.card-title')?.textContent;
                    if (title) {
                        // Convert title to template key
                        let templateKey = title.toLowerCase()
                            .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
                            .replace(/\s+/g, '-') // Replace spaces with hyphens
                            .replace(/-+/g, '-') // Replace multiple hyphens with single
                            .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
                        
                        // Common template key mappings
                        const keyMappings = {
                            'booked-busy-kit': 'booked-busy',
                            'essential-trades-template': 'trades',
                            'event-landing-page': 'event-landing',
                            'solo-pro-site': 'solo-pro',
                            'health-wellness-one-pager': 'wellness',
                            'wedding-rsvp-site': 'wedding-rsvp',
                            'launch-announcement-page': 'launch',
                            'performer-portfolio': 'performer-portfolio',
                            'modern-one-pager': 'modern',
                            'service-based-business-site': 'service-business',
                            'no-fuss-business-site': 'nofuss-biz'
                        };
                        
                        templateKey = keyMappings[templateKey] || templateKey;
                        
                        console.log(`Setting data-template="${templateKey}" for button in card: ${title}`);
                        btn.setAttribute('data-template', templateKey);
                    }
                }
            }
        });
    }
}

// ==============================
// AUTO-INITIALIZATION
// ==============================

// Initialize the templates page manager
const templatesPage = new TemplatesPageManager();

// Export for global access (useful for debugging or external integration)
window.TemplatesPageManager = templatesPage;

// ==============================
// ADDITIONAL ENHANCEMENTS
// ==============================

// Add CSS for enhanced animations and states
const enhancementStyles = document.createElement('style');
enhancementStyles.textContent = `
    /* Enhanced modal animations */
    .why-this-works-modal {
        animation: modalFadeIn 0.3s ease-out forwards;
    }
    
    @keyframes modalFadeIn {
        from {
            opacity: 0;
            backdrop-filter: blur(0px);
        }
        to {
            opacity: 1;
            backdrop-filter: blur(5px);
        }
    }
    
    /* Enhanced template card transitions */
    .template-card.hidden {
        opacity: 0;
        transform: translateY(20px) scale(0.95);
        transition: all 0.4s ease;
    }
    
    .template-card:not(.hidden) {
        opacity: 1;
        transform: translateY(0) scale(1);
        transition: all 0.4s ease;
    }
    
    /* Enhanced search input focus */
    .search-input:focus {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(109, 0, 26, 0.15);
    }
    
    /* Enhanced filter card active state */
    .category-filter-card.active {
        animation: filterCardActivate 0.3s ease-out;
    }
    
    @keyframes filterCardActivate {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1) translateY(-5px); }
    }
    
    /* Enhanced modal content */
    .why-this-works-points {
        list-style: none;
        padding: 0;
    }
    
    .why-this-works-points li {
        padding: 0.8rem 0;
        border-bottom: 1px solid #eee;
        position: relative;
        padding-left: 2rem;
    }
    
    .why-this-works-points li:before {
        content: "✓";
        position: absolute;
        left: 0;
        color: #28a745;
        font-weight: bold;
        font-size: 1.2rem;
    }
    
    .modal-stats {
        background: rgba(109, 0, 26, 0.05);
        padding: 1rem;
        border-radius: 8px;
        margin-top: 1.5rem;
        border-left: 4px solid var(--primary);
    }
    
    .modal-stats p {
        margin: 0;
        color: var(--primary-dark);
    }
    
    /* Enhanced focus states for accessibility */
    .guided-question-btn:focus,
    .category-filter-card:focus {
        outline: 3px solid rgba(109, 0, 26, 0.3);
        outline-offset: 2px;
    }
    
    /* Loading states */
    .templates-loading .template-card {
        opacity: 0.5;
        pointer-events: none;
    }
    
    /* No results state */
    .no-results-message {
        text-align: center;
        padding: 3rem 2rem;
        color: var(--secondary);
    }
    
    .no-results-message h3 {
        color: var(--dark);
        margin-bottom: 1rem;
    }
    
    .no-results-message p {
        margin-bottom: 2rem;
        max-width: 400px;
        margin-left: auto;
        margin-right: auto;
    }
`;

document.head.appendChild(enhancementStyles);

console.log('Advanced Templates Page JavaScript loaded successfully');

// Enhanced Templates.js - Add template selection functionality

// Add this to your existing TemplatesPageManager class

class TemplateSelectionManager {
    constructor() {
        this.selectedTemplates = new Set();
        this.init();
    }

    init() {
        this.addCheckboxesToTemplates();
        this.bindCheckboxEvents();
        this.addSelectionSummary();
        this.enhanceContactButtons();
    }

    addCheckboxesToTemplates() {
        const templateCards = document.querySelectorAll('.template-card');
        
        templateCards.forEach(card => {
            const templateName = this.getTemplateName(card);
            const templateKey = this.getTemplateKey(templateName);
            
            // Create checkbox container
            const checkboxContainer = document.createElement('div');
            checkboxContainer.className = 'template-selection';
            checkboxContainer.innerHTML = `
                <label class="template-checkbox-label">
                    <input type="checkbox" 
                           class="template-checkbox" 
                           value="${templateKey}"
                           data-template-name="${templateName}">
                    <span class="checkbox-custom"></span>
                    <span class="checkbox-text">I'm interested in this template</span>
                </label>
            `;
            
            // Insert checkbox before card actions
            const cardActions = card.querySelector('.card-actions');
            if (cardActions) {
                cardActions.parentNode.insertBefore(checkboxContainer, cardActions);
            }
        });
    }

    bindCheckboxEvents() {
        document.addEventListener('change', (e) => {
            if (e.target.matches('.template-checkbox')) {
                this.handleTemplateSelection(e.target);
            }
        });
    }

    handleTemplateSelection(checkbox) {
        const templateKey = checkbox.value;
        const templateName = checkbox.getAttribute('data-template-name');
        
        if (checkbox.checked) {
            this.selectedTemplates.add({
                key: templateKey,
                name: templateName
            });
        } else {
            // Remove from selected templates
            this.selectedTemplates.forEach(template => {
                if (template.key === templateKey) {
                    this.selectedTemplates.delete(template);
                }
            });
        }
        
        this.updateSelectionSummary();
        this.updateContactButtons();
        this.saveSelectionToStorage();
    }

    addSelectionSummary() {
        // Add a floating selection summary
        const summaryContainer = document.createElement('div');
        summaryContainer.className = 'template-selection-summary';
        summaryContainer.innerHTML = `
            <div class="selection-summary-content">
                <div class="summary-header">
                    <h4>Selected Templates</h4>
                    <button class="clear-selections-btn" type="button">
                        <i class="fas fa-times"></i> Clear All
                    </button>
                </div>
                <div class="selected-templates-list"></div>
                <div class="summary-actions">
                    <a href="contact.html" class="btn btn-primary">
                        <i class="fas fa-envelope"></i> Contact About Selected Templates
                    </a>
                </div>
            </div>
        `;
        
        document.body.appendChild(summaryContainer);
        
        // Bind clear selections event
        summaryContainer.querySelector('.clear-selections-btn').addEventListener('click', () => {
            this.clearAllSelections();
        });
    }

    updateSelectionSummary() {
        const summary = document.querySelector('.template-selection-summary');
        const list = summary.querySelector('.selected-templates-list');
        
        if (this.selectedTemplates.size === 0) {
            summary.classList.remove('active');
            return;
        }
        
        summary.classList.add('active');
        
        list.innerHTML = Array.from(this.selectedTemplates).map(template => `
            <div class="selected-template-item">
                <span class="template-name">${template.name}</span>
                <button class="remove-template-btn" data-template-key="${template.key}">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
        
        // Bind remove individual template events
        list.querySelectorAll('.remove-template-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const templateKey = e.target.closest('.remove-template-btn').getAttribute('data-template-key');
                this.removeTemplate(templateKey);
            });
        });
    }

    updateContactButtons() {
        const contactLinks = document.querySelectorAll('a[href="contact.html"], a[href*="contact"]');
        
        contactLinks.forEach(link => {
            if (this.selectedTemplates.size > 0) {
                // Modify the link to include selected templates
                const url = new URL(link.href);
                url.searchParams.set('templates', Array.from(this.selectedTemplates).map(t => t.key).join(','));
                link.href = url.toString();
                
                // Update button text if it's a selection-related button
                if (link.textContent.includes('Contact')) {
                    link.innerHTML = `<i class="fas fa-envelope"></i> Contact About ${this.selectedTemplates.size} Template${this.selectedTemplates.size > 1 ? 's' : ''}`;
                }
            }
        });
    }

    removeTemplate(templateKey) {
        // Uncheck the corresponding checkbox
        const checkbox = document.querySelector(`input[value="${templateKey}"]`);
        if (checkbox) {
            checkbox.checked = false;
            this.handleTemplateSelection(checkbox);
        }
    }

    clearAllSelections() {
        // Uncheck all template checkboxes
        document.querySelectorAll('.template-checkbox:checked').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        this.selectedTemplates.clear();
        this.updateSelectionSummary();
        this.updateContactButtons();
        this.saveSelectionToStorage();
    }

    saveSelectionToStorage() {
        // Save selections to localStorage for persistence across pages
        const selections = Array.from(this.selectedTemplates);
        localStorage.setItem('selectedTemplates', JSON.stringify(selections));
    }

    loadSelectionFromStorage() {
        try {
            const saved = localStorage.getItem('selectedTemplates');
            if (saved) {
                const selections = JSON.parse(saved);
                selections.forEach(template => {
                    this.selectedTemplates.add(template);
                    // Check corresponding checkbox
                    const checkbox = document.querySelector(`input[value="${template.key}"]`);
                    if (checkbox) {
                        checkbox.checked = true;
                    }
                });
                this.updateSelectionSummary();
                this.updateContactButtons();
            }
        } catch (error) {
            console.warn('Could not load template selections from storage:', error);
        }
    }

    getTemplateName(card) {
        const title = card.querySelector('.card-title');
        return title ? title.textContent.trim() : 'Unknown Template';
    }

    getTemplateKey(templateName) {
        return templateName.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    }
}

// Enhanced Contact Form Manager
class ContactFormManager {
    constructor() {
        this.init();
    }

    init() {
        this.loadSelectedTemplates();
        this.enhanceContactForm();
    }

    loadSelectedTemplates() {
        // Check URL parameters for selected templates
        const urlParams = new URLSearchParams(window.location.search);
        const templateParams = urlParams.get('templates');
        
        if (templateParams) {
            const templateKeys = templateParams.split(',');
            this.displaySelectedTemplates(templateKeys);
        }

        // Also check localStorage
        try {
            const saved = localStorage.getItem('selectedTemplates');
            if (saved) {
                const selections = JSON.parse(saved);
                if (selections.length > 0) {
                    this.displaySelectedTemplatesFromStorage(selections);
                }
            }
        } catch (error) {
            console.warn('Could not load template selections:', error);
        }
    }

    displaySelectedTemplates(templateKeys) {
        if (templateKeys.length === 0) return;

        const form = document.getElementById('contact-form');
        if (!form) return;

        // Create templates section in form
        const templatesSection = document.createElement('div');
        templatesSection.className = 'form-group selected-templates-section';
        templatesSection.innerHTML = `
            <label class="form-label">Templates you're interested in:</label>
            <div class="selected-templates-display">
                ${templateKeys.map(key => `
                    <div class="selected-template-badge">
                        <span>${this.formatTemplateName(key)}</span>
                        <input type="hidden" name="selected_templates[]" value="${key}">
                    </div>
                `).join('')}
            </div>
            <p class="form-helper-text">These templates will be mentioned when I follow up with you.</p>
        `;

        // Insert before the project description field
        const projectField = form.querySelector('#project').closest('.form-group');
        if (projectField) {
            form.insertBefore(templatesSection, projectField);
        }
    }

    displaySelectedTemplatesFromStorage(selections) {
        if (selections.length === 0) return;

        const form = document.getElementById('contact-form');
        if (!form) return;

        // Create templates section in form
        const templatesSection = document.createElement('div');
        templatesSection.className = 'form-group selected-templates-section';
        templatesSection.innerHTML = `
            <label class="form-label">Templates you're interested in:</label>
            <div class="selected-templates-display">
                ${selections.map(template => `
                    <div class="selected-template-badge">
                        <span>${template.name}</span>
                        <input type="hidden" name="selected_templates[]" value="${template.key}">
                        <input type="hidden" name="selected_template_names[]" value="${template.name}">
                    </div>
                `).join('')}
            </div>
            <p class="form-helper-text">These templates will be mentioned when I follow up with you.</p>
        `;

        // Insert before the project description field
        const projectField = form.querySelector('#project').closest('.form-group');
        if (projectField) {
            form.insertBefore(templatesSection, projectField);
        }
    }

    enhanceContactForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            // Add selected templates data to form submission
            this.addTemplateDataToSubmission(form);
        });
    }

    addTemplateDataToSubmission(form) {
        const selectedTemplates = document.querySelectorAll('input[name="selected_templates[]"]');
        const templateNames = document.querySelectorAll('input[name="selected_template_names[]"]');
        
        if (selectedTemplates.length > 0) {
            // Add a summary field for easy reading in email
            const summaryField = document.createElement('input');
            summaryField.type = 'hidden';
            summaryField.name = 'template_interest_summary';
            summaryField.value = `Customer is interested in ${selectedTemplates.length} template(s): ${Array.from(templateNames).map(input => input.value).join(', ')}`;
            form.appendChild(summaryField);
        }
    }

    formatTemplateName(key) {
        return key.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }
}

// Initialize both managers
document.addEventListener('DOMContentLoaded', () => {
    // Initialize template selection on templates page
    if (document.querySelector('.template-card')) {
        window.templateSelectionManager = new TemplateSelectionManager();
        // Load saved selections
        window.templateSelectionManager.loadSelectionFromStorage();
    }
    
    // Initialize contact form enhancements on contact page
    if (document.getElementById('contact-form')) {
        window.contactFormManager = new ContactFormManager();
    }
});

// Clear selections when user navigates away from templates
window.addEventListener('beforeunload', () => {
    // Optional: Clear selections when leaving the site
    // localStorage.removeItem('selectedTemplates');
});