// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing form script');
    
    // Hamburger menu functionality
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    }
    
    let currentStep = 1;
    const totalSteps = 5;
    
    // Function to show current step
    function showStep(step) {
        console.log('Showing step:', step);
        // Hide all steps
        for (let i = 1; i <= totalSteps; i++) {
            const stepElement = document.getElementById(`step${i}`);
            if (stepElement) {
                stepElement.classList.remove('active');
            }
        }
        
        // Show current step
        const currentStepElement = document.getElementById(`step${step}`);
        if (currentStepElement) {
            currentStepElement.classList.add('active');
            console.log('Step element found and activated');
        } else {
            console.log('Step element not found for step:', step);
        }
        
        // Update progress steps
        const progressSteps = document.querySelectorAll('.progress-step');
        progressSteps.forEach((stepEl, index) => {
            if (index + 1 === step) {
                stepEl.classList.add('active');
            } else {
                stepEl.classList.remove('active');
            }
        });
    }
    
    // Next button functionality
    const nextButtons = document.querySelectorAll('.btn-next');
    console.log('Found next buttons:', nextButtons.length);
    nextButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            console.log('Next button clicked, current step:', currentStep);
            e.preventDefault();
            
            // Validate current step before proceeding
            if (validateStep(currentStep)) {
                console.log('Validation passed, proceeding to next step');
                if (currentStep < totalSteps) {
                    currentStep++;
                    showStep(currentStep);
                    
                    // Populate review section when reaching step 4
                    if (currentStep === totalSteps) {
                        populateReview();
                    }
                }
            } else {
                console.log('Validation failed');
            }
        });
    });
    
    // Previous button functionality
    const prevButtons = document.querySelectorAll('.btn-prev');
    prevButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (currentStep > 1) {
                currentStep--;
                showStep(currentStep);
            }
        });
    });
    
    // Validate each step
    function validateStep(step) {
        console.log('Validating step:', step);
        const currentStepElement = document.getElementById(`step${step}`);
        if (!currentStepElement) {
            console.log('Step element not found');
            return true;
        }
        
        const requiredFields = currentStepElement.querySelectorAll('[required]');
        console.log('Required fields found:', requiredFields.length);
        let isValid = true;
        
        // Clear previous error messages
        const existingErrors = currentStepElement.querySelectorAll('.error-message');
        existingErrors.forEach(error => error.remove());
        
        requiredFields.forEach(field => {
            // Reset border color
            field.style.borderColor = '#e0e0e0';
            
            if (!field.value.trim()) {
                showError(field, 'This field is required');
                isValid = false;
            } else {
                // Email validation
                if (field.type === 'email' && field.value) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(field.value)) {
                        showError(field, 'Please enter a valid email address');
                        isValid = false;
                    }
                }
                
                // Phone validation (Ghana format)
                if (field.id === 'phone' && field.value) {
                    const phoneRegex = /^[0-9]{10,12}$/;
                    const cleanPhone = field.value.replace(/[\s\-\(\)\+]/g, '');
                    if (!phoneRegex.test(cleanPhone)) {
                        showError(field, 'Please enter a valid phone number (e.g., 0244123456)');
                        isValid = false;
                    }
                }
                
                // Transaction ID validation
                if (field.id === 'transactionId' && field.value) {
                    const transactionRegex = /^[A-Za-z0-9]+$/;
                    if (!transactionRegex.test(field.value.replace(/\s/g, ''))) {
                        showError(field, 'Please enter a valid transaction ID (alphanumeric characters only)');
                        isValid = false;
                    }
                }
                
                // MoMo name validation
                if (field.id === 'momoName' && field.value) {
                    if (field.value.trim().length < 2) {
                        showError(field, 'Please enter a valid MoMo account name');
                        isValid = false;
                    }
                }
            }
        });
        
        return isValid;
    }
    
    // Show error message
    function showError(field, message) {
        field.style.borderColor = '#e74c3c';
        
        // Create error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = '#e74c3c';
        errorDiv.style.fontSize = '0.8rem';
        errorDiv.style.marginTop = '0.25rem';
        errorDiv.textContent = message;
        
        // Insert error after the field
        field.parentNode.appendChild(errorDiv);
        
        // Remove error when user starts typing
        field.addEventListener('input', function onInput() {
            field.style.borderColor = '#e0e0e0';
            const error = field.parentNode.querySelector('.error-message');
            if (error) {
                error.remove();
            }
            field.removeEventListener('input', onInput);
        });
    }
    
    // Populate review section
    function populateReview() {
        const reviewPersonal = document.getElementById('reviewPersonal');
        const reviewExperience = document.getElementById('reviewExperience');
        const reviewPosition = document.getElementById('reviewPosition');
        
        if (reviewPersonal) {
            const fullName = document.getElementById('firstName')?.value || 'Not provided';
            const email = document.getElementById('email')?.value || 'Not provided';
            const phone = document.getElementById('phone')?.value || 'Not provided';
            const address = document.getElementById('address')?.value || 'Not provided';
            const dob = document.getElementById('dob')?.value || 'Not provided';
            
            reviewPersonal.innerHTML = `
                <p><strong>Full Name:</strong> ${fullName}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Address:</strong> ${address}</p>
                <p><strong>Date of Birth:</strong> ${dob}</p>
            `;
        }
        
        if (reviewExperience) {
            const experience = document.getElementById('experience')?.value || 'Not provided';
            const previousCompany = document.getElementById('previousCompany')?.value || 'Not provided';
            const skills = document.getElementById('skills')?.value || 'Not provided';
            const availability = document.getElementById('availability')?.value || 'Not provided';
            
            reviewExperience.innerHTML = `
                <p><strong>Years of Experience:</strong> ${experience}</p>
                <p><strong>Previous Employer:</strong> ${previousCompany}</p>
                <p><strong>Skills:</strong> ${skills}</p>
                <p><strong>Availability to Start:</strong> ${availability}</p>
            `;
        }
        
        if (reviewPosition) {
            const position = document.getElementById('position')?.value || 'Not provided';
            const employmentType = document.getElementById('employmentType')?.value || 'Not provided';
            const shiftPreference = document.getElementById('shiftPreference')?.value || 'Not provided';
            const whyJoin = document.getElementById('whyJoin')?.value || 'Not provided';
            
            reviewPosition.innerHTML = `
                <p><strong>Position:</strong> ${position}</p>
                <p><strong>Employment Type:</strong> ${employmentType}</p>
                <p><strong>Shift Preference:</strong> ${shiftPreference}</p>
                <p><strong>Why do you want to join us:</strong> ${whyJoin}</p>
            `;
        }
    }
    
    // Handle form submission with Formspree
    const form = document.getElementById('applicationForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Validate final step before submission
            if (!validateStep(currentStep)) {
                return;
            }
            
            const submitButton = document.querySelector('.btn-submit');
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Submitting...';
            }
            
            try {
                const formData = new FormData(form);
                
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    // Hide form and show success message
                    form.style.display = 'none';
                    const formProgress = document.querySelector('.form-progress');
                    if (formProgress) formProgress.style.display = 'none';
                    const successMessage = document.getElementById('successMessage');
                    if (successMessage) successMessage.style.display = 'block';
                    
                    // Clear stored progress
                    localStorage.removeItem('applicationProgress');
                    
                    // Save to localStorage as backup
                    const applicationData = {};
                    const formElements = form.elements;
                    for (let element of formElements) {
                        if (element.name && element.name !== '_subject' && element.name !== '_next' && element.name !== '_captcha') {
                            applicationData[element.name] = element.value;
                        }
                    }
                    localStorage.setItem('lastApplication', JSON.stringify(applicationData));
                    
                    // Scroll to top of form
                    document.querySelector('.form-container')?.scrollIntoView({ behavior: 'smooth' });
                    
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Submission failed');
                }
                
            } catch (error) {
                console.error('Error:', error);
                alert('There was an error submitting your application. Please try again or contact us directly at +233 55 123 4567');
            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Submit Application';
                }
            }
        });
    }
    
    // Set minimum date for date of birth
    const dobInput = document.getElementById('dob');
    if (dobInput) {
        const today = new Date();
        const maxDate = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());
        dobInput.max = maxDate.toISOString().split('T')[0];
    }
    
    // Save progress to localStorage
    function saveProgress() {
        const formData = {};
        if (form) {
            const formElements = form.elements;
            for (let element of formElements) {
                if (element.name && element.type !== 'file' && 
                    element.name !== '_subject' && element.name !== '_next' && element.name !== '_captcha') {
                    formData[element.name] = element.value;
                }
            }
            localStorage.setItem('applicationProgress', JSON.stringify(formData));
        }
    }
    
    // Restore progress from localStorage
    function restoreProgress() {
        const savedData = localStorage.getItem('applicationProgress');
        if (savedData && form) {
            try {
                const formData = JSON.parse(savedData);
                for (let [key, value] of Object.entries(formData)) {
                    const field = form.querySelector(`[name="${key}"]`);
                    if (field && field.type !== 'file') {
                        field.value = value;
                    }
                }
            } catch (e) {
                console.error('Error restoring progress:', e);
            }
        }
    }
    
    // Auto-save progress on input
    if (form) {
        const formInputs = form.querySelectorAll('input, select, textarea');
        formInputs.forEach(field => {
            field.addEventListener('input', saveProgress);
            field.addEventListener('change', saveProgress);
        });
        
        // Restore progress on page load
        restoreProgress();
    }
    
    // Debug: Log to console that script loaded
    console.log('Application form script loaded successfully');
});