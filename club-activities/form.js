document.addEventListener('DOMContentLoaded', () => {
    // Get the form element
    const activityForm = document.querySelector('.activity-form');
    
    // Check if we're on the add activity page
    if (activityForm) {
        // Initialize form validation
        initFormValidation();
        
        // Handle button clicks
        setupButtonHandlers();
    }
});

// Initialize form validation
function initFormValidation() {
    // Get form elements
    const titleInput = document.getElementById('title');
    const clubSelect = document.getElementById('club');
    const contentTextarea = document.getElementById('content');
    const datetimeInput = document.getElementById('datetime');
    const imageInput = document.getElementById('image');
    
    // Add input event listeners for real-time validation
    titleInput.addEventListener('input', () => validateField(titleInput, validateTitle));
    clubSelect.addEventListener('change', () => validateField(clubSelect, validateClub));
    contentTextarea.addEventListener('input', () => validateField(contentTextarea, validateContent));
    datetimeInput.addEventListener('input', () => validateField(datetimeInput, validateDateTime));
    imageInput.addEventListener('change', () => validateField(imageInput, validateImage));
}

// Setup button handlers
function setupButtonHandlers() {
    // Add button - validates the form and submits if valid
    const addButton = document.getElementById('add-activity-btn');
    if (addButton) {
        addButton.addEventListener('click', () => {
            if (validateAllFields()) {
                submitForm();
            }
        });
    }
    
}

// Validate all fields and return if valid
function validateAllFields() {
    // Get form elements
    const titleInput = document.getElementById('title');
    const clubSelect = document.getElementById('club');
    const contentTextarea = document.getElementById('content');
    const datetimeInput = document.getElementById('datetime');
    const imageInput = document.getElementById('image');
    
    // Validate all fields
    const isTitleValid = validateField(titleInput, validateTitle);
    const isClubValid = validateField(clubSelect, validateClub);
    const isContentValid = validateField(contentTextarea, validateContent);
    const isDateTimeValid = validateField(datetimeInput, validateDateTime);
    const isImageValid = validateField(imageInput, validateImage);
    
    // Check if all fields are valid
    if (isTitleValid && isClubValid && isContentValid && isDateTimeValid && isImageValid) {
        return true;
    } else {
        // Show error message
        showValidationErrorMessage('Please fix the errors in the form before proceeding.');
        return false;
    }
}

