/**
 * STEP 4 JAVASCRIPT - VISUAL STYLE SELECTION
 * Handles vibe selection, dynamic previews, and AI data compilation
 */

class Step4Handler {
    constructor() {
        this.selectedVibe = null;
        this.uploadedLogo = null;
        this.customColors = {
            primary: null,
            background: null,
            accent: null
        };
        
        // Vibe configurations for AI processing
        this.vibeConfigs = {
            friendly: {
                fonts: {
                    heading: 'Lato',
                    body: 'Lato'
                },
                colors: {
                    primary: '#4CAF50',
                    background: '#FFF9E6',
                    accent: '#2D5016'
                },
                tone: 'warm, approachable, welcoming'
            },
            luxe: {
                fonts: {
                    heading: 'Playfair Display',
                    body: 'Lato'
                },
                colors: {
                    primary: '#8B4513',
                    background: '#F8F6F0',
                    accent: '#2C1810'
                },
                tone: 'elegant, sophisticated, premium'
            },
            minimal: {
                fonts: {
                    heading: 'Lato',
                    body: 'Lato'
                },
                colors: {
                    primary: '#222222',
                    background: '#FAFAFA',
                    accent: '#666666'
                },
                tone: 'clean, simple, focused'
            },
            bold: {
                fonts: {
                    heading: 'Montserrat',
                    body: 'Lato'
                },
                colors: {
                    primary: '#FF6B35',
                    background: '#FFFFFF',
                    accent: '#F7931E'
                },
                tone: 'strong, confident, eye-catching'
            },
            calming: {
                fonts: {
                    heading: 'Lato',
                    body: 'Lato'
                },
                colors: {
                    primary: '#5A9BC4',
                    background: '#E8F4F8',
                    accent: '#1B4A66'
                },
                tone: 'peaceful, serene, trustworthy'
            },
            trendy: {
                fonts: {
                    heading: 'Poppins',
                    body: 'Lato'
                },
                colors: {
                    primary: '#667eea',
                    background: '#FFFFFF',
                    accent: '#764ba2'
                },
                tone: 'modern, fresh, innovative'
            }
        };

        this.init();
    }

    init() {
        this.bindEvents();
        this.loadPreviousSelections();
        this.updateContinueButton();
    }

