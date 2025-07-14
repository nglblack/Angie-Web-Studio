// Enhanced Contact Form Manager
        class ContactFormManager {
            constructor() {
                this.init();
            }

            init() {
                this.loadSelectedTemplates();
                this.enhanceContactForm();
                this.setTimestamp();
            }

            setTimestamp() {
                const timestampField = document.getElementById('timestamp');
                if (timestampField) {
                    timestampField.value = new Date().toISOString();
                }
            }

            loadSelectedTemplates() {
                // Check URL parameters for selected templates
                const urlParams = new URLSearchParams(window.location.search);
                const templateParams = urlParams.get('templates');
                
                if (templateParams) {
                    const templateKeys = templateParams.split(',');
                    this.displaySelectedTemplates(templateKeys);
                    this.showTemplateNotice();
                }

                // Also check localStorage
                try {
                    const saved = localStorage.getItem('selectedTemplates');
                    if (saved) {
                        const selections = JSON.parse(saved);
                        if (selections.length > 0) {
                            this.displaySelectedTemplatesFromStorage(selections);
                            this.showTemplateNotice();
                        }
                    }
                } catch (error) {
                    console.warn('Could not load template selections:', error);
                }
            }

            showTemplateNotice() {
                const notice = document.getElementById('template-interest-notice');
                if (notice) {
                    notice.style.display = 'block';
                }
            }

            displaySelectedTemplates(templateKeys) {
                if (templateKeys.length === 0) return;

                const form = document.getElementById('contact-form');
                if (!form) return;

                // Create templates section in form
                const templatesSection = document.createElement('div');
                templatesSection.className = 'form-group selected-templates-section';
                templatesSection.innerHTML = `
                    <label class="form-label">
                        <i class="fas fa-heart" style="color: #e74c3c; margin-right: 0.5rem;"></i>
                        Templates you're interested in:
                    </label>
                    <div class="selected-templates-display">
                        ${templateKeys.map(key => `
                            <div class="selected-template-badge">
                                <span>${this.formatTemplateName(key)}</span>
                                <input type="hidden" name="selected_templates[]" value="${key}">
                            </div>
                        `).join('')}
                    </div>
                    <p class="form-helper-text">
                        <i class="fas fa-info-circle"></i>
                        These templates will be mentioned when I follow up with you.
                    </p>
                `;

                // Insert at the beginning of the form
                const firstFormGroup = form.querySelector('.form-group');
                if (firstFormGroup) {
                    form.insertBefore(templatesSection, firstFormGroup);
                }
            }

            displaySelectedTemplatesFromStorage(selections) {
                if (selections.length === 0) return;

                const form = document.getElementById('contact-form');
                if (!form) return;

                // Create templates section in form
                const templatesSection = document.createElement('div');
                templatesSection.className = 'form-group selected-templates-section';
                templatesSection.innerHTML = `
                    <label class="form-label">
                        <i class="fas fa-heart" style="color: #e74c3c; margin-right: 0.5rem;"></i>
                        Templates you're interested in:
                    </label>
                    <div class="selected-templates-display">
                        ${selections.map(template => `
                            <div class="selected-template-badge">
                                <span>${template.name}</span>
                                <input type="hidden" name="selected_templates[]" value="${template.key}">
                                <input type="hidden" name="selected_template_names[]" value="${template.name}">
                            </div>
                        `).join('')}
                    </div>
                    <p class="form-helper-text">
                        <i class="fas fa-info-circle"></i>
                        These templates will be mentioned when I follow up with you.
                    </p>
                `;

                // Insert at the beginning of the form
                const firstFormGroup = form.querySelector('.form-group');
                if (firstFormGroup) {
                    form.insertBefore(templatesSection, firstFormGroup);
                }
            }

            enhanceContactForm() {
                const form = document.getElementById('contact-form');
                if (!form) return;

                form.addEventListener('submit', (e) => {
                    e.preventDefault(); // Prevent default submission for demo
                    
                    // Add selected templates data to form submission
                    this.addTemplateDataToSubmission(form);
                    
                    // Show success message
                    this.showSuccessMessage(form);
                    
                    // Log form data for demonstration
                    this.logFormData(form);
                });
            }

            addTemplateDataToSubmission(form) {
                const selectedTemplates = document.querySelectorAll('input[name="selected_templates[]"]');
                const templateNames = document.querySelectorAll('input[name="selected_template_names[]"]');
                
                if (selectedTemplates.length > 0) {
                    // Add a summary field for easy reading in email
                    let summaryField = form.querySelector('input[name="template_interest_summary"]');
                    if (!summaryField) {
                        summaryField = document.createElement('input');
                        summaryField.type = 'hidden';
                        summaryField.name = 'template_interest_summary';
                        form.appendChild(summaryField);
                    }
                    
                    const templateList = templateNames.length > 0 
                        ? Array.from(templateNames).map(input => input.value).join(', ')
                        : Array.from(selectedTemplates).map(input => this.formatTemplateName(input.value)).join(', ');
                    
                    summaryField.value = `Customer is interested in ${selectedTemplates.length} template(s): ${templateList}`;
                }
            }

            showSuccessMessage(form) {
                const messageDiv = document.getElementById('form-message');
                const submitBtn = form.querySelector('button[type="submit"]');
                
                if (messageDiv) {
                    messageDiv.style.display = 'block';
                    messageDiv.innerHTML = `
                        <div style="background: rgba(40, 167, 69, 0.1); border: 1px solid rgba(40, 167, 69, 0.3); border-radius: 8px; padding: 1rem; text-align: center;">
                            <i class="fas fa-check-circle" style="color: #28a745; margin-right: 0.5rem;"></i>
                            <strong>Message sent successfully!</strong><br>
                            Thanks for reaching out! I'll follow up within 1 business day.
                        </div>
                    `;
                }
                
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
                    submitBtn.style.background = '#28a745';
                }

                // Clear localStorage after successful submission
                localStorage.removeItem('selectedTemplates');
            }

            logFormData(form) {
                const formData = new FormData(form);
                console.log('=== FORM SUBMISSION DATA ===');
                console.log('This data would be sent to your form processor:');
                console.log('');
                
                for (let [key, value] of formData.entries()) {
                    console.log(`${key}: ${value}`);
                }
                
                console.log('');
                console.log('=== EMAIL CONTENT PREVIEW ===');
                console.log('Subject: New Contact Form Submission from Angie Web Studio');
                console.log('');
                console.log(`Name: ${formData.get('name')}`);
                console.log(`Email: ${formData.get('email')}`);
                console.log(`Business: ${formData.get('business') || 'Not provided'}`);
                console.log(`Project Description: ${formData.get('project')}`);
                console.log(`Deadline: ${formData.get('deadline') || 'Not specified'}`);
                
                const templateSummary = formData.get('template_interest_summary');
                if (templateSummary) {
                    console.log(`Template Interest: ${templateSummary}`);
                }
                
                console.log(`Submitted: ${formData.get('timestamp')}`);
            }

            formatTemplateName(key) {
                return key.split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ');
            }
        }

        // Initialize contact form manager when DOM is ready
        document.addEventListener('DOMContentLoaded', () => {
            window.contactFormManager = new ContactFormManager();
        });