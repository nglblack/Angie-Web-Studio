// Step 3: Target Audience Discovery - Chatbot Experience
class Step3Handler {
    constructor() {
        this.audienceData = {
            enjoyWorking: new Set(),
            bookQuickly: new Set(),
            decisionMaker: '',
            customDescription: '',
            conversationHistory: []
        };
        this.audienceProfiles = this.initializeAudienceProfiles();
        this.isGenerating = false;
        this.isTyping = false;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadPreviousSelections();
    }

    initializeAudienceProfiles() {
            // Business-focused audience profile templates
            return {
                'quality_trust_individual': {
                    title: 'The Quality-Focused Professional',
                    description: 'Meet Sarah, a 35-45 year old professional earning $80-130k who values expertise and quality work above low prices. Her biggest pain point is finding reliable service providers who don\'t cut corners or require constant oversight. Sarah is triggered to seek services when current solutions fail to meet her standards or when she realizes her time is better spent on higher-value activities.',
                    messaging: 'She responds to credentials, case studies, and clear processes. Emphasize your track record of excellence and premium service approach.'
                },
                'locals_rush_individual': {
                    title: 'The Busy Local Business Owner',
                    description: 'Think of Mike, a 30-50 year old local business owner with $60-100k income who needs quick, dependable service and values community connections. His main frustration is providers who don\'t understand the urgency of small business needs or who over-complicate simple requests. Mike makes decisions quickly based on local referrals and demonstrated responsiveness.',
                    messaging: 'He chooses providers who answer their phone first and can start immediately. Emphasize your local presence, quick turnaround, and straightforward approach.'
                },
                'quality_ready_commit_business': {
                    title: 'The Strategic Decision Maker',
                    description: 'Consider Lisa, a 35-55 year old corporate decision-maker earning $90-160k who manages budgets for a growing company. Her challenge is justifying expenses to leadership while ensuring quality doesn\'t suffer. She seeks services when facing compliance issues, growth challenges, or when current solutions can\'t scale with business needs.',
                    messaging: 'She needs clear ROI documentation and structured contracts. Focus on your professional credentials, measurable results, and business impact.'
                },
                'overwhelmed_trust_parent': {
                    title: 'The Overwhelmed Family Manager',
                    description: 'Meet Jennifer, a 35-48 year old professional earning $70-120k who manages both career and family responsibilities, including eldercare. Her biggest frustration is service providers who don\'t understand her complex scheduling constraints or who require too much hands-on management. She needs flexible scheduling and clear communication.',
                    messaging: 'She\'s willing to pay premium rates for services that truly reduce her stress. Emphasize how you simplify the process and work independently.'
                },
                'default': {
                    title: 'Your Ideal Customer',
                    description: 'Your ideal customer is someone like Jennifer, a 35-50 year old busy professional earning $70-130k who values quality service and clear communication. Her main pain point is finding reliable providers who understand her time constraints and deliver consistent results without requiring constant oversight. She makes thoughtful decisions based on reviews and referrals.',
                    messaging: 'She responds to providers who are responsive, transparent about pricing, and can demonstrate clear value. Focus on reliability and time-saving benefits.'
                }
            };
        }

