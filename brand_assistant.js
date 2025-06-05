// State management
const state = {
    currentModule: 1,
    totalModules: 5,
    answers: {},
    brandProfile: {}
};

// Brand archetypes and their characteristics
// Updated brand archetypes with clearer font pairings
const brandArchetypes = {
    'grounded-professional': {
        name: 'The Grounded Professional',
        description: 'You build trust through expertise and reliability. Your clients know they can count on you to deliver quality work without the drama.',
        colors: ['#2c3e50', '#ecf0f1', '#3498db', '#95a5a6'],
        colorDesc: 'Deep navy, clean whites, and trustworthy blues with subtle gray accents',
        voice: ['Professional yet approachable', 'Clear and direct', 'Trustworthy', 'No-nonsense'],
        fonts: 'Classic serif header (like Georgia or Times New Roman) with clean sans-serif body (like Arial or Helvetica)',
        layout: 'Hero statement → About/credentials → Services grid → Testimonials → Clear contact'
    },
    'modern-minimalist': {
    name: 'The Modern Minimalist',
    description: 'You believe in "less is more." Your brand is sophisticated, clean, and effortlessly elegant.',
    colors: ['#000000', '#ffffff', '#f8f9fa', '#6c757d'],
    colorDesc: 'Monochromatic palette with crisp blacks, pure whites, and subtle grays',
    voice: ['Refined and thoughtful', 'Concise', 'Sophisticated', 'Quality-focused'],
    fonts: 'Modern sans-serif header (like Montserrat or Roboto) with clean sans-serif body (like Inter or Lato)',
    layout: 'Minimal hero → Portfolio/work samples → Brief about → Simple contact'
},
    'creative-guide': {
        name: 'The Creative Guide',
        description: 'You bring personality and artistry to everything you do. Your clients come to you for your unique perspective and creative solutions.',
        colors: ['#e74c3c', '#f39c12', '#9b59b6', '#2c3e50'],
        colorDesc: 'Bold, confident colors that reflect creativity and energy',
        voice: ['Inspiring and energetic', 'Personal and warm', 'Creative', 'Encouraging'],
        fonts: 'Expressive serif header (like Playfair Display or Crimson Text) with friendly sans-serif body (like Open Sans or Nunito)',
        layout: 'Bold hero → Portfolio showcase → Personal story → Process → Contact with personality'
    },
    'trusted-local': {
        name: 'The Trusted Local',
        description: 'You\'re the neighborhood expert everyone recommends. Your reputation is built on consistency, fairness, and genuinely caring about your community.',
        colors: ['#27ae60', '#2c3e50', '#f8f9fa', '#e67e22'],
        colorDesc: 'Earthy greens and warm oranges with reliable navy and clean neutrals',
        voice: ['Friendly and familiar', 'Honest and straightforward', 'Community-focused', 'Reliable'],
        fonts: 'Approachable serif header (like Merriweather or PT Serif) with readable sans-serif body (like Lato or Noto Sans)',
        layout: 'Welcome message → Services → Community connection → Testimonials → Easy contact'
    },
    'premium-specialist': {
        name: 'The Premium Specialist',
        description: 'You offer high-end, specialized services. Your clients expect and receive exceptional quality and attention to detail.',
        colors: ['#8e44ad', '#2c3e50', '#ecf0f1', '#f1c40f'],
        colorDesc: 'Sophisticated purples and golds with elegant grays',
        voice: ['Polished and professional', 'Detail-oriented', 'Exclusive', 'Quality-focused'],
        fonts: 'Elegant serif header (like Cormorant Garamond or EB Garamond) with refined sans-serif body (like Montserrat or Poppins)',
        layout: 'Luxury hero → Specializations → Process/approach → Portfolio → Premium contact'
    },
    'energetic-innovator': {
        name: 'The Energetic Innovator',
        description: 'You\'re always pushing boundaries and trying new approaches. Your clients choose you because you bring fresh ideas and enthusiasm.',
        colors: ['#e74c3c', '#f39c12', '#3498db', '#2c3e50'],
        colorDesc: 'Vibrant reds, energetic oranges, and dynamic blues',
        voice: ['Enthusiastic and forward-thinking', 'Dynamic', 'Innovation-focused', 'Energetic'],
        fonts: 'Modern, bold sans-serif header (like Raleway or Work Sans) with dynamic body text (like Source Sans Pro or Roboto)',
        layout: 'Dynamic hero → Innovation showcase → Approach → Results → Action-oriented contact'
    }
};

// Initialize the tool
function init() {
    updateProgress();
    setupEventListeners();
    initMobileNav(); // Add this line
    
    // Hide the results container initially
    const resultsContainer = document.getElementById('resultsContainer');
    if (resultsContainer) {
        resultsContainer.classList.remove('active');
    }
}

// Event listeners
function setupEventListeners() {
    // Option cards
    document.addEventListener('click', function(e) {
        if (e.target.closest('.option-card')) {
            const card = e.target.closest('.option-card');
            const questionId = card.closest('.question').id || 'current';
            selectOption(card, questionId);
        }
    });

    // Navigation buttons
    document.getElementById('nextBtn').addEventListener('click', nextModule);
    document.getElementById('prevBtn').addEventListener('click', prevModule);

    // Sliders
    const toneSlider = document.getElementById('toneSlider');
    if (toneSlider) {
        toneSlider.addEventListener('input', function(e) {
            state.answers.toneStyle = e.target.value;
        });
    }

    // Text inputs
    const elevatorPitch = document.getElementById('elevatorPitch');
    if (elevatorPitch) {
        elevatorPitch.addEventListener('input', function(e) {
            state.answers.elevatorPitch = e.target.value;
        });
    }

    const fiveSecondMessage = document.getElementById('fiveSecondMessage');
    if (fiveSecondMessage) {
        fiveSecondMessage.addEventListener('input', function(e) {
            state.answers.fiveSecondMessage = e.target.value;
        });
    }

    const recommendations = document.getElementById('recommendations');
    if (recommendations) {
        recommendations.addEventListener('input', function(e) {
            state.answers.clientRecommendations = e.target.value;
        });
    }

    // Download buttons
    const downloadPDF = document.getElementById('downloadPDF');
    const sendToAngie = document.getElementById('sendToAngie');
    const copyText = document.getElementById('copyText');
    
    if (downloadPDF) downloadPDF.addEventListener('click', downloadPDFFunction);
    if (sendToAngie) sendToAngie.addEventListener('click', sendToAngieFunction);
    if (copyText) copyText.addEventListener('click', copyToClipboard);
}

function selectOption(card, questionId) {
    // Remove selection from siblings
    const siblings = card.parentElement.querySelectorAll('.option-card');
    siblings.forEach(sibling => sibling.classList.remove('selected'));
    
    // Add selection to clicked card
    card.classList.add('selected');
    
    // Store the answer
    const value = card.dataset.value;
    const question = getQuestionKey(questionId);
    state.answers[question] = value;
    
    // Also store based on question content for other questions
    const parent = card.closest('.question');
    const questionTitle = parent.querySelector('.question-title')?.textContent.toLowerCase() || '';
    const questionNumber = parent.querySelector('.question-number')?.textContent.toLowerCase() || '';

    // Combine text for a more robust check
    const questionText = questionTitle + ' ' + questionNumber;
    
    if (questionText.includes('introduction style') || questionText.includes('introduce yourself')) {
        state.answers.introduction = value;
    } else if (questionText.includes('greeting style') || questionText.includes('greeting')) {
        state.answers.greeting = value;
    } else if (questionTitle.includes('photography')) {
        state.answers.photographyVibe = value;
    } else if (questionTitle.includes('layout energy')) {
        state.answers.layoutEnergy = value;
    } else if (questionTitle.includes('text') || questionTitle.includes('content density')) {
        state.answers.textDensity = value;
    } else if (questionTitle.includes('contact')) {
        state.answers.contactPreference = value;
    } else if (questionTitle.includes('business hours')) {
        state.answers.businessHours = value;
    }
    
    // Debug log to see what's being stored
    console.log('Current answers:', state.answers);
    console.log('Current module:', state.currentModule);
    
    updateNextButton();
}

