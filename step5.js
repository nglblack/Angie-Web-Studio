/**
 * STEP 5 JAVASCRIPT - COMPLETE WEBSITE CONTENT & FINAL PROCESSING
 * Handles content generation, photo uploads, services builder, and AI compilation
 */

class Step5Handler {
    constructor() {
        this.contentSelections = {
            about: { method: 'manual', content: '', helpAnswers: {} },
            services: [],
            tagline: { selected: null, custom: '' }
        };
        this.uploadedFiles = {
            hero: null,
            about: null,
            gallery: []
        };
        this.contactInfo = {};
        this.aiSuggestions = {
            taglines: [],
            aboutContent: ''
        };
        
        // AI prompt templates for content generation
        this.contentPrompts = {
            about: {
                template: "Based on the business details: {years} in business, what makes them different: {difference}, what people should know: {know}. Write a professional About section for their website.",
                questions: ['about_years', 'about_difference', 'about_know']
            },
            taglines: {
                template: "For a {businessType} business targeting {audience} with a {vibe} website style, generate 3 compelling headlines for the homepage.",
                context: ['businessType', 'audience', 'vibe']
            }
        };

        this.init();
    }

    init() {
        this.bindEvents();
        this.loadPreviousData();
        this.generateAISuggestions();
        this.updateSummary();
        this.setupAutoSave();
    }

    bindEvents() {
        // Content method toggles (Help Write vs Write Own)
        this.bindContentMethodToggles();
        
        // Services builder
        this.bindServicesBuilder();
        
        // Photo uploads
        this.bindPhotoUploads();
        
        // Tagline selection
        this.bindTaglineSelection();
        
        // Contact form inputs
        this.bindContactInputs();
        
        // Form submission
        this.bindFormSubmission();
        
        // Real-time content updates
        this.bindContentUpdates();
    }

