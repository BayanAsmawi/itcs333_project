// formValidation.js - Form validation for adding club activities
document.addEventListener('DOMContentLoaded', () => {
    // Get the form element
    const activityForm = document.querySelector('.activity-form');
    
    // Check if we're on the add activity page
    if (activityForm) {
        // Initialize form validation
        initFormValidation();
        
        // Handle form submission
        activityForm.addEventListener('submit', handleFormSubmit);
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
    
    // Fix cancel button
    const cancelButton = document.querySelector('.form-buttons a');
    if (cancelButton) {
        cancelButton.parentElement.innerHTML = '<a href="index.html" class="cancel-btn">Cancel</a>';
    }
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
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
        // Show loading state
        showSubmitLoading(true);
        
        // Get current timestamp for id
        const newId = Date.now();
        
        // Create a mock image path based on club if no image is provided
        let imagePath = null;
        if (imageInput.files.length) {
            // In a real app, we would upload the file to a server
            // For now, we'll use a data URL, but this won't persist between page loads
            const reader = new FileReader();
            reader.onload = function(e) {
                const activities = JSON.parse(localStorage.getItem('campusHubActivities') || '[]');
                // Find and update the activity we just added with the image data
                const activityIndex = activities.findIndex(a => a.id === newId);
                if (activityIndex >= 0) {
                    activities[activityIndex].image = e.target.result;
                    localStorage.setItem('campusHubActivities', JSON.stringify(activities));
                }
            };
            reader.readAsDataURL(imageInput.files[0]);
        } else {
            // Use default image based on club
            const imageMap = {
                'Art Club': 'img/art-club.jpg',
                'Astrology Club': 'img/astorology-club.jpg',
                'Book Club': 'img/book-club.jpg',
                'Movie Club': 'img/movie-club.jpg',
                'Music Club': 'img/music-club.jpg',
                'Robotics Club': 'img/rocotics-club.jpg',
                'Sports Club': 'img/sports-club.jpg'
            };
            imagePath = imageMap[clubSelect.value] || 'img/placeholder.jpg';
        }
        
        // Create new activity object
        const newActivity = {
            id: newId,
            title: titleInput.value,
            club: clubSelect.value,
            content: contentTextarea.value,
            dateTime: formatDateTime(datetimeInput.value),
            image: imagePath
        };
        
        // Store in localStorage
        const activities = JSON.parse(localStorage.getItem('campusHubActivities') || '[]');
        activities.push(newActivity);
        localStorage.setItem('campusHubActivities', JSON.stringify(activities));
        
        // Hide loading state
        showSubmitLoading(false);
        
        // Show success message
        showSubmitSuccess('Activity added successfully!');
        
        // Reset form
        e.target.reset();
        
        // Alert user before redirecting
        alert('Activity successfully created! Redirecting to the activities page.');
        
        // Redirect immediately to index page
        window.location.href = 'index.html';
    } else {
        // Show error message
        showValidationErrorMessage('Please fix the errors in the form before submitting.');
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

// Show loading state during form submission
function showSubmitLoading(isLoading) {
    // Remove existing submission status
    const existingStatus = document.querySelector('.form-submission-status');
    if (existingStatus) {
        existingStatus.parentElement.removeChild(existingStatus);
    }
    
    if (isLoading) {
        const statusContainer = document.createElement('div');
        statusContainer.className = 'form-submission-status loading';
        statusContainer.innerHTML = '<div class="loader"></div><span>Submitting...</span>';
        
        const formButtons = document.querySelector('.form-buttons');
        formButtons.parentElement.insertBefore(statusContainer, formButtons);
    }
}

// Show success message after form submission
function showSubmitSuccess(message) {
    // Remove existing submission status
    const existingStatus = document.querySelector('.form-submission-status');
    if (existingStatus) {
        existingStatus.parentElement.removeChild(existingStatus);
    }
    
    const statusContainer = document.createElement('div');
    statusContainer.className = 'form-submission-status success';
    statusContainer.innerHTML = `<span>${message}</span>`;
    
    const formButtons = document.querySelector('.form-buttons');
    formButtons.parentElement.insertBefore(statusContainer, formButtons);
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