function getQuestionKey(questionId) {
    const questionMap = {
        'q1': 'brandFeeling',
        'q2': 'emotionalTemperature', 
        'q3': 'designExpression',
        'q4': 'audience',
        'q5': 'brandPriority'
    };
    return questionMap[questionId] || questionId;
}

function updateProgress() {
    const progress = ((state.currentModule - 1) / (state.totalModules - 1)) * 100;
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
        progressFill.style.width = progress + '%';
    }
    
    const progressTexts = [
        'Module 1: Discovering Your Brand Personality...',
        'Module 2: Building Your Voice & Tone...',
        'Module 3: Creating Your Visual Style...',
        'Module 4: Crafting Your Content Strategy...',
        'Module 5: Your Complete Brand Profile!'
    ];
    const progressText = document.getElementById('progressText');
    if (progressText) {
        progressText.textContent = progressTexts[state.currentModule - 1];
    }
    
    // Update module indicator
    const moduleText = document.getElementById('currentModuleText');
    if (moduleText) {
        moduleText.textContent = `Module ${state.currentModule} of ${state.totalModules}`;
    }
}

function updateNextButton() {
    const nextBtn = document.getElementById('nextBtn');
    if (!nextBtn) return;
    
    // Update button text based on current module
    const buttonTexts = [
        'Continue to Voice & Tone <i class="fas fa-arrow-right"></i>',
        'Continue to Visual Style <i class="fas fa-arrow-right"></i>', 
        'Continue to Content Strategy <i class="fas fa-arrow-right"></i>',
        'See My Brand Profile <i class="fas fa-magic"></i>',
        ''
    ];
    
    if (state.currentModule <= 4) {
        nextBtn.innerHTML = buttonTexts[state.currentModule - 1];
    } else {
        nextBtn.style.display = 'none';
        return;
    }

    // Check if current module has required answers
    let canProceed = false;
    
    if (state.currentModule === 1) {
        canProceed = state.answers.brandFeeling && state.answers.emotionalTemperature && 
                   state.answers.designExpression && state.answers.audience && state.answers.brandPriority;
    } else if (state.currentModule === 2) {
        canProceed = state.answers.introduction && state.answers.greeting;
    } else if (state.currentModule === 3) {
        canProceed = state.answers.photographyVibe && state.answers.layoutEnergy && state.answers.textDensity;
    } else if (state.currentModule === 4) {
        canProceed = state.answers.contactPreference;
    } else {
        canProceed = true;
    }
    
    nextBtn.disabled = !canProceed;
}

function nextModule() {
    if (state.currentModule < state.totalModules) {
        // Show transition message
        showTransition();
        
        setTimeout(() => {
            // Hide current module
            const currentModuleEl = document.getElementById(`module${state.currentModule}`);
            if (currentModuleEl) {
                currentModuleEl.classList.remove('active');
            }
            
            state.currentModule++;
            
            // Show next module
            const nextModuleEl = document.getElementById(`module${state.currentModule}`);
            if (nextModuleEl) {
                nextModuleEl.classList.add('active');
            }
            
            // Update navigation
            updateProgress();
            const prevBtn = document.getElementById('prevBtn');
            if (prevBtn) {
                prevBtn.style.display = state.currentModule > 1 ? 'block' : 'none';
            }
            
            if (state.currentModule === state.totalModules) {
                generateResults();
                const resultsContainer = document.getElementById('resultsContainer');
                if (resultsContainer) {
                    resultsContainer.classList.add('active'); // Make results container visible
                }
            }
            
            updateNextButton();
            
            // Hide transition and scroll to top
            hideTransition();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 1500);
    }
}

function prevModule() {
    if (state.currentModule > 1) {
        // Hide current module
        const currentModuleEl = document.getElementById(`module${state.currentModule}`);
        if (currentModuleEl) {
            currentModuleEl.classList.remove('active');
        }
        
        state.currentModule--;
        
        // Show previous module
        const prevModuleEl = document.getElementById(`module${state.currentModule}`);
        if (prevModuleEl) {
            prevModuleEl.classList.add('active');
        }
        
        // Update navigation
        updateProgress();
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) prevBtn.style.display = state.currentModule > 1 ? 'block' : 'none';
        if (nextBtn) nextBtn.style.display = 'block';
        
        // If going back from module 5, hide results container
        if (state.currentModule < state.totalModules) {
            const resultsContainer = document.getElementById('resultsContainer');
            if (resultsContainer) {
                resultsContainer.classList.remove('active');
            }
        }
        
        updateNextButton();
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function showTransition() {
    const transition = document.getElementById('moduleTransition');
    const message = document.getElementById('transitionMessage');
    const subtitle = document.getElementById('transitionSubtitle');
    
    if (!transition || !message || !subtitle) return;
    
    const messages = [
        { main: "✨ Great choices! Moving to Voice & Tone...", sub: "Let's find how you naturally communicate" },
        { main: "🎨 Perfect! Now for your Visual Style...", sub: "Time to create your visual moodboard" },
        { main: "📝 Excellent! Building your Content Strategy...", sub: "Let's nail down your messaging" },
        { main: "🎉 Amazing! Generating your Brand Profile...", sub: "All your pieces are coming together" }
    ];
    
    const currentMessage = messages[state.currentModule - 1];
    message.textContent = currentMessage.main;
    subtitle.textContent = currentMessage.sub;
    
    transition.classList.remove('hidden');
    transition.style.animation = 'fadeInUp 0.6s ease';
}

function hideTransition() {
    const transition = document.getElementById('moduleTransition');
    if (transition) {
        transition.classList.add('hidden');
        transition.style.animation = ''; // Clear animation style
    }
}
function styleMiniLayout(archetype, layoutType) {
    const layout = {
        header: document.querySelector('.layout-header'),
        nav: document.querySelector('.layout-nav'),
        hero: document.getElementById('layoutHeroText'),
        main: document.querySelector('.layout-main'),
        sidebar: document.querySelector('.layout-sidebar'),
        footer: document.querySelector('.layout-footer')
    };

    // Ensure colors exist and have hex property for detailed archetypes,
    // otherwise use the basic hex value for simpler ones.
    const color1 = archetype.colors?.[0]?.hex || archetype.colors?.[0] || '#2c3e50';
    const color2 = archetype.colors?.[1]?.hex || archetype.colors?.[1] || '#3498db';
    const color3 = archetype.colors?.[2]?.hex || archetype.colors?.[2] || '#ecf0f1';

    if (layout.header) layout.header.style.backgroundColor = color1;
    if (layout.nav) layout.nav.style.backgroundColor = color1;
    if (layout.hero) layout.hero.style.background = `linear-gradient(to right, ${color1}, ${color2})`;
    if (layout.footer) layout.footer.style.backgroundColor = color3;

    // Reset some styles first
    if (layout.hero) {
        layout.hero.style.height = '100px';
        layout.hero.style.fontSize = '1rem';
        layout.hero.style.fontWeight = 'normal';
    }
    if (layout.main) layout.main.style.display = 'block';
    if (layout.sidebar) layout.sidebar.style.width = '25%'; // default
    if (layout.main) layout.main.style.borderRight = 'none';

    switch (layoutType) {
        case 'calm':
            if (layout.hero) {
                layout.hero.style.height = '80px';
                layout.hero.style.fontSize = '1rem';
            }
            break;
        case 'punchy':
            if (layout.hero) {
                layout.hero.style.height = '120px';
                layout.hero.style.fontSize = '1.2rem';
                layout.hero.style.fontWeight = 'bold';
            }
            break;
        case 'gallery':
            if (layout.hero) layout.hero.style.height = '60px';
            if (layout.main) layout.main.style.display = 'none';
            if (layout.sidebar) layout.sidebar.style.width = '100%';
            renderGalleryThumbnails(); // Call specific function to render thumbnails
            break;
        case 'editorial':
            if (layout.main) layout.main.style.borderRight = `2px solid ${color1}`;
            break;
        default:
            // default already set
            break;
    }
}


// Function to render fake image thumbnails for the "gallery" layout
function renderGalleryThumbnails() {
    const galleryThumbnailsContainer = document.getElementById('galleryLayoutThumbnails');
    if (!galleryThumbnailsContainer) return;

    // Clear previous thumbnails
    galleryThumbnailsContainer.innerHTML = '';
    galleryThumbnailsContainer.style.display = 'grid';
    galleryThumbnailsContainer.style.gridTemplateColumns = 'repeat(3, 1fr)'; // 3 columns for thumbnails
    galleryThumbnailsContainer.style.gap = '5px';
    galleryThumbnailsContainer.style.marginTop = '10px';

    const dummyImages = [
        'https://via.placeholder.com/60x45/f0f0f0/cccccc?text=img1',
        'https://via.placeholder.com/60x45/f0f0f0/cccccc?text=img2',
        'https://via.placeholder.com/60x45/f0f0f0/cccccc?text=img3',
        'https://via.placeholder.com/60x45/f0f0f0/cccccc?text=img4',
        'https://via.placeholder.com/60x45/f0f0f0/cccccc?text=img5',
        'https://via.placeholder.com/60x45/f0f0f0/cccccc?text=img6',
    ];

    dummyImages.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = 'Gallery thumbnail';
        img.style.width = '100%';
        img.style.height = 'auto';
        img.style.borderRadius = '3px';
        galleryThumbnailsContainer.appendChild(img);
    });
}