    bindEvents() {
        // Checkbox selections
        document.querySelectorAll('.audience-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.handleCheckboxChange(e.target);
            });
        });

        // Radio button selections
        document.querySelectorAll('.audience-radio').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.handleRadioChange(e.target);
            });
        });

        // Custom description with debounce
        const customTextarea = document.getElementById('custom_description');
        if (customTextarea) {
            let debounceTimer = null;
            
            customTextarea.addEventListener('input', (e) => {
                // Save the text immediately (for form saving)
                this.audienceData.customDescription = e.target.value;
                this.saveSelections();
                
                // Clear existing timer
                if (debounceTimer) {
                    clearTimeout(debounceTimer);
                }
                
                // Only trigger AI generation after user stops typing for 3 seconds
                if (e.target.value.trim().length > 10) {
                    debounceTimer = setTimeout(() => {
                        this.updateAudiencePreview();
                    }, 3000); // 3 second delay
                }
            });
        }

        // Profile editor enter key
        const profileEditor = document.getElementById('ai-profile-editor');
        if (profileEditor) {
            profileEditor.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    generateOrRevise();
                }
            });
        }

        // Form submission
        const form = document.getElementById('audience-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.proceedToNextStep();
            });
        }
    }

    handleCheckboxChange(checkbox) {
        const fieldName = checkbox.name.replace('[]', '');
        const value = checkbox.value;
        const label = checkbox.closest('.checkbox-option').querySelector('.checkbox-label');

        if (checkbox.checked) {
            this.audienceData[this.camelCase(fieldName)].add(value);
            label.classList.add('selected');
        } else {
            this.audienceData[this.camelCase(fieldName)].delete(value);
            label.classList.remove('selected');
        }

        this.updateAudiencePreview();
        this.updateContinueButton();
        this.saveSelections();
    }

    handleRadioChange(radio) {
        const value = radio.value;
        const labels = document.querySelectorAll('.radio-label');
        
        // Remove selected class from all radio labels
        labels.forEach(label => label.classList.remove('selected'));
        
        // Add selected class to chosen option
        const selectedLabel = radio.closest('.radio-option').querySelector('.radio-label');
        selectedLabel.classList.add('selected');

        this.audienceData.decisionMaker = value;
        
        this.updateAudiencePreview();
        this.updateContinueButton();
        this.saveSelections();
    }

        handleCustomDescription(value) {
            this.audienceData.customDescription = value;
            // Remove the immediate updateAudiencePreview() call
            // this.updateAudiencePreview(); // REMOVE THIS LINE
            this.saveSelections();
        }

    camelCase(str) {
        return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
    }

    updateContinueButton() {
        const continueBtn = document.getElementById('continue-btn');
        if (!continueBtn) return;

        const hasMinimumSelections = 
            this.audienceData.enjoyWorking.size > 0 || 
            this.audienceData.bookQuickly.size > 0 || 
            this.audienceData.decisionMaker !== '';
        
        continueBtn.disabled = !hasMinimumSelections;
        
        if (hasMinimumSelections) {
            continueBtn.innerHTML = `Continue <i class="fas fa-arrow-right"></i>`;
        } else {
            continueBtn.innerHTML = `Make at least one selection <i class="fas fa-arrow-right"></i>`;
        }
    }

    updateAudiencePreview() {
        const previewSection = document.getElementById('audience-preview');

        if (!previewSection) return;

        // Check if we have enough data to generate a profile
        const hasData = 
            this.audienceData.enjoyWorking.size > 0 || 
            this.audienceData.bookQuickly.size > 0 || 
            this.audienceData.decisionMaker !== '';

        if (!hasData) {
            previewSection.style.display = 'none';
            return;
        }

        // Show the preview section
        previewSection.style.display = 'block';

        // Generate AI profile if custom description provided OR if this is a subsequent interaction
        if (this.audienceData.customDescription.trim() && window.openai_integration) {
            this.showLoadingAndGenerateAI();
        } else {
            // Show standard profile
            this.displayStandardProfile();
        }
    }

    showLoadingAndGenerateAI() {
        const loadingState = document.getElementById('ai-loading');
        const profileDisplay = document.getElementById('ai-profile-display');
        
        if (loadingState && profileDisplay) {
            // Show loading state first
            loadingState.style.display = 'block';
            profileDisplay.style.display = 'none';
            
            // Generate AI profile after realistic delay
            setTimeout(() => {
                this.generateAIAudienceProfile();
            }, 1500); // 1.5 second delay to feel more natural
        }
    }

    displayStandardProfile() {
        const profileDisplay = document.getElementById('ai-profile-display');
        const loadingState = document.getElementById('ai-loading');
        
        if (!profileDisplay || !loadingState) return;

        // Hide loading, show profile
        loadingState.style.display = 'none';
        profileDisplay.style.display = 'block';
        
        // Generate standard profile
        const profile = this.generateAudienceProfile();
        const profileText = `${profile.description} ${profile.messaging}`;
        
        // Type out standard profile
        this.typeOutResponse(profileText);
    }

    async generateAIAudienceProfile() {
        if (this.isGenerating) return;
        this.isGenerating = true;

        const userData = {
            description: this.audienceData.customDescription,
            businessType: JSON.parse(sessionStorage.getItem('selectedGoals') || '[]').join(', '),
            enjoyWorking: Array.from(this.audienceData.enjoyWorking).join(', '),
            bookQuickly: Array.from(this.audienceData.bookQuickly).join(', '),
            decisionMaker: this.audienceData.decisionMaker,
            conversationHistory: this.audienceData.conversationHistory
        };
        
        if (!window.openai_integration) {
            console.error('OpenAI integration not available');
            this.displayStandardProfile();
            this.isGenerating = false;
            return;
        }

        // Show typing indicator
        this.showTypingIndicator();

        try {
            const aiProfile = await window.openai_integration.generateContent('audience', userData);
            
            if (aiProfile) {
                // Add to conversation history
                this.audienceData.conversationHistory.push({
                    input: userData.description,
                    output: aiProfile,
                    timestamp: new Date().toISOString()
                });
                
                this.typeOutResponse(aiProfile);
            } else {
                this.displayStandardProfile();
            }
        } catch (error) {
            console.error('AI generation failed:', error);
            this.displayStandardProfile();
        }
        
        this.isGenerating = false;
    }

    showTypingIndicator() {
        const loadingState = document.getElementById('ai-loading');
        const profileDisplay = document.getElementById('ai-profile-display');
        const typingIndicator = document.getElementById('typing-indicator');
        const textContent = document.getElementById('ai-text-content');
        
        if (loadingState && profileDisplay && typingIndicator) {
            loadingState.style.display = 'none';
            profileDisplay.style.display = 'block';
            typingIndicator.style.display = 'flex';
            
            if (textContent) {
                textContent.innerHTML = '';
            }
        }
    }

        async typeOutResponse(text) {
    const typingIndicator = document.getElementById('typing-indicator');
    const textContent = document.getElementById('ai-text-content');
    const editor = document.getElementById('ai-profile-editor');
    
    if (!textContent) return;

    // Stop any existing typing animation first
    if (this.currentTypeInterval) {
        clearInterval(this.currentTypeInterval);
        this.currentTypeInterval = null;
    }

    // Hide typing indicator
    if (typingIndicator) {
        typingIndicator.style.display = 'none';
    }
    
    // Clear previous content
    textContent.innerHTML = '';

    // ADD FALLBACK FOR SCRAMBLED TEXT
    if (/[^\x00-\x7F]/.test(text) || text.includes('aeeieeie')) {
        text = "Your ideal customers value quality service and appreciate working with professionals who understand their unique needs and deliver reliable results.";
    }
    
    // Type out the text
    let index = 0;
    const typeSpeed = 20; // milliseconds per character
    
    this.currentTypeInterval = setInterval(() => {
        if (index < text.length) {
            textContent.textContent = text.substring(0, index + 1);
            index++;
            
            // Auto-scroll the container if needed
            const aiContent = document.querySelector('.ai-content');
            if (aiContent) {
                aiContent.scrollTop = aiContent.scrollHeight;
            }
        } else {
            clearInterval(this.currentTypeInterval);
            this.currentTypeInterval = null;
            
            // Copy to editor when done typing (but don't overwrite if user is typing)
            if (editor && !editor.value.trim()) {
                editor.value = text;
            }
            
            // Save to session
            sessionStorage.setItem('audienceProfile', text);
            sessionStorage.setItem('aiGeneratedProfile', text);
            
            // Clear the input after successful generation
            this.clearUserInput();
        }
    }, typeSpeed);
}

    clearUserInput() {
        const editor = document.getElementById('ai-profile-editor');
        if (editor) {
            editor.value = '';
            editor.placeholder = 'Ask me to revise the profile above, or add more details...';
        }
    }

    generateAudienceProfile() {
        // Create a key based on selections to match with profiles
        const enjoyFirst = [...this.audienceData.enjoyWorking][0] || '';
        const bookFirst = [...this.audienceData.bookQuickly][0] || '';
        const decision = this.audienceData.decisionMaker;

        // Try to find a matching profile
        const profileKey = `${enjoyFirst}_${bookFirst}_${decision}`;
        
        if (this.audienceProfiles[profileKey]) {
            return this.audienceProfiles[profileKey];
        }

        // Fall back to simpler combinations
        const simpleKeys = [
            `${enjoyFirst}_${decision}`,
            `${bookFirst}_${decision}`,
            `${enjoyFirst}_${bookFirst}`,
            enjoyFirst,
            bookFirst,
            decision
        ];

        for (const key of simpleKeys) {
            if (this.audienceProfiles[key]) {
                return this.audienceProfiles[key];
            }
        }

        // Generate a custom profile based on selections
        return this.generateCustomProfile();
    }

    generateCustomProfile() {
        let title = 'Your Ideal Customer';
        let description = 'Your ideal customer is someone like Alex, a busy professional earning $70-120k who ';
        let messaging = 'They respond to ';

        // Build description based on selections
        const traits = [];
        
        if (this.audienceData.enjoyWorking.has('quality')) {
            traits.push('values quality work and proven expertise');
        }
        if (this.audienceData.enjoyWorking.has('locals')) {
            traits.push('prefers working with local, trusted providers');
        }
        if (this.audienceData.enjoyWorking.has('trust')) {
            traits.push('seeks long-term partnerships with reliable professionals');
        }

        if (this.audienceData.bookQuickly.has('rush')) {
            traits.push('often faces tight deadlines and needs quick response times');
        }
        if (this.audienceData.bookQuickly.has('overwhelmed')) {
            traits.push('feels overwhelmed by options and needs clear guidance');
        }
        if (this.audienceData.bookQuickly.has('ready_commit')) {
            traits.push('makes decisions quickly when they find the right provider');
        }

        if (traits.length > 0) {
            if (traits.length === 1) {
                description += traits[0];
            } else if (traits.length === 2) {
                description += traits.join(' and ');
            } else {
                description += traits.slice(0, -1).join(', ') + ', and ' + traits[traits.length - 1];
            }
        } else {
            description += 'is looking for professional, reliable service';
        }

        description += '. They have a moderate budget and prioritize value over the lowest price.';

        // Add custom description if provided
        if (this.audienceData.customDescription.trim()) {
            description += ` Additional context: ${this.audienceData.customDescription.trim()}`;
        }

        // Generate business-focused messaging strategy
        if (this.audienceData.enjoyWorking.has('quality') || this.audienceData.enjoyWorking.has('trust')) {
            messaging += 'credentials, case studies, and clear processes that demonstrate your expertise and track record.';
        } else if (this.audienceData.enjoyWorking.has('locals')) {
            messaging += 'local testimonials, community involvement, and personal connections that build trust.';
        } else if (this.audienceData.bookQuickly.has('rush')) {
            messaging += 'quick response times, immediate availability, and streamlined processes that save time.';
        } else if (this.audienceData.bookQuickly.has('overwhelmed')) {
            messaging += 'clear explanations, step-by-step guidance, and taking care of details so they can focus on what matters.';
        } else {
            messaging += 'clear communication, transparent pricing, and proven results that justify their investment.';
        }

        return {
            title,
            description,
            messaging
        };
    }

    saveSelections() {
        const data = {
            enjoyWorking: Array.from(this.audienceData.enjoyWorking),
            bookQuickly: Array.from(this.audienceData.bookQuickly),
            decisionMaker: this.audienceData.decisionMaker,
            customDescription: this.audienceData.customDescription,
            conversationHistory: this.audienceData.conversationHistory,
            timestamp: new Date().toISOString()
        };
        
        sessionStorage.setItem('audienceSelections', JSON.stringify(data));
    }

    loadPreviousSelections() {
        const saved = sessionStorage.getItem('audienceSelections');
        if (!saved) return;

        try {
            const data = JSON.parse(saved);

            // Restore checkbox selections
            data.enjoyWorking?.forEach(value => {
                const checkbox = document.querySelector(`input[name="enjoy_working[]"][value="${value}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                    this.audienceData.enjoyWorking.add(value);
                    const label = checkbox.closest('.checkbox-option').querySelector('.checkbox-label');
                    if (label) label.classList.add('selected');
                }
            });

            data.bookQuickly?.forEach(value => {
                const checkbox = document.querySelector(`input[name="book_quickly[]"][value="${value}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                    this.audienceData.bookQuickly.add(value);
                    const label = checkbox.closest('.checkbox-option').querySelector('.checkbox-label');
                    if (label) label.classList.add('selected');
                }
            });

            // Restore radio selection
            if (data.decisionMaker) {
                const radio = document.querySelector(`input[name="decision_maker"][value="${data.decisionMaker}"]`);
                if (radio) {
                    radio.checked = true;
                    this.audienceData.decisionMaker = data.decisionMaker;
                    const label = radio.closest('.radio-option').querySelector('.radio-label');
                    if (label) label.classList.add('selected');
                }
            }

            // Restore custom description
            if (data.customDescription) {
                const textarea = document.getElementById('custom_description');
                if (textarea) {
                    textarea.value = data.customDescription;
                    this.audienceData.customDescription = data.customDescription;
                }
            }

            // Restore conversation history
            if (data.conversationHistory) {
                this.audienceData.conversationHistory = data.conversationHistory;
            }

            this.updateContinueButton();
            this.updateAudiencePreview();
        } catch (error) {
            console.error('Error loading previous selections:', error);
        }
    }

    getCurrentProfileText() {
        const textContent = document.getElementById('ai-text-content');
        return textContent ? textContent.textContent : '';
    }

    proceedToNextStep() {
        // Save the current AI-generated profile
        const currentProfile = this.getCurrentProfileText();
        if (currentProfile) {
            sessionStorage.setItem('audienceProfile', currentProfile);
            sessionStorage.setItem('finalAudienceProfile', currentProfile);
        }
        
        // Save final selections
        this.saveSelections();
        
        // Redirect to step 4
        window.location.href = 'step4.html';
    }
}