    bindEvents() {
        // Vibe selection - handle clicks on entire vibe option
        const vibeOptions = document.querySelectorAll('.vibe-option');
        vibeOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                const vibeValue = option.getAttribute('data-vibe');
                const radioInput = option.querySelector('input[name="vibe"]');
                
                if (radioInput) {
                    // Uncheck all other radio buttons
                    document.querySelectorAll('input[name="vibe"]').forEach(input => {
                        input.checked = false;
                    });
                    
                    // Check the clicked radio button
                    radioInput.checked = true;
                    
                    // Handle the selection
                    this.handleVibeSelection(vibeValue);
                }
            });
        });

        // Also handle direct radio input changes (for keyboard navigation)
        const vibeInputs = document.querySelectorAll('input[name="vibe"]');
        vibeInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.handleVibeSelection(e.target.value);
                }
            });
        });

        // Advanced options toggle
        const advancedToggle = document.getElementById('advanced-toggle');
        if (advancedToggle) {
            advancedToggle.addEventListener('click', this.toggleAdvancedOptions.bind(this));
        }

        // Logo upload
        const logoUpload = document.getElementById('logo-upload');
        const logoFile = document.getElementById('logo-file');
        if (logoUpload && logoFile) {
            logoUpload.addEventListener('click', () => logoFile.click());
            logoUpload.addEventListener('dragover', this.handleDragOver.bind(this));
            logoUpload.addEventListener('drop', this.handleLogoDrop.bind(this));
            logoFile.addEventListener('change', this.handleLogoUpload.bind(this));
        }

        // Custom color inputs
        const hexInputs = document.querySelectorAll('#advanced-options input[type="text"]');
        hexInputs.forEach(input => {
            input.addEventListener('input', this.handleCustomColorChange.bind(this));
            input.addEventListener('blur', this.validateHexColor.bind(this));
        });

        // Form submission
        const form = document.getElementById('style-form');
        if (form) {
            form.addEventListener('submit', this.handleFormSubmit.bind(this));
        }

        // Auto-save functionality
        setInterval(() => {
            this.saveSelections();
        }, 3000); // Save every 3 seconds
    }

    handleVibeSelection(vibe) {
        this.selectedVibe = vibe;
        this.updateVibePreview(vibe);
        this.updateFontPreview(vibe);
        this.updateColorPreview(vibe);
        this.updateContinueButton();
        this.saveSelections();

        // Smooth scroll to show the font and color previews
        const fontSection = document.getElementById('font-section');
        const colorSection = document.getElementById('color-section');
        
        if (fontSection && colorSection) {
            fontSection.style.display = 'block';
            colorSection.style.display = 'block';
            
            // Animate the appearance
            setTimeout(() => {
                fontSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 300);
        }
    }

    updateVibePreview(vibe) {
        // Visual feedback is handled by CSS, but we can add additional interactions here
        const vibeOption = document.querySelector(`[data-vibe="${vibe}"]`);
        if (vibeOption) {
            // Remove any existing selection animations
            document.querySelectorAll('.vibe-option').forEach(option => {
                option.classList.remove('selecting');
            });
            
            // Add selection animation
            vibeOption.classList.add('selecting');
            
            // Remove animation class after animation completes
            setTimeout(() => {
                vibeOption.classList.remove('selecting');
            }, 600);
        }
    }

    updateFontPreview(vibe) {
        const config = this.vibeConfigs[vibe];
        const heading = document.getElementById('sample-heading');
        const text = document.getElementById('sample-text');
        
        if (heading && text && config) {
            // Update font families
            heading.style.fontFamily = `'${config.fonts.heading}', serif`;
            text.style.fontFamily = `'${config.fonts.body}', sans-serif`;
            
            // Update colors to match vibe
            heading.style.color = config.colors.primary;
            text.style.color = config.colors.accent;
        }
    }

    updateColorPreview(vibe) {
        const config = this.vibeConfigs[vibe];
        if (!config) return;

        const primarySwatch = document.getElementById('primary-color');
        const backgroundSwatch = document.getElementById('background-color');
        const accentSwatch = document.getElementById('accent-color');

        if (primarySwatch) {
            primarySwatch.style.backgroundColor = config.colors.primary;
            primarySwatch.style.color = this.getContrastColor(config.colors.primary);
        }

        if (backgroundSwatch) {
            backgroundSwatch.style.backgroundColor = config.colors.background;
            backgroundSwatch.style.color = this.getContrastColor(config.colors.background);
        }

        if (accentSwatch) {
            accentSwatch.style.backgroundColor = config.colors.accent;
            accentSwatch.style.color = this.getContrastColor(config.colors.accent);
        }

        // Update the HEX input fields
        const primaryHex = document.getElementById('primary-hex');
        const backgroundHex = document.getElementById('background-hex');
        const accentHex = document.getElementById('accent-hex');

        if (primaryHex) primaryHex.placeholder = config.colors.primary;
        if (backgroundHex) backgroundHex.placeholder = config.colors.background;
        if (accentHex) accentHex.placeholder = config.colors.accent;
    }

    getContrastColor(hexColor) {
        // Convert hex to RGB
        const r = parseInt(hexColor.substr(1, 2), 16);
        const g = parseInt(hexColor.substr(3, 2), 16);
        const b = parseInt(hexColor.substr(5, 2), 16);
        
        // Calculate luminance
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        
        // Return black or white based on luminance
        return luminance > 0.5 ? '#000000' : '#FFFFFF';
    }

    toggleAdvancedOptions() {
        const toggle = document.getElementById('advanced-toggle');
        const options = document.getElementById('advanced-options');
        
        if (toggle && options) {
            const isVisible = options.style.display !== 'none';
            
            if (isVisible) {
                options.style.display = 'none';
                toggle.classList.remove('active');
            } else {
                options.style.display = 'block';
                toggle.classList.add('active');
                
                // Smooth scroll to advanced options
                setTimeout(() => {
                    options.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 100);
            }
        }
    }

    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        e.target.closest('.upload-area').classList.add('dragover');
    }

    handleLogoDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        e.target.closest('.upload-area').classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.processLogoFile(files[0]);
        }
    }

    handleLogoUpload(e) {
        const file = e.target.files[0];
        if (file) {
            this.processLogoFile(file);
        }
    }

    processLogoFile(file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file.');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB.');
            return;
        }

        this.uploadedLogo = file;
        
        // Update upload area to show success
        const uploadArea = document.getElementById('logo-upload');
        if (uploadArea) {
            uploadArea.innerHTML = `
                <i class="fas fa-check-circle" style="color: #4CAF50;"></i>
                <p><strong>${file.name}</strong> uploaded successfully</p>
                <p style="font-size: 0.8rem; color: #666;">Click to change</p>
            `;
            uploadArea.style.borderColor = '#4CAF50';
            uploadArea.style.backgroundColor = '#f0f8f0';
        }

        this.saveSelections();
    }

    handleCustomColorChange(e) {
        const input = e.target;
        const colorType = input.id.replace('-hex', '');
        
        if (this.isValidHexColor(input.value)) {
            this.customColors[colorType.replace('primary', 'primary').replace('background', 'background').replace('accent', 'accent')] = input.value;
            this.updateCustomColorPreview(colorType, input.value);
        }
    }

    validateHexColor(e) {
        const input = e.target;
        if (input.value && !this.isValidHexColor(input.value)) {
            input.style.borderColor = '#ff4444';
            input.title = 'Please enter a valid hex color (e.g., #FF5733)';
        } else {
            input.style.borderColor = '#d0d0d0';
            input.title = '';
        }
    }

    isValidHexColor(hex) {
        return /^#[0-9A-F]{6}$/i.test(hex);
    }

    updateCustomColorPreview(colorType, hexValue) {
        const swatchId = colorType + '-color';
        const swatch = document.getElementById(swatchId);
        
        if (swatch) {
            swatch.style.backgroundColor = hexValue;
            swatch.style.color = this.getContrastColor(hexValue);
        }
    }

    updateContinueButton() {
        const continueBtn = document.getElementById('continue-btn');
        if (continueBtn) {
            continueBtn.disabled = !this.selectedVibe;
        }
    }

    saveSelections() {
        if (!this.selectedVibe) return;

        const config = this.vibeConfigs[this.selectedVibe];
        const styleData = {
            vibe: this.selectedVibe,
            tone: config.tone,
            fonts: config.fonts,
            colors: {
                primary: this.customColors.primary || config.colors.primary,
                background: this.customColors.background || config.colors.background,
                accent: this.customColors.accent || config.colors.accent
            },
            logoFile: this.uploadedLogo ? this.uploadedLogo.name : null,
            timestamp: new Date().toISOString()
        };

        // Save to sessionStorage for funnel progression
        sessionStorage.setItem('styleSelections', JSON.stringify(styleData));
        
        // Save user progress
        sessionStorage.setItem('funnelStep', '4');

        // Console log for debugging
        console.log('Style selections saved:', styleData);
    }

    loadPreviousSelections() {
        const savedData = sessionStorage.getItem('styleSelections');
        if (savedData) {
            try {
                const styleData = JSON.parse(savedData);
                
                // Restore vibe selection
                if (styleData.vibe) {
                    const vibeInput = document.querySelector(`input[value="${styleData.vibe}"]`);
                    if (vibeInput) {
                        vibeInput.checked = true;
                        this.handleVibeSelection(styleData.vibe);
                    }
                }

                // Restore custom colors
                if (styleData.colors) {
                    const primaryHex = document.getElementById('primary-hex');
                    const backgroundHex = document.getElementById('background-hex');
                    const accentHex = document.getElementById('accent-hex');

                    if (primaryHex && styleData.colors.primary !== this.vibeConfigs[styleData.vibe]?.colors.primary) {
                        primaryHex.value = styleData.colors.primary;
                        this.customColors.primary = styleData.colors.primary;
                    }
                    if (backgroundHex && styleData.colors.background !== this.vibeConfigs[styleData.vibe]?.colors.background) {
                        backgroundHex.value = styleData.colors.background;
                        this.customColors.background = styleData.colors.background;
                    }
                    if (accentHex && styleData.colors.accent !== this.vibeConfigs[styleData.vibe]?.colors.accent) {
                        accentHex.value = styleData.colors.accent;
                        this.customColors.accent = styleData.colors.accent;
                    }
                }

                console.log('Previous selections loaded:', styleData);
            } catch (error) {
                console.error('Error loading previous selections:', error);
            }
        }
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        if (!this.selectedVibe) {
            alert('Please select a vibe for your website.');
            return;
        }

        // Final save before proceeding
        this.saveSelections();
        
        // Compile AI prompt data
        this.compileAIPromptData();
        
        // Redirect to next step
        window.location.href = 'step5.html';
    }

    compileAIPromptData() {
        // Get all previous funnel data
        const contactInfo = JSON.parse(sessionStorage.getItem('contactInfo') || '{}');
        const goalSelections = JSON.parse(sessionStorage.getItem('selectedGoals') || '[]');
        const audienceData = JSON.parse(sessionStorage.getItem('audienceSelections') || '{}');
        const styleData = JSON.parse(sessionStorage.getItem('styleSelections') || '{}');

        // Compile comprehensive AI prompt data
        const aiPromptData = {
            // Step 1: Contact Info
            businessName: contactInfo.businessName || 'Your Business',
            contactName: contactInfo.name || '',
            email: contactInfo.email || '',
            
            // Step 2: Goals
            siteGoals: goalSelections,
            
            // Step 3: Audience
            targetAudience: audienceData,
            
            // Step 4: Style
            visualStyle: styleData,
            
            // AI Processing Ready
            timestamp: new Date().toISOString(),
            funnelStep: 4,
            readyForAI: true
        };

        // Save compiled data for AI processing
        sessionStorage.setItem('aiPromptData', JSON.stringify(aiPromptData));
        
        console.log('AI Prompt Data Compiled:', aiPromptData);
        
        return aiPromptData;
    }

    // Public method for external access to AI data
    getAIPromptData() {
        return this.compileAIPromptData();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Step4Handler();
});

// Add CSS animation for vibe selection
const style = document.createElement('style');
style.textContent = `
    .vibe-option.selecting {
        animation: vibeSelect 0.6s ease-out;
    }
    
    @keyframes vibeSelect {
        0% { transform: scale(1); }
        50% { transform: scale(1.02); }
        100% { transform: scale(1); }
    }
    
    .upload-area.dragover {
        border-color: var(--primary) !important;
        background-color: rgba(109, 0, 26, 0.05) !important;
    }
    
    .upload-area.dragover i {
        color: var(--primary) !important;
    }
`;
document.head.appendChild(style);