// Main function to generate all results sections
function generateResults() {
    // Determine brand archetype based on answers
    const archetype = determineBrandArchetype();
    state.brandProfile = archetype;
    
    // Update the results display elements
    const brandArchetypeEl = document.getElementById('brandArchetype');
    const brandPersonalityEl = document.getElementById('brandPersonality');
    const layoutRecommendationEl = document.getElementById('layoutRecommendation');
    
    if (brandArchetypeEl) brandArchetypeEl.textContent = archetype.name;
    if (brandPersonalityEl) brandPersonalityEl.textContent = archetype.description;
    if (layoutRecommendationEl) layoutRecommendationEl.textContent = archetype.layout;
    
    // Generate the dynamic layout preview
    generateDynamicLayout(archetype);
    
    // Generate all other sections
    generateEnhancedColorPalette(archetype.colors);
    generateVoiceCharacteristics(archetype.voice);
    generateTypographyMini(archetype.fonts);
    generatePhotoGrid();
    generatePhotoRecommendation();
    generateContentStrategy();
    generateFinalChecklist();
    generateDesignApproach(); 
    generateContentStrategy();

    // Handle gallery layout display specifically
    if (state.answers.layoutEnergy === 'gallery') {
        addGalleryThumbnailsToLayout();
    }
}
function generateDesignApproach() {
    const approachContainer = document.getElementById('designApproach');
    if (!approachContainer) return;
    
    const answers = state.answers;
    const archetype = state.brandProfile;
    
    let approach = '';
    
    if (answers.layoutEnergy === 'calm' && answers.textDensity === 'minimal-text') {
        approach = 'Clean, spacious design with focus on visuals over text.';
    } else if (answers.layoutEnergy === 'punchy' && answers.textDensity === 'info-heavy') {
        approach = 'Information-rich layout with clear, action-oriented design.';
    } else if (archetype.name.includes('Minimalist')) {
        approach = 'Less-is-more philosophy with thoughtful use of white space.';
    } else if (archetype.name.includes('Creative')) {
        approach = 'Bold visual elements that showcase personality and creativity.';
    } else if (archetype.name.includes('Professional')) {
        approach = 'Structured, trustworthy design that builds confidence.';
    } else {
        approach = 'Balanced visual hierarchy that guides visitors naturally.';
    }
    
    approachContainer.innerHTML = `<p class="design-approach-text">${approach}</p>`;
}
// Updates background colors of layout elements based on the archetype's colors
function updateLayoutColors(colors) {
    const layoutHeader = document.querySelector('.layout-header');
    const layoutNav = document.querySelector('.layout-nav');
    const layoutHero = document.querySelector('.layout-hero');
    const layoutFooter = document.querySelector('.layout-footer');
    
    if (layoutHeader && colors[0]) {
        layoutHeader.style.background = colors[0].hex || colors[0]; // Handle both detailed and simple color objects
    }
    
    if (layoutNav && colors[3]) {
        layoutNav.style.background = colors[3].hex || colors[3];
    }
    
    if (layoutHero && colors[0] && colors[2]) {
        const c1 = colors[0].hex || colors[0];
        const c2 = colors[2].hex || colors[2];
        layoutHero.style.background = `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`;
    }
    
    if (layoutFooter && colors[3]) {
        layoutFooter.style.background = colors[3].hex || colors[3];
    }
}

// Determines the brand archetype based on user's answers
function determineBrandArchetype() {
    const answers = state.answers;
    
    // Prioritized logic to determine archetype
    if (answers.brandFeeling === 'formal' && answers.brandPriority === 'trust') {
        return brandArchetypes['grounded-professional'];
    } else if (answers.designExpression === 'minimal' && answers.emotionalTemperature === 'neutral') {
        return brandArchetypes['modern-minimalist'];
    } else if (answers.brandPriority === 'beauty' && answers.designExpression === 'expressive') {
        return brandArchetypes['creative-guide'];
    } else if (answers.audience === 'local' && answers.brandFeeling === 'casual') {
        return brandArchetypes['trusted-local'];
    } else if (answers.brandPriority === 'beauty' && answers.brandFeeling === 'formal') {
        return brandArchetypes['premium-specialist'];
    } else if (answers.brandPriority === 'energy' && answers.designExpression === 'expressive') {
        return brandArchetypes['energetic-innovator'];
    } else {
        // Default fallback if no specific archetype matches all criteria
        console.warn("No specific archetype matched, falling back to Grounded Professional.");
        return brandArchetypes['grounded-professional'];
    }
}

// Generates the color palette display in the results
function generateEnhancedColorPalette(colors) {
    const colorGrid = document.getElementById('colorGrid');
    if (!colorGrid) return;
    
    colorGrid.innerHTML = ''; // Clear existing content
    
    colors.forEach((color, index) => {
        const hex = typeof color === 'object' && color !== null ? color.hex : color;
        const name = typeof color === 'object' && color !== null ? color.name : '';

        const colorDiv = document.createElement('div');
        colorDiv.className = 'color-swatch clickable-color';
        colorDiv.setAttribute('data-hex', hex);
        colorDiv.innerHTML = `
            <div class="color-circle" style="background-color: ${hex};"></div>
            <div class="color-hex">${hex.toUpperCase()}</div>
            ${name ? `<div class="color-name">${name}</div>` : ''}
        `;
        
        // Add click event listener to copy hex code
        colorDiv.addEventListener('click', function() {
            copyHexToClipboard(hex, colorDiv);
        });
        
        colorGrid.appendChild(colorDiv);
    });
}

// Function to copy hex code to clipboard with visual feedback
function copyHexToClipboard(hexCode, element) {
    navigator.clipboard.writeText(hexCode).then(() => {
        // Success feedback
        showCopySuccess(element, hexCode);
    }).catch(err => {
        // Fallback for older browsers
        fallbackCopyTextToClipboard(hexCode, element);
    });
}

// Visual feedback for successful copy
function showCopySuccess(element, hexCode) {
    // Create and show tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'copy-tooltip';
    tooltip.textContent = `Copied ${hexCode}!`;
    tooltip.style.cssText = `
        position: absolute;
        background: var(--primary);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        font-size: 0.8rem;
        font-weight: 600;
        z-index: 1000;
        top: -45px;
        left: 50%;
        transform: translateX(-50%);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        opacity: 0;
        transition: all 0.3s ease;
        pointer-events: none;
    `;
    
    // Add tooltip to element
    element.style.position = 'relative';
    element.appendChild(tooltip);
    
    // Animate tooltip in
    setTimeout(() => {
        tooltip.style.opacity = '1';
        tooltip.style.top = '-50px';
    }, 10);
    
    // Add pulse animation to color circle
    const colorCircle = element.querySelector('.color-circle');
    colorCircle.style.animation = 'colorCopyPulse 0.6s ease';
    
    // Remove tooltip and reset animation after delay
    setTimeout(() => {
        tooltip.style.opacity = '0';
        tooltip.style.top = '-40px';
        setTimeout(() => {
            if (tooltip.parentNode) {
                tooltip.parentNode.removeChild(tooltip);
            }
            colorCircle.style.animation = '';
        }, 300);
    }, 2000);
}

