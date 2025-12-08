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
    
    if (!contactForm) {
        console.error('Contact form not found!');
        return;
    }
    
    console.log('Contact form initialized successfully');

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        console.log('Form submit event triggered');
        
        // Disable submit button and show loading state
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            submitButton.style.opacity = '0.7';
        }
        
        // Get form data with better error checking
        const nameField = document.getElementById('name');
        const emailField = document.getElementById('email');
        const projectTypeField = document.getElementById('project-type');
        const messageField = document.getElementById('message');
        
        console.log('Field check:', {
            name: nameField ? nameField.value : 'NOT FOUND',
            email: emailField ? emailField.value : 'NOT FOUND',
            projectType: projectTypeField ? projectTypeField.value : 'NOT FOUND',
            message: messageField ? messageField.value : 'NOT FOUND'
        });
        
        const formData = {
            from_name: nameField ? nameField.value : '',
            from_email: emailField ? emailField.value : '',
            project_type: projectTypeField ? projectTypeField.value : '',
            message: messageField ? messageField.value : '',
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

// Make absolutely sure DOM is fully loaded
window.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded, initializing contact form...');
    initContactForm();
});

// Backup initialization if DOMContentLoaded already fired
if (document.readyState === 'interactive' || document.readyState === 'complete') {
    console.log('DOM already loaded, initializing contact form immediately...');
    initContactForm();
}
