// Step 2: Goals Selection and Template Recommendation
class Step2Handler {
    constructor() {
        this.selectedGoals = new Set();
        this.templateDatabase = this.initializeTemplates();
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadPreviousSelections();
    }

    initializeTemplates() {
        // Template database based on goals
        return {
            contact: [
                { name: 'Professional Services', preview: 'clean-professional.jpg', description: 'Perfect for consultants and service providers' },
                { name: 'Local Business', preview: 'local-business.jpg', description: 'Great for local services and trades' }
            ],
            appointments: [
                { name: 'Health & Wellness', preview: 'health-wellness.jpg', description: 'Built for practitioners and therapists' },
                { name: 'Beauty Services', preview: 'beauty-services.jpg', description: 'Perfect for salons and beauty pros' }
            ],
            events: [
                { name: 'Wedding Planner', preview: 'wedding-planner.jpg', description: 'Elegant event planning showcase' },
                { name: 'Event RSVP', preview: 'event-rsvp.jpg', description: 'Simple and effective event pages' }
            ],
            showcase: [
                { name: 'Creative Portfolio', preview: 'creative-portfolio.jpg', description: 'Showcase your artistic work' },
                { name: 'Photography', preview: 'photography.jpg', description: 'Gallery-focused design' }
            ],
            sell: [
                { name: 'Product Showcase', preview: 'product-showcase.jpg', description: 'Clean product presentation' },
                { name: 'E-commerce Ready', preview: 'ecommerce.jpg', description: 'Built for online selling' }
            ],
            other: [
                { name: 'Custom Solutions', preview: 'custom.jpg', description: "We'll build exactly what you need" }
            ]
        };
    }

    bindEvents() {
        // Goal checkbox selection
        document.querySelectorAll('.goal-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.handleGoalSelection(e.target);
            });
        });

        // Form submission
        document.getElementById('goals-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.proceedToNextStep();
        });
    }

    handleGoalSelection(checkbox) {
        const goalValue = checkbox.value;
        const goalLabel = checkbox.closest('.goal-option').querySelector('.goal-label');

        if (checkbox.checked) {
            this.selectedGoals.add(goalValue);
            goalLabel.classList.add('selected');
        } else {
            this.selectedGoals.delete(goalValue);
            goalLabel.classList.remove('selected');
        }

        this.updateContinueButton();
        this.updateTemplatePreview();
        this.saveSelections();
    }

    updateContinueButton() {
        const continueBtn = document.getElementById('continue-btn');
        const hasSelections = this.selectedGoals.size > 0;
        
        continueBtn.disabled = !hasSelections;
        
        if (hasSelections) {
            continueBtn.innerHTML = `Continue <i class="fas fa-arrow-right"></i>`;
        } else {
            continueBtn.innerHTML = `Select at least one goal <i class="fas fa-arrow-right"></i>`;
        }
    }

    updateTemplatePreview() {
        const previewSection = document.getElementById('template-preview');
        const templatesContainer = document.getElementById('recommended-templates');

        if (this.selectedGoals.size === 0) {
            previewSection.style.display = 'none';
            return;
        }

        // Get recommended templates based on selected goals
        const recommendedTemplates = this.getRecommendedTemplates();
        
        // Clear and populate templates
        templatesContainer.innerHTML = '';
        
        recommendedTemplates.forEach(template => {
            const templateCard = this.createTemplateCard(template);
            templatesContainer.appendChild(templateCard);
        });

        previewSection.style.display = 'block';
        
        // Smooth scroll to show templates
        setTimeout(() => {
            previewSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }, 100);
    }

    getRecommendedTemplates() {
        const recommended = [];
        const maxTemplates = 3;

        // Get templates for each selected goal
        this.selectedGoals.forEach(goal => {
            if (this.templateDatabase[goal]) {
                recommended.push(...this.templateDatabase[goal]);
            }
        });

        // Remove duplicates and limit to max
        const unique = recommended.filter((template, index, self) => 
            index === self.findIndex(t => t.name === template.name)
        );

        return unique.slice(0, maxTemplates);
    }

    createTemplateCard(template) {
        const card = document.createElement('div');
        card.className = 'template-card';
        
        card.innerHTML = `
            <div class="template-preview">
                <img src="./img/templates/${template.preview}" alt="${template.name}" loading="lazy">
                <div class="template-overlay">
                    <i class="fas fa-eye"></i>
                </div>
            </div>
            <div class="template-info">
                <h4>${template.name}</h4>
                <p>${template.description}</p>
                <button type="button" class="template-select-btn" data-template="${template.name}">
                    <i class="fas fa-check"></i> Use This Template
                </button>
            </div>
        `;

        // Add click handler for template selection
        const selectBtn = card.querySelector('.template-select-btn');
        selectBtn.addEventListener('click', () => {
            this.selectTemplate(template.name);
        });

        return card;
    }

    selectTemplate(templateName) {
        // Store selected template
        sessionStorage.setItem('selectedTemplate', templateName);
        
        // Visual feedback
        document.querySelectorAll('.template-select-btn').forEach(btn => {
            btn.classList.remove('selected');
            btn.innerHTML = '<i class="fas fa-check"></i> Use This Template';
        });

        const selectedBtn = document.querySelector(`[data-template="${templateName}"]`);
        selectedBtn.classList.add('selected');
        selectedBtn.innerHTML = '<i class="fas fa-check-circle"></i> Selected';

        // Enable continue button if not already enabled
        document.getElementById('continue-btn').disabled = false;
    }

    saveSelections() {
        // Save to sessionStorage for the funnel
        sessionStorage.setItem('selectedGoals', JSON.stringify([...this.selectedGoals]));
        
        // Also save user progress
        sessionStorage.setItem('funnelStep', '2');
    }

    loadPreviousSelections() {
        // Load previously selected goals if user navigates back
        const savedGoals = sessionStorage.getItem('selectedGoals');
        if (savedGoals) {
            const goals = JSON.parse(savedGoals);
            goals.forEach(goal => {
                const checkbox = document.querySelector(`input[value="${goal}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                    this.selectedGoals.add(goal);
                    checkbox.closest('.goal-option').querySelector('.goal-label').classList.add('selected');
                }
            });
            
            this.updateContinueButton();
            this.updateTemplatePreview();
        }
    }

    proceedToNextStep() {
        // Save final selections
        this.saveSelections();
        
        // Redirect to step 3
        window.location.href = 'step3.html';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Step2Handler();
});

// Add some nice animations
document.addEventListener('DOMContentLoaded', () => {
    // Animate goal options on load
    const goalOptions = document.querySelectorAll('.goal-option');
    goalOptions.forEach((option, index) => {
        option.style.opacity = '0';
        option.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            option.style.transition = 'all 0.6s ease';
            option.style.opacity = '1';
            option.style.transform = 'translateY(0)';
        }, index * 100);
    });
});