// Fallback copy method for older browsers
function fallbackCopyTextToClipboard(text, element) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showCopySuccess(element, text);
    } catch (err) {
        console.error('Fallback: Could not copy text: ', err);
        // Show error feedback
        showCopyError(element);
    }
    
    document.body.removeChild(textArea);
}

// Error feedback for failed copy
function showCopyError(element) {
    const tooltip = document.createElement('div');
    tooltip.className = 'copy-tooltip error';
    tooltip.textContent = 'Copy failed - try selecting manually';
    tooltip.style.cssText = `
        position: absolute;
        background: var(--accent);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        font-size: 0.8rem;
        font-weight: 600;
        z-index: 1000;
        top: -50px;
        left: 50%;
        transform: translateX(-50%);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        opacity: 1;
        pointer-events: none;
        white-space: nowrap;
    `;
    
    element.style.position = 'relative';
    element.appendChild(tooltip);
    
    setTimeout(() => {
        if (tooltip.parentNode) {
            tooltip.parentNode.removeChild(tooltip);
        }
    }, 3000);
}

// Generates the typography mini preview in the results
// Enhanced function to generate typography mini preview with proper font pairings
// Fixed function to generate typography mini preview with proper font pairings
// Fixed function to generate typography mini preview with proper font pairings
function generateTypographyMini(fontsDescription) {
    const typographyMini = document.getElementById('typographyMini');
    if (!typographyMini) return;

    console.log('Font description:', fontsDescription); // Debug log

    // Font categorization with clear separation
    const serifFonts = ['Playfair Display', 'Georgia', 'Times New Roman', 'Merriweather', 'PT Serif', 'Crimson Text', 'Cormorant Garamond', 'EB Garamond', 'Libre Baskerville', 'Lora'];
    const sansFonts = ['Inter', 'Lato', 'Roboto', 'Open Sans', 'Montserrat', 'Poppins', 'Source Sans Pro', 'Nunito', 'Raleway', 'Work Sans', 'Oswald', 'Noto Sans', 'Helvetica Neue', 'Arial', 'Fira Sans', 'Ubuntu', 'Oxygen', 'Dosis', 'Quicksand'];

    let headerFontFamily, bodyFontFamily, headerFontType, bodyFontType;

    // Helper to extract specific font names
    const extractSpecificFont = (text) => {
        const allFonts = [...serifFonts, ...sansFonts];
        for (const font of allFonts) {
            if (text.includes(font)) {
                return font;
            }
        }
        return '';
    };

    // Check for "throughout" descriptions (same font for both)
    if (fontsDescription.includes('throughout')) {
        console.log('Found "throughout" - using same font for both');
        
        // Extract the font from patterns like "Modern sans-serif throughout (like Inter, Roboto, or Source Sans Pro)"
        const throughoutMatch = fontsDescription.match(/throughout[^(]*\(like ([^)]+)\)/i);
        if (throughoutMatch && throughoutMatch[1]) {
            const fontList = throughoutMatch[1].split(/,|\sor\s/);
            const extractedFont = extractSpecificFont(fontList[0].trim());
            if (extractedFont) {
                headerFontFamily = extractedFont;
                bodyFontFamily = extractedFont;
                headerFontType = serifFonts.includes(extractedFont) ? 'serif' : 'sans-serif';
                bodyFontType = headerFontType;
                console.log('Using throughout font:', extractedFont);
            }
        } else {
            // Fallback for throughout without parentheses
            if (fontsDescription.includes('Modern sans-serif throughout')) {
                headerFontFamily = 'Raleway';
                bodyFontFamily = 'Raleway';
                headerFontType = 'sans-serif';
                bodyFontType = 'sans-serif';
            }
        }
    } else {
        // Parse header and body separately for font pairings
        console.log('Parsing font pairing');
        
        // Default starting values for pairings
        headerFontFamily = 'Playfair Display'; // Default serif header
        bodyFontFamily = 'Lato'; // Default sans body
        headerFontType = 'serif';
        bodyFontType = 'sans-serif';
        
        // Parse header font first
        const headerMatch = fontsDescription.match(/(header|Header)[^(]*\(like ([^)]+)\)/);
        if (headerMatch && headerMatch[2]) {
            const fontList = headerMatch[2].split(/,|\sor\s/);
            const extractedHeaderFont = extractSpecificFont(fontList[0].trim());
            if (extractedHeaderFont) {
                headerFontFamily = extractedHeaderFont;
                headerFontType = serifFonts.includes(extractedHeaderFont) ? 'serif' : 'sans-serif';
                console.log('Header font found:', extractedHeaderFont);
            }
        } else {
            // Specific archetype-based header selection
            if (fontsDescription.includes('Elegant serif')) {
                headerFontFamily = 'Cormorant Garamond';
                headerFontType = 'serif';
            } else if (fontsDescription.includes('Classic serif')) {
                headerFontFamily = 'Georgia';
                headerFontType = 'serif';
            } else if (fontsDescription.includes('Expressive serif')) {
                headerFontFamily = 'Playfair Display';
                headerFontType = 'serif';
            } else if (fontsDescription.includes('Approachable serif')) {
                headerFontFamily = 'Merriweather';
                headerFontType = 'serif';
            } else if (fontsDescription.includes('Modern, bold sans-serif')) {
                headerFontFamily = 'Raleway';
                headerFontType = 'sans-serif';
            }
        }

        // Parse body font - ensure it's different from header when appropriate
        const bodyMatch = fontsDescription.match(/(body|Body)[^(]*\(like ([^)]+)\)/);
        if (bodyMatch && bodyMatch[2]) {
            const fontList = bodyMatch[2].split(/,|\sor\s/);
            const extractedBodyFont = extractSpecificFont(fontList[0].trim());
            if (extractedBodyFont && extractedBodyFont !== headerFontFamily) { // Ensure it's different
                bodyFontFamily = extractedBodyFont;
                bodyFontType = sansFonts.includes(extractedBodyFont) ? 'sans-serif' : 'serif';
                console.log('Body font found:', extractedBodyFont);
            }
        } else {
            // Fallback body font selection - ensure contrast with header
            if (headerFontType === 'serif') {
                // If header is serif, body should be sans-serif
                if (fontsDescription.includes('clean sans-serif')) {
                    bodyFontFamily = 'Inter';
                } else if (fontsDescription.includes('friendly sans-serif')) {
                    bodyFontFamily = 'Open Sans';
                } else if (fontsDescription.includes('refined sans-serif')) {
                    bodyFontFamily = 'Montserrat';
                } else if (fontsDescription.includes('readable sans-serif')) {
                    bodyFontFamily = 'Lato';
                } else if (fontsDescription.includes('dynamic body text')) {
                    bodyFontFamily = 'Source Sans Pro';
                } else {
                    // Default pairing based on header
                    if (headerFontFamily === 'Playfair Display') bodyFontFamily = 'Open Sans';
                    else if (headerFontFamily === 'Georgia') bodyFontFamily = 'Arial';
                    else if (headerFontFamily === 'Merriweather') bodyFontFamily = 'Lato';
                    else if (headerFontFamily === 'Cormorant Garamond') bodyFontFamily = 'Montserrat';
                    else bodyFontFamily = 'Lato'; // safe default
                }
                bodyFontType = 'sans-serif';
            } else {
                // If header is sans-serif, body should also be sans-serif but different
                if (headerFontFamily === 'Raleway') bodyFontFamily = 'Source Sans Pro';
                else if (headerFontFamily === 'Work Sans') bodyFontFamily = 'Roboto';
                else bodyFontFamily = 'Roboto'; // safe default
                bodyFontType = 'sans-serif';
            }
        }
    }

    console.log('Final fonts - Header:', headerFontFamily, '(' + headerFontType + ') Body:', bodyFontFamily, '(' + bodyFontType + ')');

    // Enhanced typography preview showing actual font pairing
    typographyMini.innerHTML = `
        <div class="font-pairing-preview">
            <div class="header-font-sample" style="font-family: '${headerFontFamily}', ${headerFontType}; font-size: 1.8rem; font-weight: 700; margin-bottom: 0.8rem; color: var(--dark); line-height: 1.2;">
                Beautiful Headlines
            </div>
            <div class="body-font-sample" style="font-family: '${bodyFontFamily}', ${bodyFontType}; font-size: 1rem; color: var(--medium); line-height: 1.6; margin-bottom: 1rem;">
                This is how your body text will look throughout your website. Clear, readable, and perfectly paired with your headlines for a professional appearance.
            </div>
            <div class="font-labels">
                <span class="font-label header-label">Headers: ${headerFontFamily}</span>
                <span class="font-label body-label">Body: ${bodyFontFamily}</span>
            </div>
        </div>
    `;
}

