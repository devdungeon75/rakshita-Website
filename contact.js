// Contact Page JavaScript Functionality

// FAQ Functionality
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// Form Validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateForm(formData) {
    const errors = [];
    
    if (!formData.name || formData.name.trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
    }
    
    if (!formData.email || !validateEmail(formData.email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!formData.subject || formData.subject.trim().length < 5) {
        errors.push('Subject must be at least 5 characters long');
    }
    
    if (!formData.message || formData.message.trim().length < 10) {
        errors.push('Message must be at least 10 characters long');
    }
    
    return errors;
}

// Show Message
function showMessage(message, type = 'success') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    // Insert message at the top of the form
    const form = document.getElementById('supportForm');
    form.insertBefore(messageDiv, form.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// Handle Support Form Submission
function handleSupportForm(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        category: document.getElementById('category').value,
        message: document.getElementById('message').value
    };
    
    // Validate form
    const errors = validateForm(formData);
    
    if (errors.length > 0) {
        showMessage(errors.join(', '), 'error');
        return;
    }
    
    // Simulate form submission
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        showMessage('Thank you! Your message has been sent successfully. We\'ll get back to you within 2 hours.', 'success');
        
        // Reset form
        document.getElementById('supportForm').reset();
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

// Handle Subscribe Form Submission
function handleSubscribeForm(event) {
    event.preventDefault();
    
    const email = document.getElementById('subscribeEmail').value;
    
    if (!validateEmail(email)) {
        showMessage('Please enter a valid email address', 'error');
        return;
    }
    
    const subscribeBtn = document.querySelector('.subscribe-btn');
    const originalText = subscribeBtn.innerHTML;
    
    subscribeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
    subscribeBtn.disabled = true;
    
    // Simulate subscription
    setTimeout(() => {
        showMessage('Thank you for subscribing! You\'ll receive updates about new features and safety tips.', 'success');
        
        // Reset form
        document.getElementById('subscribeForm').reset();
        
        // Reset button
        subscribeBtn.innerHTML = originalText;
        subscribeBtn.disabled = false;
    }, 1500);
}

// Emergency Number Click Handler
function initEmergencyNumbers() {
    const emergencyCards = document.querySelectorAll('.emergency-card');
    
    emergencyCards.forEach(card => {
        card.addEventListener('click', () => {
            const number = card.querySelector('.emergency-number').textContent;
            const service = card.querySelector('h3').textContent;
            
            // Show confirmation dialog
            if (confirm(`Do you want to call ${service} at ${number}?`)) {
                // In a real app, this would initiate a phone call
                showMessage(`Initiating call to ${service}...`, 'success');
            }
        });
    });
}

// Contact Card Click Handlers
function initContactCards() {
    const contactCards = document.querySelectorAll('.contact-card');
    
    contactCards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.querySelector('h3').textContent;
            const contact = card.querySelector('p').textContent;
            
            if (title === 'Email Support') {
                // Open email client
                window.open(`mailto:${contact}`, '_blank');
            } else if (title === 'Phone Support') {
                // Show phone number
                if (confirm(`Do you want to call ${contact}?`)) {
                    showMessage('Initiating call...', 'success');
                }
            } else if (title === 'Live Chat') {
                // Simulate live chat
                showMessage('Live chat feature coming soon!', 'success');
            }
        });
    });
}

// Team Member Hover Effects
function initTeamMembers() {
    const teamMembers = document.querySelectorAll('.team-member');
    
    teamMembers.forEach(member => {
        member.addEventListener('mouseenter', () => {
            member.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        member.addEventListener('mouseleave', () => {
            member.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Emergency Card Hover Effects
function initEmergencyCardEffects() {
    const emergencyCards = document.querySelectorAll('.emergency-card');
    
    emergencyCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const icon = card.querySelector('.emergency-icon');
            icon.style.transform = 'scale(1.1)';
            icon.style.transition = 'transform 0.3s ease';
        });
        
        card.addEventListener('mouseleave', () => {
            const icon = card.querySelector('.emergency-icon');
            icon.style.transform = 'scale(1)';
        });
    });
}

// Form Input Effects
function initFormEffects() {
    const formInputs = document.querySelectorAll('input, select, textarea');
    
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.style.transform = 'translateY(-2px)';
            input.parentElement.style.transition = 'transform 0.3s ease';
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.style.transform = 'translateY(0)';
        });
    });
}

// Smooth Scroll for Emergency Numbers
function initSmoothScroll() {
    const emergencySection = document.querySelector('.emergency-section');
    
    // Add scroll animation when section comes into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const cards = entry.target.querySelectorAll('.emergency-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }
        });
    }, { threshold: 0.3 });
    
    observer.observe(emergencySection);
}

// Initialize Emergency Numbers Animation
function initEmergencyAnimation() {
    const emergencyCards = document.querySelectorAll('.emergency-card');
    
    emergencyCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
}

// Contact Form Auto-save
function initFormAutoSave() {
    const form = document.getElementById('supportForm');
    const inputs = form.querySelectorAll('input, select, textarea');
    
    // Load saved data
    inputs.forEach(input => {
        const savedValue = localStorage.getItem(`contact_${input.name}`);
        if (savedValue) {
            input.value = savedValue;
        }
    });
    
    // Save data on input
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            localStorage.setItem(`contact_${input.name}`, input.value);
        });
    });
    
    // Clear saved data on successful submission
    form.addEventListener('submit', () => {
        inputs.forEach(input => {
            localStorage.removeItem(`contact_${input.name}`);
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize FAQ
    initFAQ();
    
    // Initialize emergency numbers
    initEmergencyNumbers();
    
    // Initialize contact cards
    initContactCards();
    
    // Initialize team members
    initTeamMembers();
    
    // Initialize emergency card effects
    initEmergencyCardEffects();
    
    // Initialize form effects
    initFormEffects();
    
    // Initialize smooth scroll
    initSmoothScroll();
    
    // Initialize emergency animation
    initEmergencyAnimation();
    
    // Initialize form auto-save
    initFormAutoSave();
    
    // Add form event listeners
    document.getElementById('supportForm').addEventListener('submit', handleSupportForm);
    document.getElementById('subscribeForm').addEventListener('submit', handleSubscribeForm);
    
    // Add character counter for message textarea
    const messageTextarea = document.getElementById('message');
    if (messageTextarea) {
        messageTextarea.addEventListener('input', () => {
            const maxLength = 1000;
            const currentLength = messageTextarea.value.length;
            const remaining = maxLength - currentLength;
            
            // Update placeholder or show counter
            if (currentLength > maxLength * 0.8) {
                messageTextarea.style.borderColor = remaining < 0 ? '#e74c3c' : '#f39c12';
            } else {
                messageTextarea.style.borderColor = '#eee';
            }
        });
    }
    
    // Add loading animation for emergency cards
    const emergencyCards = document.querySelectorAll('.emergency-card');
    emergencyCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.style.animation = 'fadeInUp 0.6s ease forwards';
    });
});

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .emergency-card {
        opacity: 0;
    }
    
    .emergency-card.animated {
        opacity: 1;
    }
`;
document.head.appendChild(style);

// Add scroll-triggered animations
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const scrollTop = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        if (scrollTop + windowHeight > sectionTop + sectionHeight * 0.3) {
            section.classList.add('animate');
        }
    });
});