    bindContentMethodToggles() {
        const helpButtons = document.querySelectorAll('.help-write-btn');
        const ownButtons = document.querySelectorAll('.write-own-btn');

        helpButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.target.dataset.section;
                this.toggleContentMethod(section, 'help');
            });
        });

        ownButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.target.dataset.section;
                this.toggleContentMethod(section, 'manual');
            });
        });
    }

    toggleContentMethod(section, method) {
        const helpBtn = document.querySelector(`.help-write-btn[data-section="${section}"]`);
        const ownBtn = document.querySelector(`.write-own-btn[data-section="${section}"]`);
        const helpSection = document.getElementById(`${section}-help`);
        const manualSection = document.getElementById(`${section}-manual`);

        // Update button states
        helpBtn.classList.toggle('active', method === 'help');
        ownBtn.classList.toggle('active', method === 'manual');

        // Show/hide sections
        if (helpSection) {
            helpSection.style.display = method === 'help' ? 'block' : 'none';
        }
        if (manualSection) {
            manualSection.classList.toggle('active', method === 'manual');
        }

        // Update content selections
        this.contentSelections[section].method = method;

        // Generate AI content if help method selected
        if (method === 'help') {
            this.generateHelpContent(section);
        }

        this.saveSelections();
    }

    bindServicesBuilder() {
        const addButton = document.querySelector('.add-service-btn');
        if (addButton) {
            addButton.addEventListener('click', this.addServiceItem.bind(this));
        }

        // Bind existing service inputs
        this.bindServiceInputs();
    }

    addServiceItem() {
        const servicesBuilder = document.querySelector('.services-builder');
        const serviceCount = servicesBuilder.querySelectorAll('.service-item').length;
        
        const serviceHTML = `
            <div class="service-item">
                <div class="service-inputs">
                    <input type="text" name="service_name[]" placeholder="Service name" class="service-name-input">
                    <textarea name="service_description[]" placeholder="Brief description (optional)" class="service-desc-input"></textarea>
                    <input type="text" name="service_price[]" placeholder="Price (optional)" class="service-price-input">
                </div>
                <button type="button" class="remove-service-btn" ${serviceCount === 0 ? 'style="display: none;"' : ''}>
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        servicesBuilder.insertAdjacentHTML('beforeend', serviceHTML);
        
        // Show remove buttons if more than one service
        if (serviceCount >= 0) {
            const removeButtons = servicesBuilder.querySelectorAll('.remove-service-btn');
            removeButtons.forEach(btn => btn.style.display = 'flex');
        }

        // Bind events for new service item
        this.bindServiceInputs();
    }

    bindServiceInputs() {
        const serviceItems = document.querySelectorAll('.service-item');
        
        serviceItems.forEach((item, index) => {
            const removeBtn = item.querySelector('.remove-service-btn');
            const inputs = item.querySelectorAll('input, textarea');

            // Remove button functionality
            if (removeBtn) {
                removeBtn.replaceWith(removeBtn.cloneNode(true)); // Remove existing listeners
                const newRemoveBtn = item.querySelector('.remove-service-btn');
                newRemoveBtn.addEventListener('click', () => {
                    this.removeServiceItem(item);
                });
            }

            // Input change listeners
            inputs.forEach(input => {
                input.addEventListener('input', this.updateServices.bind(this));
            });
        });
    }

    removeServiceItem(serviceItem) {
        serviceItem.remove();
        
        const servicesBuilder = document.querySelector('.services-builder');
        const remainingServices = servicesBuilder.querySelectorAll('.service-item');
        
        // Hide remove button if only one service remains
        if (remainingServices.length === 1) {
            const lastRemoveBtn = remainingServices[0].querySelector('.remove-service-btn');
            if (lastRemoveBtn) {
                lastRemoveBtn.style.display = 'none';
            }
        }

        this.updateServices();
    }

    updateServices() {
        const serviceItems = document.querySelectorAll('.service-item');
        this.contentSelections.services = [];

        serviceItems.forEach(item => {
            const name = item.querySelector('.service-name-input').value;
            const description = item.querySelector('.service-desc-input').value;
            const price = item.querySelector('.service-price-input').value;

            if (name.trim()) {
                this.contentSelections.services.push({
                    name: name.trim(),
                    description: description.trim(),
                    price: price.trim()
                });
            }
        });

        this.updateSummary();
        this.saveSelections();
    }

    bindPhotoUploads() {
        const uploadAreas = document.querySelectorAll('.photo-upload-area');
        
        uploadAreas.forEach(area => {
            const fileInput = area.querySelector('input[type="file"]');
            const uploadType = area.dataset.type;

            // Click to upload
            area.addEventListener('click', () => {
                fileInput.click();
            });

            // Drag and drop
            area.addEventListener('dragover', this.handleDragOver.bind(this));
            area.addEventListener('drop', (e) => this.handlePhotoDrop(e, uploadType));

            // File input change
            fileInput.addEventListener('change', (e) => this.handlePhotoUpload(e, uploadType));
        });
    }

    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.add('dragover');
    }

    handlePhotoDrop(e, uploadType) {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.processPhotoFiles(files, uploadType);
        }
    }

    handlePhotoUpload(e, uploadType) {
        const files = e.target.files;
        if (files.length > 0) {
            this.processPhotoFiles(files, uploadType);
        }
    }

    processPhotoFiles(files, uploadType) {
        const validFiles = Array.from(files).filter(file => {
            if (!file.type.startsWith('image/')) {
                alert(`${file.name} is not an image file.`);
                return false;
            }
            if (file.size > 10 * 1024 * 1024) { // 10MB limit
                alert(`${file.name} is too large. Maximum size is 10MB.`);
                return false;
            }
            return true;
        });

        if (validFiles.length === 0) return;

        if (uploadType === 'gallery') {
            this.uploadedFiles.gallery = [...this.uploadedFiles.gallery, ...validFiles];
        } else {
            this.uploadedFiles[uploadType] = validFiles[0];
        }

        this.updatePhotoUploadUI(uploadType);
        this.updateSummary();
        this.saveSelections();
    }

    updatePhotoUploadUI(uploadType) {
        const uploadArea = document.querySelector(`[data-type="${uploadType}"]`);
        if (!uploadArea) return;

        const files = uploadType === 'gallery' ? this.uploadedFiles.gallery : [this.uploadedFiles[uploadType]].filter(Boolean);
        
        if (files.length > 0) {
            uploadArea.classList.add('uploaded');
            
            if (uploadType === 'gallery') {
                uploadArea.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    <p><strong>${files.length} photo(s)</strong> uploaded</p>
                    <p style="font-size: 0.8rem; color: #666;">Click to add more</p>
                `;
            } else {
                uploadArea.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    <p><strong>${files[0].name}</strong></p>
                    <p style="font-size: 0.8rem; color: #666;">Click to change</p>
                `;
            }
        }
    }

    bindTaglineSelection() {
        // Will be populated by AI suggestions
        document.addEventListener('click', (e) => {
            if (e.target.closest('.tagline-option')) {
                const option = e.target.closest('.tagline-option');
                const radio = option.querySelector('input[type="radio"]');
                
                // Clear other selections
                document.querySelectorAll('.tagline-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                
                // Select this option
                option.classList.add('selected');
                radio.checked = true;
                
                this.contentSelections.tagline.selected = radio.value;
                this.updateSummary();
                this.saveSelections();
            }
        });

        // Custom tagline input
        const customTaglineInput = document.getElementById('custom-tagline');
        if (customTaglineInput) {
            customTaglineInput.addEventListener('input', (e) => {
                this.contentSelections.tagline.custom = e.target.value;
                
                // Unselect suggested taglines if custom is being used
                if (e.target.value.trim()) {
                    document.querySelectorAll('.tagline-option').forEach(opt => {
                        opt.classList.remove('selected');
                        opt.querySelector('input[type="radio"]').checked = false;
                    });
                    this.contentSelections.tagline.selected = null;
                }
                
                this.updateSummary();
                this.saveSelections();
            });
        }
    }

    bindContactInputs() {
        const contactInputs = document.querySelectorAll('#contact-section input, #contact-section textarea');
        
        contactInputs.forEach(input => {
            input.addEventListener('input', this.updateContactInfo.bind(this));
        });

        // Form type radio buttons
        const formTypeInputs = document.querySelectorAll('input[name="form_type"]');
        formTypeInputs.forEach(input => {
            input.addEventListener('change', this.updateContactInfo.bind(this));
        });
    }

    updateContactInfo() {
        this.contactInfo = {
            email: document.getElementById('business-email')?.value || '',
            phone: document.getElementById('business-phone')?.value || '',
            hours: document.getElementById('business-hours')?.value || '',
            address: document.getElementById('google-maps')?.value || '',
            useGmail: document.getElementById('use-gmail')?.checked || false,
            formType: document.querySelector('input[name="form_type"]:checked')?.value || 'contact'
        };

        this.updateSummary();
        this.saveSelections();
    }

    bindContentUpdates() {
        // About content textarea
        const aboutTextarea = document.getElementById('about-content');
        if (aboutTextarea) {
            aboutTextarea.addEventListener('input', (e) => {
                this.contentSelections.about.content = e.target.value;
                this.updateSummary();
                this.saveSelections();
            });
        }

        // Help question inputs
        const helpInputs = document.querySelectorAll('#about-help input, #about-help textarea');
        helpInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                this.contentSelections.about.helpAnswers[e.target.name] = e.target.value;
                this.generateHelpContent('about');
                this.saveSelections();
            });
        });
    }

    bindFormSubmission() {
        const form = document.getElementById('final-form');
        if (form) {
            form.addEventListener('submit', this.handleFormSubmission.bind(this));
        }
    }

    async generateAISuggestions() {
        // Get previous funnel data
        const previousData = this.getPreviousFunnelData();
        
        // Generate tagline suggestions based on previous selections
        this.generateTaglineSuggestions(previousData);
    }

    generateTaglineSuggestions(data) {
        // AI-inspired tagline generation based on business type and vibe
        const vibe = data.styleSelections?.vibe || 'friendly';
        const goals = data.selectedGoals || [];
        
        let suggestions = [];

        // Generate contextual taglines based on goals and vibe
        if (goals.includes('contact')) {
            suggestions.push({
                text: this.getVibeBasedTagline(vibe, 'contact'),
                note: 'Focused on getting in touch'
            });
        }
        
        if (goals.includes('showcase')) {
            suggestions.push({
                text: this.getVibeBasedTagline(vibe, 'showcase'),
                note: 'Highlights your work'
            });
        }
        
        if (goals.includes('book')) {
            suggestions.push({
                text: this.getVibeBasedTagline(vibe, 'booking'),
                note: 'Encourages appointments'
            });
        }

        // Add a general option
        suggestions.push({
            text: this.getVibeBasedTagline(vibe, 'general'),
            note: 'Professional and welcoming'
        });

        this.displayTaglineSuggestions(suggestions);
    }

    getVibeBasedTagline(vibe, goal) {
        const taglines = {
            friendly: {
                contact: "Let's work together to bring your vision to life",
                showcase: "See what we can create for you",
                booking: "Ready to get started? Let's chat!",
                general: "Your trusted partner for quality service"
            },
            luxe: {
                contact: "Experience exceptional service and craftsmanship",
                showcase: "Discover our portfolio of distinguished work",
                booking: "Schedule your exclusive consultation",
                general: "Elevating standards through premium service"
            },
            minimal: {
                contact: "Simple. Professional. Reliable.",
                showcase: "Quality work. Clean results.",
                booking: "Book your consultation today",
                general: "Professional service made simple"
            },
            bold: {
                contact: "Ready to make something amazing?",
                showcase: "Bold results that stand out",
                booking: "Let's create something extraordinary",
                general: "Making bold moves in business"
            },
            calming: {
                contact: "Find peace of mind with our reliable service",
                showcase: "Creating harmony through thoughtful design",
                booking: "Take the first step toward your goals",
                general: "Your calm, dependable partner"
            },
            trendy: {
                contact: "let's create something fresh together",
                showcase: "innovative work • modern results",
                booking: "ready to start something new?",
                general: "fresh ideas • modern solutions"
            }
        };

        return taglines[vibe]?.[goal] || taglines.friendly[goal];
    }

    displayTaglineSuggestions(suggestions) {
        const container = document.getElementById('tagline-suggestions');
        if (!container) return;

        container.innerHTML = suggestions.map((suggestion, index) => `
            <div class="tagline-option">
                <input type="radio" name="suggested_tagline" value="${suggestion.text}" id="tagline-${index}">
                <div class="tagline-text">${suggestion.text}</div>
                <div class="tagline-note">${suggestion.note}</div>
            </div>
        `).join('');
    }

    generateHelpContent(section) {
        if (section === 'about') {
            const answers = this.contentSelections.about.helpAnswers;
            
            // Simple AI-inspired content generation
            if (answers.about_years || answers.about_difference || answers.about_know) {
                let content = '';
                
                if (answers.about_know) {
                    content += `${answers.about_know}. `;
                }
                
                if (answers.about_years) {
                    content += `With ${answers.about_years} of experience, `;
                } else {
                    content += 'We ';
                }
                
                content += 'we are committed to providing exceptional service. ';
                
                if (answers.about_difference) {
                    content += `What sets us apart: ${answers.about_difference}.`;
                }

                // Update the manual textarea with generated content
                const textarea = document.getElementById('about-content');
                if (textarea && !textarea.value.trim()) {
                    textarea.value = content;
                    this.contentSelections.about.content = content;
                    this.updateSummary();
                }

                // Show AI suggestion
                this.showAISuggestion('about', content);
            }
        }
    }

    showAISuggestion(section, content) {
        const suggestionsDiv = document.getElementById(`${section}-suggestions`);
        if (!suggestionsDiv) return;

        suggestionsDiv.style.display = 'block';
        suggestionsDiv.innerHTML = `
            <h4><i class="fas fa-magic"></i> AI Suggestion</h4>
            <div class="suggestion-item" onclick="this.parentElement.parentElement.querySelector('textarea').value = '${content.replace(/'/g, "\\'")}'; this.parentElement.parentElement.querySelector('textarea').dispatchEvent(new Event('input'));">
                ${content}
            </div>
        `;
    }

    updateSummary() {
        this.updateStyleSummary();
        this.updateGoalsSummary();
        this.updateAudienceSummary();
        this.updateContentSummary();
        this.updateContactSummary();
    }

    updateStyleSummary() {
        const container = document.getElementById('style-summary');
        if (!container) return;

        const styleData = JSON.parse(sessionStorage.getItem('styleSelections') || '{}');
        
        container.innerHTML = `
            <div class="summary-item">
                <div class="summary-label">Vibe</div>
                <div class="summary-value">${styleData.vibe || 'Not selected'}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Colors</div>
                <div class="summary-value">
                    <span style="display: inline-block; width: 15px; height: 15px; background: ${styleData.colors?.primary || '#666'}; border-radius: 3px; margin-right: 5px;"></span>
                    <span style="display: inline-block; width: 15px; height: 15px; background: ${styleData.colors?.background || '#fff'}; border: 1px solid #ddd; border-radius: 3px; margin-right: 5px;"></span>
                    <span style="display: inline-block; width: 15px; height: 15px; background: ${styleData.colors?.accent || '#999'}; border-radius: 3px;"></span>
                </div>
            </div>
        `;
    }

    updateGoalsSummary() {
        const container = document.getElementById('goals-summary');
        if (!container) return;

        const goals = JSON.parse(sessionStorage.getItem('selectedGoals') || '[]');
        
        container.innerHTML = `
            <div class="summary-item">
                <div class="summary-value">${goals.length > 0 ? goals.join(', ') : 'No goals selected'}</div>
            </div>
        `;
    }

    updateAudienceSummary() {
        const container = document.getElementById('audience-summary');
        if (!container) return;

        const audienceData = JSON.parse(sessionStorage.getItem('audienceSelections') || '{}');
        
        container.innerHTML = `
            <div class="summary-item">
                <div class="summary-label">Target Audience</div>
                <div class="summary-value">${audienceData.summary || 'Not defined'}</div>
            </div>
        `;
    }

    updateContentSummary() {
        const container = document.getElementById('content-summary');
        if (!container) return;

        const about = this.contentSelections.about.content ? 'Complete' : 'Pending';
        const services = this.contentSelections.services.length;
        const tagline = this.contentSelections.tagline.selected || this.contentSelections.tagline.custom ? 'Selected' : 'Pending';

        container.innerHTML = `
            <div class="summary-item">
                <div class="summary-label">About Section</div>
                <div class="summary-value">${about}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Services</div>
                <div class="summary-value">${services} service(s) listed</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Headline</div>
                <div class="summary-value">${tagline}</div>
            </div>
        `;
    }

    updateContactSummary() {
        const container = document.getElementById('contact-summary');
        if (!container) return;

        container.innerHTML = `
            <div class="summary-item">
                <div class="summary-label">Contact Method</div>
                <div class="summary-value">${this.contactInfo.formType || 'Contact form'}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Business Email</div>
                <div class="summary-value">${this.contactInfo.email || 'Not provided'}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Phone</div>
                <div class="summary-value">${this.contactInfo.phone || 'Not provided'}</div>
            </div>
        `;
    }

    setupAutoSave() {
        // Auto-save every 5 seconds
        setInterval(() => {
            this.saveSelections();
        }, 5000);
    }

    saveSelections() {
        const finalData = {
            content: this.contentSelections,
            uploads: {
                hero: this.uploadedFiles.hero?.name || null,
                about: this.uploadedFiles.about?.name || null,
                gallery: this.uploadedFiles.gallery.map(f => f.name)
            },
            contact: this.contactInfo,
            timestamp: new Date().toISOString(),
            funnelStep: 5
        };

        sessionStorage.setItem('finalFormData', JSON.stringify(finalData));
        sessionStorage.setItem('funnelStep', '5');
    }

    loadPreviousData() {
        // Load any previously saved data
        const savedData = sessionStorage.getItem('finalFormData');
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                
                // Restore content selections
                if (data.content) {
                    this.contentSelections = { ...this.contentSelections, ...data.content };
                }
                
                // Restore contact info
                if (data.contact) {
                    this.contactInfo = data.contact;
                    this.populateContactForm();
                }
                
                // Restore about content
                if (this.contentSelections.about.content) {
                    const aboutTextarea = document.getElementById('about-content');
                    if (aboutTextarea) {
                        aboutTextarea.value = this.contentSelections.about.content;
                    }
                }

                console.log('Previous data loaded:', data);
            } catch (error) {
                console.error('Error loading previous data:', error);
            }
        }
    }

    populateContactForm() {
        // Populate contact form with saved data
        const fields = {
            'business-email': this.contactInfo.email,
            'business-phone': this.contactInfo.phone,
            'business-hours': this.contactInfo.hours,
            'google-maps': this.contactInfo.address,
            'use-gmail': this.contactInfo.useGmail
        };

        Object.entries(fields).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element && value) {
                if (element.type === 'checkbox') {
                    element.checked = value;
                } else {
                    element.value = value;
                }
            }
        });

        // Set form type
        if (this.contactInfo.formType) {
            const formTypeInput = document.querySelector(`input[name="form_type"][value="${this.contactInfo.formType}"]`);
            if (formTypeInput) {
                formTypeInput.checked = true;
            }
        }
    }

    getPreviousFunnelData() {
        return {
            contactInfo: JSON.parse(sessionStorage.getItem('contactInfo') || '{}'),
            selectedGoals: JSON.parse(sessionStorage.getItem('selectedGoals') || '[]'),
            audienceSelections: JSON.parse(sessionStorage.getItem('audienceSelections') || '{}'),
            styleSelections: JSON.parse(sessionStorage.getItem('styleSelections') || '{}')
        };
    }

    compileCompleteAIPrompt() {
        const previousData = this.getPreviousFunnelData();
        const currentData = JSON.parse(sessionStorage.getItem('finalFormData') || '{}');

        // Compile comprehensive AI prompt for Claude
        const completePrompt = {
            // Business Information
            businessName: previousData.contactInfo.businessName || 'Your Business',
            contactName: previousData.contactInfo.name || '',
            contactEmail: previousData.contactInfo.email || '',
            
            // Website Goals & Template
            siteGoals: previousData.selectedGoals,
            selectedTemplate: previousData.templateSelection,
            
            // Target Audience
            targetAudience: previousData.audienceSelections,
            
            // Visual Style
            visualStyle: {
                vibe: previousData.styleSelections.vibe,
                tone: previousData.styleSelections.tone,
                fonts: previousData.styleSelections.fonts,
                colors: previousData.styleSelections.colors
            },
            
            // Content
            content: {
                about: this.contentSelections.about,
                services: this.contentSelections.services,
                tagline: this.contentSelections.tagline.selected || this.contentSelections.tagline.custom
            },
            
            // Contact & Features
            contactSetup: this.contactInfo,
            
            // Media Assets
            images: currentData.uploads,
            
            // Technical Requirements
            formType: this.contactInfo.formType,
            
            // Meta Information
            timestamp: new Date().toISOString(),
            readyForDevelopment: true,
            funnelCompleted: true
        };

        return completePrompt;
    }

    async handleFormSubmission(e) {
        e.preventDefault();

        // Validate required fields
        if (!this.validateForm()) {
            return;
        }

        // Final save
        this.saveSelections();

        // Compile complete AI prompt
        const aiPrompt = this.compileCompleteAIPrompt();
        
        // Save final AI prompt data
        sessionStorage.setItem('completeAIPrompt', JSON.stringify(aiPrompt));
        
        console.log('Complete AI Prompt Ready:', aiPrompt);

        // Show loading state
        this.showLoadingState();

        // Simulate payment processing (replace with actual payment)
        try {
            await this.processPayment();
            
            // Redirect to success page
            window.location.href = 'payment-success.html';
            
        } catch (error) {
            console.error('Payment processing error:', error);
            this.showPaymentError();
        }
    }

    validateForm() {
        const requiredEmail = document.getElementById('business-email');
        
        if (!requiredEmail.value.trim()) {
            alert('Please provide your business email address.');
            requiredEmail.focus();
            return false;
        }

        if (!this.contentSelections.about.content && this.contentSelections.about.method === 'manual') {
            alert('Please provide information about your business.');
            document.getElementById('about-content').focus();
            return false;
        }

        return true;
    }

    showLoadingState() {
        const submitBtn = document.getElementById('secure-build-btn');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing Payment...';
        }
    }

    async processPayment() {
        // Simulate payment processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Here you would integrate with Stripe, PayPal, etc.
        // For now, we'll simulate success
        return { success: true, transactionId: 'TXN_' + Date.now() };
    }

    showPaymentError() {
        const submitBtn = document.getElementById('secure-build-btn');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-lock"></i> Secure Your Build - $150';
        }
        
        alert('There was an issue processing your payment. Please try again or contact support.');
    }

    // Public method to get complete AI data for external access
    getCompleteAIPrompt() {
        return this.compileCompleteAIPrompt();
    }

    // Helper method for smooth scrolling to sections
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

// Global scroll function for edit links
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.step5Handler = new Step5Handler();
});

// Add loading animations and enhanced interactions
document.addEventListener('DOMContentLoaded', () => {
    // Animate content sections on scroll
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

    // Observe all content sections
    const contentSections = document.querySelectorAll('.content-section');
    contentSections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Add subtle hover effects to upload areas
    const uploadAreas = document.querySelectorAll('.photo-upload-area');
    uploadAreas.forEach(area => {
        area.addEventListener('mouseenter', () => {
            area.style.transform = 'translateY(-2px)';
            area.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        });
        
        area.addEventListener('mouseleave', () => {
            area.style.transform = 'translateY(0)';
            area.style.boxShadow = 'none';
        });
    });

    // Enhanced form validation feedback
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            if (input.hasAttribute('required') && !input.value.trim()) {
                input.style.borderColor = '#ff4444';
                input.style.boxShadow = '0 0 0 3px rgba(255, 68, 68, 0.1)';
            } else {
                input.style.borderColor = '';
                input.style.boxShadow = '';
            }
        });

        input.addEventListener('input', () => {
            if (input.style.borderColor === 'rgb(255, 68, 68)') {
                input.style.borderColor = '';
                input.style.boxShadow = '';
            }
        });
    });

    // Progress indicator enhancement
    const progressSteps = document.querySelectorAll('.progress-step');
    progressSteps.forEach((step, index) => {
        step.style.animationDelay = `${index * 0.1}s`;
        step.classList.add('animate-in');
    });
});

// Add CSS for animations
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    .animate-in {
        animation: slideInUp 0.6s ease forwards;
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
    
    .photo-upload-area {
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    
    .service-item {
        animation: fadeInScale 0.4s ease forwards;
    }
    
    @keyframes fadeInScale {
        from {
            opacity: 0;
            transform: scale(0.95);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    .summary-card {
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    
    .summary-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(0,0,0,0.08);
    }
    
    .btn-lg {
        position: relative;
        overflow: hidden;
    }
    
    .btn-lg::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        transition: width 0.6s ease, height 0.6s ease;
    }
    
    .btn-lg:hover::before {
        width: 300px;
        height: 300px;
    }
    
    .tagline-option {
        transition: all 0.3s ease;
    }
    
    .tagline-option:hover {
        transform: translateX(5px);
    }
    
    .content-group {
        transition: box-shadow 0.3s ease;
    }
    
    .content-group:hover {
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }
    
    /* Loading spinner for AI suggestions */
    .ai-loading {
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 2px solid #f3f3f3;
        border-top: 2px solid var(--primary);
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    /* Success states */
    .upload-success {
        animation: successPulse 0.6s ease;
    }
    
    @keyframes successPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    /* Form validation states */
    .input-error {
        border-color: #ff4444 !important;
        box-shadow: 0 0 0 3px rgba(255, 68, 68, 0.1) !important;
    }
    
    .input-success {
        border-color: #4CAF50 !important;
        box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1) !important;
    }
`;

document.head.appendChild(additionalStyles);