// Generates the voice characteristics display in the results
function generateVoiceCharacteristics(characteristics) {
    const voiceGrid = document.getElementById('voiceCharacteristics');
    if (!voiceGrid) return;
    
    voiceGrid.innerHTML = '';
    
    characteristics.forEach(char => {
        const voiceItem = document.createElement('div');
        voiceItem.className = 'voice-item';
        voiceItem.textContent = char;
        voiceGrid.appendChild(voiceItem);
    });
}

// Function to generate the photo grid in the results based on selected style
function generatePhotoGrid() {
    const photoGrid = document.getElementById('photoGrid');
    if (!photoGrid) return;
    
    const style = state.answers.photographyVibe || 'soft'; // Default to 'soft'
    
    // Photo URLs for different styles (using Unsplash placeholders for demonstration)
    const photoSets = {
        'gritty': [
            'https://images.unsplash.com/photo-1504328345606-18bbc9c9d7d1?w=200&h=150&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=200&h=150&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=200&h=150&fit=crop&crop=center'
        ],
        'soft': [
            'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=200&h=150&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1524863479829-916d8e77f114?w=200&h=150&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1493612276216-ee3925520721?w=200&h=150&fit=crop&crop=center'
        ],
        'studio': [
            'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=150&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=200&h=150&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=200&h=150&fit=crop&crop=center'
        ],
        'vibrant': [
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=150&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1541746972996-4e0b0f93e586?w=200&h=150&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=200&h=150&fit=crop&crop=center'
        ],
        'bw': [
            'https://images.unsplash.com/photo-1554244933-d876deb6b2ff?w=200&h=150&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=150&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=150&fit=crop&crop=center'
        ]
    };
    
    const photos = photoSets[style] || photoSets['soft'];
    
    photoGrid.innerHTML = '';
    photos.forEach((photoUrl, index) => {
        const photoDiv = document.createElement('div');
        photoDiv.className = 'photo-placeholder';
        photoDiv.style.backgroundImage = `url(${photoUrl})`;
        photoDiv.style.backgroundSize = 'cover';
        photoDiv.style.backgroundPosition = 'center';
        
        if (style === 'bw') {
            photoDiv.style.filter = 'grayscale(100%)';
        }
        
        photoGrid.appendChild(photoDiv);
    });
}

// Updates the hero text in the mini-layout based on user's input
function updateLayoutHero() {
    const layoutHero = document.getElementById('layoutHeroText');
    const fiveSecond = state.answers.fiveSecondMessage || 'Your key message';
    if (layoutHero) {
        layoutHero.textContent = `Hero: "${fiveSecond}"`;
    }
}

// Enhanced function to generate dynamic layout preview based on archetype
function generateDynamicLayout(archetype) {
    const layoutContainer = document.getElementById('miniLayout');
    if (!layoutContainer) return;

    // Clear existing layout
    layoutContainer.innerHTML = '';

    // Get colors for styling (muted for wireframe look)
    const color1 = archetype.colors?.[0]?.hex || archetype.colors?.[0] || '#2c3e50';
    const wireframeGray = '#e9ecef';
    const wireframeDark = '#6c757d';
    const wireframeLight = '#f8f9fa';

    // Parse the layout description to get sections
    const layoutSections = parseLayoutDescription(archetype.layout);

    // Create wireframe-style layout structure with BIGGER dimensions
    let layoutHTML = `
        <div class="wireframe-header" style="background: ${wireframeLight}; border: 2px solid ${wireframeDark}; padding: 12px; border-radius: 6px; margin-bottom: 12px; height: 45px; display: flex; align-items: center; justify-content: space-between;">
            <div style="width: 80px; height: 10px; background: ${wireframeDark}; border-radius: 3px;"></div>
            <div style="display: flex; gap: 6px;">
                <div style="width: 25px; height: 10px; background: ${wireframeDark}; border-radius: 3px;"></div>
                <div style="width: 25px; height: 10px; background: ${wireframeDark}; border-radius: 3px;"></div>
                <div style="width: 25px; height: 10px; background: ${wireframeDark}; border-radius: 3px;"></div>
            </div>
        </div>
    `;

    // Generate wireframe sections based on the layout description with BIGGER heights
    layoutSections.forEach((section, index) => {
        const sectionMarkup = getBiggerWireframeSectionMarkup(section, index, color1, wireframeGray, wireframeDark, wireframeLight);
        layoutHTML += sectionMarkup;
    });

    // Add wireframe footer with more height
    layoutHTML += `
        <div class="wireframe-footer" style="background: ${wireframeLight}; border: 1px solid ${wireframeDark}; height: 25px; border-radius: 4px; margin-top: 12px; display: flex; align-items: center; justify-content: center; gap: 10px;">
            <div style="width: 40px; height: 8px; background: ${wireframeDark}; border-radius: 3px;"></div>
            <div style="width: 30px; height: 8px; background: ${wireframeDark}; border-radius: 3px;"></div>
            <div style="width: 35px; height: 8px; background: ${wireframeDark}; border-radius: 3px;"></div>
        </div>
    `;

    layoutContainer.innerHTML = layoutHTML;
}

