// ============================================================================
// EMAILJS CONFIGURATION
// ============================================================================

const EMAILJS_CONFIG = {
    publicKey: 'WuG1XAqTvWPbw5zq_',
    serviceID: 'service_m5trkpu',
    templateID: 'template_tkz8hj3',           // Your main template (email to YOU)
    autoReplyTemplateID: 'template_zv69ipm'   // Auto-reply template (email to CLIENT)
};

// ============================================================================
// INITIALIZE EMAILJS
// ============================================================================

emailjs.init(EMAILJS_CONFIG.publicKey);

// ============================================================================
// FORM SUBMISSION HANDLER - SIMPLE VERSION
// ============================================================================

window.addEventListener('load', function() {
    const form = document.querySelector('.contact-form');
    
    if (!form) {
        console.error('Form not found!');
        return;
    }
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        // Get form values directly from the form
        const formData = new FormData(form);
        
        const templateParams = {
            from_name: formData.get('name'),
            from_email: formData.get('email'),
            project_type: formData.get('project-type'),
            message: formData.get('message'),
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
        
        console.log('Sending:', templateParams);
        
        try {
            // Send email to YOU (main notification)
            const response1 = await emailjs.send(
                EMAILJS_CONFIG.serviceID,
                EMAILJS_CONFIG.templateID,
                templateParams
            );
            
            console.log('SUCCESS - Notification sent to you:', response1);
            
            // Send auto-reply to CLIENT
            const response2 = await emailjs.send(
                EMAILJS_CONFIG.serviceID,
                EMAILJS_CONFIG.autoReplyTemplateID,
                templateParams
            );
            
            console.log('SUCCESS - Auto-reply sent to client:', response2);
            
            alert('Thank you! Your message has been sent successfully. Check your email for next steps. I will get back to you within 24 hours.');
            form.reset();
            
        } catch (error) {
            console.error('ERROR:', error);
            console.error('Error details:', error.text || error.message);
            alert('Oops! Something went wrong. Please try again or email me directly at contact@angiewebstudio.com');
        }
        
        // Reset button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Project Request';
    });
});
