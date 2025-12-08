// ============================================================================
// EMAILJS CONFIGURATION
// ============================================================================

// YOUR EMAILJS CREDENTIALS
const EMAILJS_CONFIG = {
    publicKey: 'WuG1XAqTvWPbw5zq_',
    serviceID: 'service_m5trkpu',
    templateID: 'template_tkz8hj3'
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
            // DEBUG: Log what we're sending
            console.log('==== EMAIL SEND ATTEMPT ====');
            console.log('Service ID:', EMAILJS_CONFIG.serviceID);
            console.log('Template ID:', EMAILJS_CONFIG.templateID);
            console.log('Public Key:', EMAILJS_CONFIG.publicKey);
            console.log('Form Data:', formData);
            console.log('============================');
            
            // Send email via EmailJS
            const response = await emailjs.send(
                EMAILJS_CONFIG.serviceID,
                EMAILJS_CONFIG.templateID,
                formData
            );
            
            console.log('SUCCESS - Email sent:', response);
            
            // Show success message
            alert('Thank you! Your message has been sent successfully. I will get back to you within 24 hours.');
            
            // Reset form
            contactForm.reset();
            
        } catch (error) {
            console.error('ERROR - Email send failed:', error);
            console.error('Error details:', error.text || error.message);
            
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
