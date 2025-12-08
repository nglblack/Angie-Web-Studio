// ============================================================================
// EMAILJS CONFIGURATION
// ============================================================================

// YOUR EMAILJS CREDENTIALS - Replace with your actual values
const EMAILJS_CONFIG = {
    publicKey: 'WuG1XAqTvWPbw5zq_',      // From Account > API Keys
    serviceID: 'service_m5trkpu',      // From Email Services (e.g., service_abc123)
    templateID: 'template_tkz8hj3'     // From Email Templates (e.g., template_xyz789)
};

// ============================================================================
// INITIALIZE EMAILJS
// ============================================================================

(function() {
    emailjs.init(EMAILJS_CONFIG.publicKey);
})();

// ============================================================================
// FORM SUBMISSION HANDLER
// ============================================================================

function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    const submitButton = contactForm?.querySelector('button[type="submit"]');
    
    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Disable submit button and show loading state
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            submitButton.style.opacity = '0.7';
        }
        
        // Get form data
        const formData = {
            from_name: contactForm.querySelector('#name').value,
            from_email: contactForm.querySelector('#email').value,
            project_type: contactForm.querySelector('#project-type').value,
            message: contactForm.querySelector('#message').value,
            timestamp: new Date().toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZoneName: 'short'
            })
        };
        
        try {
            // Send email via EmailJS
            const response = await emailjs.send(
                EMAILJS_CONFIG.serviceID,
                EMAILJS_CONFIG.templateID,
                formData
            );
            
            console.log('Email sent successfully:', response);
            
            // Show success message
            alert('Thank you! Your message has been sent successfully. I\'ll get back to you within 24 hours.');
            
            // Reset form
            contactForm.reset();
            
        } catch (error) {
            console.error('Email send failed:', error);
            
            // Show error message
            alert('Oops! Something went wrong sending your message. Please try again or email me directly at contact@angiewebstudio.com');
            
        } finally {
            // Re-enable submit button
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = 'Send Project Request';
                submitButton.style.opacity = '1';
            }
        }
    });
}

// ============================================================================
// INITIALIZE WHEN DOM IS READY
// ============================================================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactForm);
} else {
    initContactForm();
}
