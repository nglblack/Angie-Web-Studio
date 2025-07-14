class OpenAIIntegration {
    constructor() {
        this.apiEndpoint = '/.netlify/functions/openai-proxy';
        this.isProcessing = false;
        this.isLocal = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost';
    }

    async generateContent(promptType, userData) {
        if (this.isProcessing) return null;
        this.isProcessing = true;

        try {
            // If running locally, use fallback immediately
            if (this.isLocal) {
                console.log('Running locally - using fallback content');
                const fallback = this.getSmartFallbackContent(promptType, userData);
                this.isProcessing = false;
                return fallback;
            }

            const prompt = this.buildPrompt(promptType, userData);
            
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.isProcessing = false;
            
            return data.result || this.getSmartFallbackContent(promptType, userData);
        } catch (error) {
            console.error('OpenAI API Error:', error);
            this.isProcessing = false;
            return this.getSmartFallbackContent(promptType, userData);
        }
    }

        buildPrompt(promptType, userData) {
    if (promptType === 'audience') {
        // Check if this is a revision request
        if (userData.description && userData.description.includes('Current profile:')) {
            return `You are a professional copywriter helping create customer personas. ${userData.description}

        Write a detailed, business-focused customer persona that includes:
        - A specific name and demographic details
        - Their primary pain points and frustrations
        - What triggers them to seek this service
        - Their budget considerations and decision-making process
        - Preferred communication channels and timing
        - What objections they might have
        - What would make them choose one provider over another

        Write in a narrative style that's actionable for marketing and sales. Make it 4-5 sentences.`;
                }
                
                // Enhanced business persona creation prompt
                return `Create a detailed, business-focused customer persona for a service business. Here's what we know:

        **Business Context:**
        - Business type: ${userData.businessType || 'service business'}
        - Target goals: ${userData.businessType || 'helping customers'}

        **Customer Behavior:**
        - They enjoy working with people who are: ${userData.enjoyWorking || 'professional and reliable'}
        - Quick-to-book customers tend to be: ${userData.bookQuickly || 'ready to make decisions'}
        - Primary decision maker: ${userData.decisionMaker || 'individual customers'}

        **Additional Context:**
        ${userData.description || 'No additional context provided'}

        Create a persona that includes these business-critical elements:
        - **Demographics**: Name, age range, income level, location type
        - **Pain Points**: What problems keep them up at night?
        - **Triggers**: What makes them start looking for this service?
        - **Budget**: How do they think about pricing and value?
        - **Decision Process**: How do they research and choose providers?
        - **Objections**: What concerns might stop them from buying?
        - **Communication**: When and how do they prefer to be contacted?

        Write this as a compelling narrative that gives actionable insights for marketing, sales, and service delivery. Make it 4-5 sentences that flow naturally.`;
            }
            
            // Keep other prompt types the same...
            return `Analyze this business information and create an ideal customer profile: ${JSON.stringify(userData)}`;
        }


    getSmartFallbackContent(promptType, userData) {
        if (promptType === 'audience') {
            return this.generateSmartAudienceProfile(userData);
        }
        
        return "Your ideal customers value quality service and professional expertise.";
    }

    generateSmartAudienceProfile(userData) {
    const { businessType, enjoyWorking, bookQuickly, decisionMaker, description } = userData;
    
    // Check if this is a revision request
    if (description && description.includes('Please make this')) {
        return this.handleRevisionRequest(description);
    }
    
    // Create realistic personas based on combinations
    const personas = this.getPersonaTemplates();
    
    // Find best matching persona based on selections and custom description
    const matchingPersona = this.findBestPersonaMatch(enjoyWorking, bookQuickly, decisionMaker, personas, description);
    
    // Customize the persona with user's specific details
    let finalPersona = matchingPersona.base;
    
    // Add business type context if available
    if (businessType && businessType !== 'undefined' && businessType.trim()) {
        finalPersona = finalPersona.replace('[SERVICE_TYPE]', businessType.toLowerCase());
    } else {
        finalPersona = finalPersona.replace('[SERVICE_TYPE]', 'quality service');
    }
    
    // Add business context from custom description
    if (description && description.trim() && !description.includes('Current profile:')) {
        // Extract business insights from description
        let businessContext = '';
        
        if (description.toLowerCase().includes('budget') || description.toLowerCase().includes('cost') || description.toLowerCase().includes('price')) {
            businessContext += ' They are particularly price-conscious and need clear value justification.';
        }
        
        if (description.toLowerCase().includes('time') || description.toLowerCase().includes('busy') || description.toLowerCase().includes('schedule')) {
            businessContext += ' Time efficiency is their top priority when choosing service providers.';
        }
        
        if (description.toLowerCase().includes('quality') || description.toLowerCase().includes('premium') || description.toLowerCase().includes('best')) {
            businessContext += ' They prioritize quality and are willing to invest in premium services.';
        }
        
        // Add custom description with business context
        finalPersona += ` Additional insight: ${description.trim()}.${businessContext}`;
    }
    
    return finalPersona;
}



handleRevisionRequest(description) {
    const currentProfileMatch = description.match(/Current profile: "(.*?)"/s);
    const requestMatch = description.match(/User request: (.*)/s);
    
    if (!currentProfileMatch || !requestMatch) {
        return "Your ideal customers value quality service and appreciate working with professionals who understand their unique needs.";
    }
    
    const currentProfile = currentProfileMatch[1];
    const request = requestMatch[1].toLowerCase();
    
    if (request.includes('shorter') || request.includes('brief')) {
        return this.makeShorter(currentProfile);
    } else if (request.includes('detailed') || request.includes('longer')) {
        return this.makeDetailed(currentProfile);
    } else if (request.includes('professional') || request.includes('formal')) {
        return this.makeProfessional(currentProfile);
    }
    
    return currentProfile;
}

makeShorter(profile) {
    // Extract key points and make concise
    const sentences = profile.split('. ');
    const keyPoints = [];
    
    if (profile.includes('local')) keyPoints.push('local community members');
    if (profile.includes('quality')) keyPoints.push('value quality');
    if (profile.includes('overwhelmed')) keyPoints.push('need guidance');
    if (profile.includes('professional')) keyPoints.push('expect professionalism');
    if (profile.includes('trust')) keyPoints.push('value trust');
    
    if (keyPoints.length === 0) {
        return "Busy professionals who value quality service and clear communication.";
    }
    
    return `Your ideal customers are ${keyPoints.slice(0, 2).join(' and ')}.`;
}

makeDetailed(profile) {
    // Expand on the existing profile
    let detailed = profile;
    
    if (profile.includes('local')) {
        detailed += " They're deeply rooted in their community and prefer supporting local businesses they can build lasting relationships with.";
    }
    
    if (profile.includes('overwhelmed')) {
        detailed += " They often juggle multiple responsibilities and greatly appreciate service providers who can simplify the process and take care of details for them.";
    }
    
    if (profile.includes('quality')) {
        detailed += " They understand that quality work is an investment and are willing to pay for expertise and exceptional results.";
    }
    
    return detailed;
}

makeProfessional(profile) {
    // Make more formal and business-like
    return profile
        .replace(/They're/g, 'They are')
        .replace(/can't/g, 'cannot')
        .replace(/don't/g, 'do not')
        .replace(/won't/g, 'will not')
        .replace('folks', 'individuals')
        .replace('people', 'clients')
        + " These clients prioritize professional competence and expect service providers to demonstrate expertise and maintain high standards.";
}

getPersonaTemplates() {
    return [
        {
            key: 'quality_overwhelmed_individual',
            base: 'Meet Sarah, a 35-42 year old working mother with household income of $75-120k who feels overwhelmed by managing family and career responsibilities. Her biggest pain point is not having enough time to research service providers thoroughly, which makes her anxious about making the wrong choice. She\'s triggered to seek [SERVICE_TYPE] when current solutions fail or when she realizes she\'s spending too much time on tasks outside her expertise. Sarah has a moderate budget but prioritizes value over low cost - she\'s willing to pay 15-20% more for providers who save her time, communicate clearly, and deliver reliably without requiring her constant oversight.'
        },
        {
            key: 'locals_rush_individual',
            base: 'Think of Mike, a 28-45 year old local business owner with $60-100k income who values community connections and often needs quick turnaround times. His main frustration is service providers who don\'t understand the urgency of small business needs or who over-complicate simple requests. Mike is triggered to seek [SERVICE_TYPE] when facing tight deadlines or when his current provider becomes unresponsive. He prefers competitive pricing and makes decisions quickly based on local referrals and demonstrated responsiveness - he\'ll often choose the provider who answers their phone first and can start immediately.'
        },
        {
            key: 'trust_ready_commit_business',
            base: 'Consider Lisa, a 32-50 year old corporate decision-maker earning $90-150k who manages budgets for a growing company. Her biggest challenge is justifying expenses to leadership while ensuring quality doesn\'t suffer due to cost-cutting. She\'s motivated to seek [SERVICE_TYPE] when facing compliance issues, growth challenges, or when current solutions can\'t scale with business needs. Lisa has approval authority for mid-tier budgets but needs clear ROI documentation and prefers providers who offer structured contracts, regular reporting, and can demonstrate measurable business impact.'
        },
        {
            key: 'quality_trust_professional',
            base: 'Picture David, a 40-55 year old established professional with $100-200k+ income who has worked hard to build his reputation. His primary pain point is service providers who don\'t match his standards of excellence or who might reflect poorly on his personal brand. He seeks [SERVICE_TYPE] when facing complex challenges that require specialized expertise or when his current approach isn\'t delivering the premium results his clients expect. David has a healthy budget for quality services and chooses providers based on credentials, portfolio quality, and referrals from his professional network - price is secondary to proven expertise and reliability.'
        },
        {
            key: 'family_caregiving',
            base: 'Meet Jennifer, a 38-48 year old sandwich generation professional earning $70-110k who manages both child and elder care responsibilities. Her biggest frustration is service providers who don\'t understand her complex scheduling constraints or who require too much hands-on management. She\'s triggered to seek [SERVICE_TYPE] when family crises arise, when DIY solutions fail, or when she realizes she\'s sacrificing family time for tasks others could handle better. Jennifer needs flexible scheduling, clear communication, and providers who can work independently - she\'s willing to pay premium rates for services that truly reduce her stress and time commitment.'
        },
        {
            key: 'default',
            base: 'Your ideal customer is someone like Jennifer, a 35-50 year old busy professional earning $70-130k who values quality [SERVICE_TYPE] and clear communication. Her main pain point is finding reliable providers who understand her time constraints and deliver consistent results without requiring constant oversight. She\'s motivated to seek services when current solutions become inadequate or when she realizes her time is better spent on higher-value activities. Jennifer makes thoughtful decisions based on reviews, referrals, and initial consultations - she prefers providers who are responsive, transparent about pricing, and can demonstrate clear value for their services.'
        }
    ];
}

findBestPersonaMatch(enjoyWorking, bookQuickly, decisionMaker, personas, description = '') {
    // Convert sets to arrays and check for matches
    const enjoyArray = Array.isArray(enjoyWorking) ? enjoyWorking : Array.from(enjoyWorking || []);
    const bookArray = Array.isArray(bookQuickly) ? bookQuickly : Array.from(bookQuickly || []);
    
    // Check for family/caregiving context first
    if (description && (description.toLowerCase().includes('parent') || description.toLowerCase().includes('kids') || description.toLowerCase().includes('elder') || description.toLowerCase().includes('family'))) {
        return personas.find(p => p.key === 'family_caregiving') || personas.find(p => p.key === 'default');
    }
    
    // Try specific combinations
    if (enjoyArray.includes('quality') && bookArray.includes('overwhelmed')) {
        return personas.find(p => p.key === 'quality_overwhelmed_individual') || personas.find(p => p.key === 'default');
    }
    
    if (enjoyArray.includes('locals') && bookArray.includes('rush')) {
        return personas.find(p => p.key === 'locals_rush_individual') || personas.find(p => p.key === 'default');
    }
    
    if (enjoyArray.includes('trust') && (decisionMaker === 'business' || bookArray.includes('ready_commit'))) {
        return personas.find(p => p.key === 'trust_ready_commit_business') || personas.find(p => p.key === 'default');
    }
    
    if (enjoyArray.includes('quality') && enjoyArray.includes('trust')) {
        return personas.find(p => p.key === 'quality_trust_professional') || personas.find(p => p.key === 'default');
    }
    
    return personas.find(p => p.key === 'default');
}
}

// Global instance
window.openai_integration = new OpenAIIntegration();
console.log('OpenAI Integration loaded successfully', window.openai_integration.isLocal ? '(Local mode)' : '(Production mode)');