// Submit the form data to the API
async function submitForm() {
    // Get form data
    const form = document.querySelector('.activity-form');
    const formData = new FormData(form);
    
    // Format the datetime value (ISO string)
    const datetime = formData.get('datetime');
    
    // Create data object
    const data = {
        title: formData.get('title'),
        club: formData.get('club'),
        content: formData.get('content'),
        datetime: datetime,
        image_url: 'img/default-activity.jpg' // Default image if none provided
    };
    
    // Show loading message
    showSubmitMessage('Submitting activity...', 'loading');
    
    try {
        // Send the data to the API
        const API_URL = 'https://0e4c4464-608d-4520-af48-62a05630030e-00-1xcy3qajro2rv.pike.replit.dev/club-activities/api.php';
        const response = await fetch(`${API_URL}?action=createActivity`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        // Check if response is OK
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        // Parse response
        const result = await response.json();
        
        if (result.status === 'success') {
            // Show success message
            showSubmitMessage('Activity added successfully!', 'success');
            
            // Reset form
            form.reset();
            
            // Redirect to main page after 2 seconds
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        } else {
            // Show error message
            showSubmitMessage(`Error: ${result.message || 'Unknown error'}`, 'error');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        showSubmitMessage(`Error: ${error.message || 'Failed to connect to server'}`, 'error');
    }
}

// Validate a field using the provided validation function
function validateField(field, validationFn) {
    // Get the validation result
    const result = validationFn(field.value, field);
    
    // Remove any existing error message
    const existingError = field.parentElement.querySelector('.error-message');
    if (existingError) {
        field.parentElement.removeChild(existingError);
    }
    
    // Remove any existing success indicator
    field.classList.remove('valid', 'invalid');
    
    // If the validation failed, add error message and invalid class
    if (!result.valid) {
        // Add error message
        const errorMessage = document.createElement('span');
        errorMessage.className = 'error-message';
        errorMessage.textContent = result.message;
        field.parentElement.appendChild(errorMessage);
        
        // Add invalid class
        field.classList.add('invalid');
        
        return false;
    }
    
    // Add valid class
    field.classList.add('valid');
    
    return true;
}

// Validate title
function validateTitle(value) {
    if (!value.trim()) {
        return { valid: false, message: 'Title is required' };
    }
    
    if (value.trim().length < 3) {
        return { valid: false, message: 'Title must be at least 3 characters long' };
    }
    
    if (value.trim().length > 50) {
        return { valid: false, message: 'Title must be less than 50 characters long' };
    }
    
    return { valid: true };
}

// Validate club
function validateClub(value) {
    if (!value || value === 'Select Club') {
        return { valid: false, message: 'Please select a club' };
    }
    
    return { valid: true };
}

// Validate content
function validateContent(value) {
    if (!value.trim()) {
        return { valid: false, message: 'Content is required' };
    }
    
    if (value.trim().length < 10) {
        return { valid: false, message: 'Content must be at least 10 characters long' };
    }
    
    if (value.trim().length > 500) {
        return { valid: false, message: 'Content must be less than 500 characters long' };
    }
    
    return { valid: true };
}

// Validate date and time
function validateDateTime(value) {
    if (!value) {
        return { valid: false, message: 'Date and time are required' };
    }
    
    const selectedDate = new Date(value);
    const today = new Date();
    
    if (selectedDate < today) {
        return { valid: false, message: 'Date and time must be in the future' };
    }
    
    return { valid: true };
}

// Validate image
function validateImage(value, field) {
    // Image is optional, so if no file is selected, it's valid
    if (!field.files || field.files.length === 0) {
        return { valid: true };
    }
    
    const file = field.files[0];
    
    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        return { valid: false, message: 'Only JPEG, PNG, GIF, and WebP images are allowed' };
    }
    
    // Check file size (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > maxSize) {
        return { valid: false, message: 'Image size must be less than 2MB' };
    }
    
    return { valid: true };
}

// Format date and time for display
function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    
    // Format date
    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDate();
    const year = date.getFullYear();
    
    // Format time
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    // Convert hours to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // Handle midnight (0 hours)
    
    return `${month} ${day}, ${year} – ${hours}:${minutes} ${ampm}`;
}

// Show submission message (success, error, or loading)
function showSubmitMessage(message, type) {
    // Remove existing submission status
    const existingStatus = document.querySelector('.form-submission-status');
    if (existingStatus) {
        existingStatus.parentElement.removeChild(existingStatus);
    }
    
    const statusContainer = document.createElement('div');
    statusContainer.className = `form-submission-status ${type}`;
    statusContainer.innerHTML = `<span>${message}</span>`;
    
    if (type === 'loading') {
        statusContainer.innerHTML += '<div class="loading-spinner"></div>';
    }
    
    const formButtons = document.querySelector('.form-buttons');
    formButtons.parentElement.insertBefore(statusContainer, formButtons);
    
    // Auto-remove after 3 seconds if success or error
    if (type === 'success' || type === 'error') {
        setTimeout(() => {
            if (document.body.contains(statusContainer)) {
                statusContainer.parentElement.removeChild(statusContainer);
            }
        }, 3000);
    }
}

// Show validation error message
function showValidationErrorMessage(message) {
    // Remove existing validation error message
    const existingError = document.querySelector('.form-validation-error');
    if (existingError) {
        existingError.parentElement.removeChild(existingError);
    }
    
    const errorContainer = document.createElement('div');
    errorContainer.className = 'form-validation-error';
    errorContainer.textContent = message;
    
    const formButtons = document.querySelector('.form-buttons');
    formButtons.parentElement.insertBefore(errorContainer, formButtons);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (document.body.contains(errorContainer)) {
            errorContainer.parentElement.removeChild(errorContainer);
        }
    }, 5000);
}