// Global chatbot functions
async function generateOrRevise() {
    const editor = document.getElementById('ai-profile-editor');
    const btn = document.querySelector('.generate-btn');
    
    if (!editor || !editor.value.trim()) return;
    if (!window.step3Handler || window.step3Handler.isGenerating) return;
    
    // Update button state
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    
    // Update the custom description with user input
    const userInput = editor.value.trim();
    const currentProfile = window.step3Handler.getCurrentProfileText();
    
    // Create context-aware prompt
    if (currentProfile) {
        window.step3Handler.audienceData.customDescription = `Current profile: "${currentProfile}"\n\nUser request: ${userInput}`;
    } else {
        window.step3Handler.audienceData.customDescription = userInput;
    }
    
    // Generate AI response
    await window.step3Handler.generateAIAudienceProfile();
    
    // Reset button
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-paper-plane"></i>';
}

function quickRevise(instruction) {
    const editor = document.getElementById('ai-profile-editor');
    const currentText = document.getElementById('ai-text-content')?.textContent;
    
    if (!currentText) {
        editor.value = `Create a customer profile that is ${instruction}.`;
    } else {
        // Set up the revision request properly
        editor.value = `Please make this ${instruction}.`;
        
        // Update the handler's description to include current profile
        if (window.step3Handler) {
            window.step3Handler.audienceData.customDescription = `Current profile: "${currentText}"\n\nUser request: Please make this ${instruction}.`;
        }
    }
    
    // Trigger the generation
    generateOrRevise();
}

// Global function for back button
function goBack() {
    window.location.href = 'step2.html';
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.step3Handler = new Step3Handler();
});

// Add entrance animations
document.addEventListener('DOMContentLoaded', () => {
    // Animate audience questions on load
    const questions = document.querySelectorAll('.audience-question');
    questions.forEach((question, index) => {
        question.style.opacity = '0';
        question.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            question.style.transition = 'all 0.8s ease';
            question.style.opacity = '1';
            question.style.transform = 'translateY(0)';
        }, index * 200);
    });

    // Animate checkbox and radio options
    const options = document.querySelectorAll('.checkbox-option, .radio-option');
    options.forEach((option, index) => {
        option.style.opacity = '0';
        option.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            option.style.transition = 'all 0.6s ease';
            option.style.opacity = '1';
            option.style.transform = 'translateX(0)';
        }, 300 + (index * 50));
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to send message
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        generateOrRevise();
    }
});

// Auto-resize textarea
document.addEventListener('DOMContentLoaded', () => {
    const editor = document.getElementById('ai-profile-editor');
    if (editor) {
        editor.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 150) + 'px';
        });
    }
});