function getWireframeSectionMarkup(sectionName, index, brandColor, wireframeGray, wireframeDark, wireframeLight) {
    const sectionLower = sectionName.toLowerCase();
    
    // Hero sections - large with image placeholder and text lines
    if (sectionLower.includes('hero') || sectionLower.includes('welcome') || sectionLower.includes('dynamic')) {
        return `
            <div class="wireframe-hero" style="background: ${wireframeLight}; border: 2px solid ${brandColor}; height: 70px; border-radius: 6px; margin: 6px 0; padding: 8px; display: flex; gap: 8px;">
                <div style="flex: 1;">
                    <div style="width: 80%; height: 10px; background: ${brandColor}; border-radius: 2px; margin-bottom: 4px;"></div>
                    <div style="width: 60%; height: 6px; background: ${wireframeDark}; border-radius: 2px; margin-bottom: 3px;"></div>
                    <div style="width: 45%; height: 6px; background: ${wireframeDark}; border-radius: 2px; margin-bottom: 6px;"></div>
                    <div style="width: 35px; height: 12px; background: ${brandColor}; border-radius: 3px; border: 1px solid ${brandColor};"></div>
                </div>
                <div style="width: 40px; height: 50px; background: ${wireframeGray}; border: 1px dashed ${wireframeDark}; border-radius: 3px; display: flex; align-items: center; justify-content: center;">
                    <div style="width: 12px; height: 12px; border: 1px solid ${wireframeDark}; border-radius: 2px;"></div>
                </div>
            </div>
        `;
    }
    
    // Gallery/Portfolio sections - grid of image placeholders
    if (sectionLower.includes('gallery') || sectionLower.includes('portfolio') || sectionLower.includes('showcase')) {
        return `
            <div class="wireframe-gallery" style="background: ${wireframeLight}; border: 1px solid ${wireframeDark}; height: 55px; border-radius: 4px; margin: 4px 0; padding: 6px;">
                <div style="width: 40%; height: 6px; background: ${wireframeDark}; border-radius: 2px; margin-bottom: 6px;"></div>
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 3px; height: 28px;">
                    <div style="background: ${wireframeGray}; border: 1px dashed ${wireframeDark}; border-radius: 2px; display: flex; align-items: center; justify-content: center;">
                        <div style="width: 6px; height: 6px; border: 1px solid ${wireframeDark};"></div>
                    </div>
                    <div style="background: ${wireframeGray}; border: 1px dashed ${wireframeDark}; border-radius: 2px; display: flex; align-items: center; justify-content: center;">
                        <div style="width: 6px; height: 6px; border: 1px solid ${wireframeDark};"></div>
                    </div>
                    <div style="background: ${wireframeGray}; border: 1px dashed ${wireframeDark}; border-radius: 2px; display: flex; align-items: center; justify-content: center;">
                        <div style="width: 6px; height: 6px; border: 1px solid ${wireframeDark};"></div>
                    </div>
                    <div style="background: ${wireframeGray}; border: 1px dashed ${wireframeDark}; border-radius: 2px; display: flex; align-items: center; justify-content: center;">
                        <div style="width: 6px; height: 6px; border: 1px solid ${wireframeDark};"></div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Contact/Action sections - form-like wireframe
    if (sectionLower.includes('contact') || sectionLower.includes('action') || sectionLower.includes('book')) {
        return `
            <div class="wireframe-contact" style="background: ${wireframeLight}; border: 2px solid ${brandColor}; height: 45px; border-radius: 4px; margin: 4px 0; padding: 6px;">
                <div style="width: 50%; height: 8px; background: ${brandColor}; border-radius: 2px; margin-bottom: 4px;"></div>
                <div style="display: flex; gap: 4px; margin-bottom: 4px;">
                    <div style="flex: 1; height: 8px; background: ${wireframeGray}; border: 1px solid ${wireframeDark}; border-radius: 2px;"></div>
                    <div style="flex: 1; height: 8px; background: ${wireframeGray}; border: 1px solid ${wireframeDark}; border-radius: 2px;"></div>
                </div>
                <div style="width: 30%; height: 10px; background: ${brandColor}; border-radius: 3px; margin-left: auto;"></div>
            </div>
        `;
    }
    
    // Testimonials - quote-like wireframe
    if (sectionLower.includes('testimonial') || sectionLower.includes('review')) {
        return `
            <div class="wireframe-testimonial" style="background: ${wireframeLight}; border: 1px solid ${wireframeDark}; border-left: 4px solid ${brandColor}; height: 35px; border-radius: 4px; margin: 4px 0; padding: 6px; display: flex; gap: 6px;">
                <div style="width: 20px; height: 20px; background: ${wireframeGray}; border: 1px dashed ${wireframeDark}; border-radius: 50%; flex-shrink: 0;"></div>
                <div style="flex: 1;">
                    <div style="width: 90%; height: 4px; background: ${wireframeDark}; border-radius: 2px; margin-bottom: 2px;"></div>
                    <div style="width: 75%; height: 4px; background: ${wireframeDark}; border-radius: 2px; margin-bottom: 3px;"></div>
                    <div style="width: 40%; height: 4px; background: ${brandColor}; border-radius: 2px;"></div>
                </div>
            </div>
        `;
    }
    
    // Results/Process sections - step-like wireframe
    if (sectionLower.includes('result') || sectionLower.includes('process') || sectionLower.includes('approach')) {
        return `
            <div class="wireframe-process" style="background: ${wireframeLight}; border: 1px solid ${wireframeDark}; height: 40px; border-radius: 4px; margin: 4px 0; padding: 6px;">
                <div style="width: 45%; height: 6px; background: ${brandColor}; border-radius: 2px; margin-bottom: 4px;"></div>
                <div style="display: flex; gap: 6px; align-items: center;">
                    <div style="width: 12px; height: 12px; background: ${brandColor}; border-radius: 50%; color: white; font-size: 6px; display: flex; align-items: center; justify-content: center; font-weight: bold;">1</div>
                    <div style="width: 12px; height: 12px; background: ${wireframeGray}; border: 1px solid ${wireframeDark}; border-radius: 50%;"></div>
                    <div style="width: 12px; height: 12px; background: ${wireframeGray}; border: 1px solid ${wireframeDark}; border-radius: 50%;"></div>
                    <div style="flex: 1; height: 4px; background: ${wireframeDark}; border-radius: 2px; margin-left: 4px;"></div>
                </div>
            </div>
        `;
    }
    
    // Services/About sections - content blocks
    if (sectionLower.includes('service') || sectionLower.includes('about') || sectionLower.includes('credential')) {
        return `
            <div class="wireframe-content" style="background: ${wireframeLight}; border: 1px solid ${wireframeDark}; height: 35px; border-radius: 4px; margin: 4px 0; padding: 6px; display: flex; gap: 6px;">
                <div style="width: 25px; height: 20px; background: ${wireframeGray}; border: 1px dashed ${wireframeDark}; border-radius: 3px; flex-shrink: 0;"></div>
                <div style="flex: 1;">
                    <div style="width: 60%; height: 6px; background: ${brandColor}; border-radius: 2px; margin-bottom: 3px;"></div>
                    <div style="width: 85%; height: 4px; background: ${wireframeDark}; border-radius: 2px; margin-bottom: 2px;"></div>
                    <div style="width: 70%; height: 4px; background: ${wireframeDark}; border-radius: 2px;"></div>
                </div>
            </div>
        `;
    }
    
    // Default content sections - simple text lines
    return `
        <div class="wireframe-default" style="background: ${wireframeLight}; border: 1px solid ${wireframeDark}; height: 30px; border-radius: 4px; margin: 4px 0; padding: 6px;">
            <div style="width: 50%; height: 6px; background: ${brandColor}; border-radius: 2px; margin-bottom: 4px;"></div>
            <div style="width: 80%; height: 4px; background: ${wireframeDark}; border-radius: 2px; margin-bottom: 2px;"></div>
            <div style="width: 65%; height: 4px; background: ${wireframeDark}; border-radius: 2px;"></div>
        </div>
    `;
}

function getBiggerWireframeSectionMarkup(sectionName, index, brandColor, wireframeGray, wireframeDark, wireframeLight) {
    const sectionLower = sectionName.toLowerCase();
    
    // Hero sections - MUCH BIGGER with more generous spacing
    if (sectionLower.includes('hero') || sectionLower.includes('welcome') || sectionLower.includes('dynamic')) {
        return `
            <div class="wireframe-hero" style="background: ${wireframeLight}; border: 2px solid ${brandColor}; height: 85px; border-radius: 8px; margin: 8px 0; padding: 12px; display: flex; gap: 12px;">
                <div style="flex: 1;">
                    <div style="width: 85%; height: 12px; background: ${brandColor}; border-radius: 3px; margin-bottom: 6px;"></div>
                    <div style="width: 70%; height: 8px; background: ${wireframeDark}; border-radius: 3px; margin-bottom: 4px;"></div>
                    <div style="width: 55%; height: 8px; background: ${wireframeDark}; border-radius: 3px; margin-bottom: 8px;"></div>
                    <div style="width: 45px; height: 16px; background: ${brandColor}; border-radius: 4px; border: 1px solid ${brandColor};"></div>
                </div>
                <div style="width: 50px; height: 60px; background: ${wireframeGray}; border: 1px dashed ${wireframeDark}; border-radius: 4px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                    <div style="width: 16px; height: 16px; border: 1px solid ${wireframeDark}; border-radius: 3px;"></div>
                </div>
            </div>
        `;
    }
    
    // Gallery/Portfolio sections - BIGGER grid layout
    if (sectionLower.includes('gallery') || sectionLower.includes('portfolio') || sectionLower.includes('showcase')) {
        return `
            <div class="wireframe-gallery" style="background: ${wireframeLight}; border: 1px solid ${wireframeDark}; height: 70px; border-radius: 6px; margin: 8px 0; padding: 10px;">
                <div style="width: 50%; height: 8px; background: ${wireframeDark}; border-radius: 3px; margin-bottom: 8px;"></div>
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; height: 40px;">
                    <div style="background: ${wireframeGray}; border: 1px dashed ${wireframeDark}; border-radius: 3px; display: flex; align-items: center; justify-content: center;">
                        <div style="width: 8px; height: 8px; border: 1px solid ${wireframeDark}; border-radius: 2px;"></div>
                    </div>
                    <div style="background: ${wireframeGray}; border: 1px dashed ${wireframeDark}; border-radius: 3px; display: flex; align-items: center; justify-content: center;">
                        <div style="width: 8px; height: 8px; border: 1px solid ${wireframeDark}; border-radius: 2px;"></div>
                    </div>
                    <div style="background: ${wireframeGray}; border: 1px dashed ${wireframeDark}; border-radius: 3px; display: flex; align-items: center; justify-content: center;">
                        <div style="width: 8px; height: 8px; border: 1px solid ${wireframeDark}; border-radius: 2px;"></div>
                    </div>
                    <div style="background: ${wireframeGray}; border: 1px dashed ${wireframeDark}; border-radius: 3px; display: flex; align-items: center; justify-content: center;">
                        <div style="width: 8px; height: 8px; border: 1px solid ${wireframeDark}; border-radius: 2px;"></div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Contact/Action sections - BIGGER form-like wireframe
    if (sectionLower.includes('contact') || sectionLower.includes('action') || sectionLower.includes('book')) {
        return `
            <div class="wireframe-contact" style="background: ${wireframeLight}; border: 2px solid ${brandColor}; height: 55px; border-radius: 6px; margin: 8px 0; padding: 10px;">
                <div style="width: 60%; height: 10px; background: ${brandColor}; border-radius: 3px; margin-bottom: 6px;"></div>
                <div style="display: flex; gap: 6px; margin-bottom: 6px;">
                    <div style="flex: 1; height: 10px; background: ${wireframeGray}; border: 1px solid ${wireframeDark}; border-radius: 3px;"></div>
                    <div style="flex: 1; height: 10px; background: ${wireframeGray}; border: 1px solid ${wireframeDark}; border-radius: 3px;"></div>
                </div>
                <div style="width: 40%; height: 12px; background: ${brandColor}; border-radius: 4px; margin-left: auto;"></div>
            </div>
        `;
    }
    
    // Testimonials - BIGGER quote-like wireframe
    if (sectionLower.includes('testimonial') || sectionLower.includes('review')) {
        return `
            <div class="wireframe-testimonial" style="background: ${wireframeLight}; border: 1px solid ${wireframeDark}; border-left: 4px solid ${brandColor}; height: 45px; border-radius: 6px; margin: 8px 0; padding: 10px; display: flex; gap: 8px;">
                <div style="width: 25px; height: 25px; background: ${wireframeGray}; border: 1px dashed ${wireframeDark}; border-radius: 50%; flex-shrink: 0;"></div>
                <div style="flex: 1;">
                    <div style="width: 95%; height: 5px; background: ${wireframeDark}; border-radius: 3px; margin-bottom: 3px;"></div>
                    <div style="width: 80%; height: 5px; background: ${wireframeDark}; border-radius: 3px; margin-bottom: 4px;"></div>
                    <div style="width: 50%; height: 5px; background: ${brandColor}; border-radius: 3px;"></div>
                </div>
            </div>
        `;
    }
    
    // Results/Process sections - BIGGER step-like wireframe
    if (sectionLower.includes('result') || sectionLower.includes('process') || sectionLower.includes('approach')) {
        return `
            <div class="wireframe-process" style="background: ${wireframeLight}; border: 1px solid ${wireframeDark}; height: 50px; border-radius: 6px; margin: 8px 0; padding: 10px;">
                <div style="width: 55%; height: 8px; background: ${brandColor}; border-radius: 3px; margin-bottom: 6px;"></div>
                <div style="display: flex; gap: 8px; align-items: center;">
                    <div style="width: 16px; height: 16px; background: ${brandColor}; border-radius: 50%; color: white; font-size: 8px; display: flex; align-items: center; justify-content: center; font-weight: bold;">1</div>
                    <div style="width: 16px; height: 16px; background: ${wireframeGray}; border: 1px solid ${wireframeDark}; border-radius: 50%;"></div>
                    <div style="width: 16px; height: 16px; background: ${wireframeGray}; border: 1px solid ${wireframeDark}; border-radius: 50%;"></div>
                    <div style="flex: 1; height: 5px; background: ${wireframeDark}; border-radius: 3px; margin-left: 6px;"></div>
                </div>
            </div>
        `;
    }
    
    // Services/About sections - BIGGER content blocks
    if (sectionLower.includes('service') || sectionLower.includes('about') || sectionLower.includes('credential')) {
        return `
            <div class="wireframe-content" style="background: ${wireframeLight}; border: 1px solid ${wireframeDark}; height: 45px; border-radius: 6px; margin: 8px 0; padding: 10px; display: flex; gap: 8px;">
                <div style="width: 30px; height: 25px; background: ${wireframeGray}; border: 1px dashed ${wireframeDark}; border-radius: 4px; flex-shrink: 0;"></div>
                <div style="flex: 1;">
                    <div style="width: 70%; height: 8px; background: ${brandColor}; border-radius: 3px; margin-bottom: 4px;"></div>
                    <div style="width: 90%; height: 5px; background: ${wireframeDark}; border-radius: 3px; margin-bottom: 3px;"></div>
                    <div style="width: 75%; height: 5px; background: ${wireframeDark}; border-radius: 3px;"></div>
                </div>
            </div>
        `;
    }
    
    // Default content sections - BIGGER simple text lines
    return `
        <div class="wireframe-default" style="background: ${wireframeLight}; border: 1px solid ${wireframeDark}; height: 40px; border-radius: 6px; margin: 8px 0; padding: 10px;">
            <div style="width: 60%; height: 8px; background: ${brandColor}; border-radius: 3px; margin-bottom: 5px;"></div>
            <div style="width: 85%; height: 5px; background: ${wireframeDark}; border-radius: 3px; margin-bottom: 3px;"></div>
            <div style="width: 70%; height: 5px; background: ${wireframeDark}; border-radius: 3px;"></div>
        </div>
    `;
}

// Function to parse layout description and extract sections
function parseLayoutDescription(layoutDescription) {
    if (!layoutDescription) return ['Hero', 'About', 'Services', 'Contact'];

    // Split by arrows and clean up
    const sections = layoutDescription.split('→').map(section => 
        section.trim().replace(/^(.*?)\s/, '') // Remove leading words like "Hero statement"
    );

    // If no arrows found, try splitting by other delimiters
    if (sections.length === 1) {
        return layoutDescription.split(/[,·•]/).map(s => s.trim()).filter(s => s.length > 0);
    }

    return sections.filter(section => section.length > 0);
}

// Function to get styling for different section types
function getBiggerSectionStyle(sectionName, index, color1, color2, color3, color4) {
    const sectionLower = sectionName.toLowerCase();
    
    // Hero sections - much bigger and more prominent
    if (sectionLower.includes('hero') || sectionLower.includes('welcome') || sectionLower.includes('dynamic')) {
        return {
            style: `background: linear-gradient(135deg, ${color1}, ${color2}); height: 65px; border-radius: 8px; margin: 6px 0; display: flex; align-items: center; justify-content: center; padding: 0 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);`,
            textColor: 'white'
        };
    }
    
    // Gallery/Portfolio sections - bigger grid layout
    if (sectionLower.includes('gallery') || sectionLower.includes('portfolio') || sectionLower.includes('showcase')) {
        return {
            style: `background: ${color3}; height: 50px; border-radius: 6px; margin: 4px 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 3px; padding: 6px; border: 1px solid ${color4};`,
            textColor: color1
        };
    }
    
    // Contact/Action sections - bigger call-to-action style
    if (sectionLower.includes('contact') || sectionLower.includes('action') || sectionLower.includes('book')) {
        return {
            style: `background: ${color2}; height: 35px; border-radius: 6px; margin: 4px 0; display: flex; align-items: center; justify-content: center; padding: 0 10px; border: 2px solid ${color1}; font-weight: 600;`,
            textColor: 'white'
        };
    }
    
    // Testimonials - bigger distinctive styling
    if (sectionLower.includes('testimonial') || sectionLower.includes('review')) {
        return {
            style: `background: ${color3}; height: 30px; border-radius: 6px; margin: 4px 0; display: flex; align-items: center; padding: 0 10px; border-left: 4px solid ${color2};`,
            textColor: color1
        };
    }
    
    // Results/Process sections - bigger
    if (sectionLower.includes('result') || sectionLower.includes('process') || sectionLower.includes('approach')) {
        return {
            style: `background: white; height: 35px; border-radius: 6px; margin: 4px 0; display: flex; align-items: center; padding: 0 10px; border: 1px solid ${color4}; box-shadow: 0 1px 4px rgba(0,0,0,0.05);`,
            textColor: color1
        };
    }
    
    // Default content sections - bigger
    return {
        style: `background: ${color3}; height: 32px; border-radius: 6px; margin: 4px 0; display: flex; align-items: center; padding: 0 10px; border: 1px solid rgba(0,0,0,0.05);`,
        textColor: color1
    };
}

// Function to add visual thumbnails for gallery layouts
function addGalleryThumbnailsToLayout() {
    const gallerySection = document.querySelector('.layout-section[style*="grid-template-columns"]');
    if (gallerySection) {
        gallerySection.innerHTML = '';
        for (let i = 0; i < 6; i++) {
            const thumb = document.createElement('div');
            thumb.style.cssText = `
                background: linear-gradient(45deg, #ddd, #bbb);
                border-radius: 2px;
                height: 100%;
                border: 1px solid #999;
            `;
            gallerySection.appendChild(thumb);
        }
    }
}

// Generates the voice characteristics display in the results
function generateVoiceCharacteristics(characteristics) {
    const voiceGrid = document.getElementById('voiceCharacteristics');
    if (!voiceGrid) return;
    
    voiceGrid.innerHTML = '';
    
    characteristics.forEach(char => {
        const voiceItem = document.createElement('div');
        voiceItem.className = 'voice-item';
        voiceItem.textContent = char;
        voiceGrid.appendChild(voiceItem);
    });
}

// Generates the photography recommendation text in the results
function generatePhotoRecommendation() {
    const photoStyles = {
        'gritty': 'Authentic, behind-the-scenes photos that show your real work environment.',
        'soft': 'Warm, naturally-lit photos with a welcoming, approachable feel.',
        'studio': 'Professional, clean studio-style photography with controlled lighting.',
        'vibrant': 'Bold, high-energy photos with saturated colors and dynamic compositions.',
        'bw': 'Classic black and white photography for a timeless and sophisticated appeal.'
    };
    
    const style = state.answers.photographyVibe || 'soft';
    const element = document.getElementById('photoRecommendation');
    if (element) {
        element.textContent = photoStyles[style];
    }
}

// Generates the content strategy summary in the results
function generateContentStrategy() {
    const strategy = document.getElementById('contentStrategy');
    if (!strategy) return;
    
    const fiveSecond = state.answers.fiveSecondMessage || 'Your key message';
    const contactPref = state.answers.contactPreference || 'forms';
    
    let ctaText = 'Get In Touch';
    if (contactPref === 'bookings') {
        ctaText = 'Book Now';
    } else if (contactPref === 'calls') {
        ctaText = 'Call Today';
    } else if (contactPref === 'messages') {
        ctaText = 'Send a Message';
    }

    let contentFocusText = 'Balanced text and visuals';
    if (state.answers.textDensity === 'minimal-text') {
        contentFocusText = 'Visual-first approach with concise text.';
    } else if (state.answers.textDensity === 'info-heavy') {
        contentFocusText = 'Detailed explanations and comprehensive FAQ sections.';
    }

    strategy.innerHTML = `
        <p><strong>Hero Message:</strong> "${fiveSecond}"</p>
        <p><strong>Primary Call-to-Action (CTA):</strong> "${ctaText}"</p>
        <p><strong>Content Focus:</strong> ${contentFocusText}</p>
        <p><strong>Client Testimonials:</strong> ${state.answers.clientRecommendations || 'Not provided'}</p>
    `;
}

// Generates the final project checklist in the results
function generateFinalChecklist() {
    const checklist = document.getElementById('finalChecklist');
    if (!checklist) return;
    
    const checklistItems = [
        `Professional photos (${state.answers.photographyVibe || 'natural'} style)`,
        `Logo design (reflecting a ${state.answers.designExpression || 'balanced'} approach)`,
        `Copy writing (${state.answers.introduction || 'professional'} tone)`,
        `Domain name selection`,
        `Contact method setup (${state.answers.contactPreference || 'contact forms'})`
    ];

    if (state.answers.businessHours === 'hours-yes') {
        checklistItems.push('Prominent display of business hours');
    }

    checklist.innerHTML = `
        <ul>
            ${checklistItems.map(item => `<li>✅ ${item}</li>`).join('')}
        </ul>
    `;
}

// Placeholder for PDF download functionality
function downloadPDFFunction() {
    alert('PDF download feature would typically be implemented with a library like jsPDF or server-side generation. This is a placeholder.');
}

// Function to send results via email
function sendToAngieFunction() {
    const summary = generateTextSummary();
    const subject = encodeURIComponent('Brand Discovery Results from Website Assistant');
    const body = encodeURIComponent(summary);
    window.open(`mailto:hello@angiewebstudio.com?subject=${subject}&body=${body}`);
}

// Function to copy results to clipboard
function copyToClipboard() {
    const summary = generateTextSummary();
    navigator.clipboard.writeText(summary).then(() => {
        alert('Brand summary copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        alert('Failed to copy text to clipboard. Please try manually.');
    });
}

// Generates a comprehensive text summary of the brand profile
function generateTextSummary() {
    const archetype = state.brandProfile;
    const answers = state.answers;
    
    return `BRAND DISCOVERY RESULTS
---------------------------------
Brand Archetype: ${archetype.name}
Description: ${archetype.description}

Voice & Tone: ${archetype.voice.join(', ')}
Introduction Style: ${answers.introduction || 'Not specified'}
Greeting Style: ${answers.greeting || 'Not specified'}
Tone Calibration: ${answers.toneStyle ? getToneStyleText(answers.toneStyle) : 'Not specified'}
Elevator Pitch: ${answers.elevatorPitch || 'Not provided'}

Visual Style:
- Photography Vibe: ${answers.photographyVibe || 'Not specified'}
- Layout Energy: ${answers.layoutEnergy || 'Not specified'} 
- Content Density: ${answers.textDensity || 'Not specified'}
- Typography: ${archetype.fonts || 'Not specified'}
- Color Palette: ${archetype.colorDesc || 'Not specified'}

Key Messaging:
- 5-Second Hero Message: "${answers.fiveSecondMessage || 'Not provided'}"
- Client Testimonials: ${answers.clientRecommendations || 'Not provided'}

Website Strategy:
- Primary Contact Method: ${answers.contactPreference || 'Not specified'}
- Business Hours Display: ${answers.businessHours === 'hours-yes' ? 'Yes, prominently' : 'No, not essential'}
- Recommended Layout: ${archetype.layout || 'Not specified'}

Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
`;
}

// Helper for tone slider text
function getToneStyleText(value) {
    const labels = ['Plainspoken', 'Friendly', 'Clever', 'Serious'];
    return labels[parseInt(value, 10) - 1] || 'Not specified'; 
}


// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Mobile Navigation Toggle
function initMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const navClose = document.querySelector('.nav-close');
    const nav = document.querySelector('nav');
    const overlay = document.querySelector('.overlay');
    
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            nav.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (navClose) {
        navClose.addEventListener('click', closeNav);
    }
    
    if (overlay) {
        overlay.addEventListener('click', closeNav);
    }
    
    function closeNav() {
        nav.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Close nav on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('active')) {
            closeNav();
        }
    });
}

// Update the init function to include mobile nav
function init() {
    updateProgress();
    setupEventListeners();
    initMobileNav(); // Add this line
    
    // Hide the results container initially
    const resultsContainer = document.getElementById('resultsContainer');
    if (resultsContainer) {
        resultsContainer.classList.remove('active');
    }
}
// Mobile Navigation Toggle
function initMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const navClose = document.querySelector('.nav-close');
    const nav = document.querySelector('nav');
    const overlay = document.querySelector('.overlay');
    
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            nav.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (navClose) {
        navClose.addEventListener('click', closeNav);
    }
    
    if (overlay) {
        overlay.addEventListener('click', closeNav);
    }
    
    function closeNav() {
        nav.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Close nav on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('active')) {
            closeNav();
        }
    });
}