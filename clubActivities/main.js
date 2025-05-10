// main.js - Main JavaScript file for Campus Hub
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the application
    initApp();
});

// Global variables
let allActivities = [];
let currentPage = 1;
const activitiesPerPage = 6;
let currentFilter = 'All Clubs';
let currentSort = 'Newest';

// Initialize the application
async function initApp() {
    // Setup event listeners
    setupEventListeners();
    
    // Show loading state
    showLoading(true);
    
    try {
        // Check for locally stored activities
        const localActivities = JSON.parse(localStorage.getItem('campusHubActivities') || '[]');
        
        // Fetch club activities data from API
        const fetchedActivities = await fetchActivities();
        
        // Combine local and fetched activities
        allActivities = [...localActivities, ...fetchedActivities];
        
        // Render activities
        renderActivities();
        
        // Initialize pagination
        initPagination();
    } catch (error) {
        showError('Failed to load activities. Please try again later.');
        console.error('Error initializing app:', error);
    } finally {
        // Hide loading state
        showLoading(false);
    }
}

// Setup event listeners
function setupEventListeners() {
    // Club filter
    const clubList = document.querySelector('.all-clubs-container ul');
    if (clubList) {
        clubList.addEventListener('click', (e) => {
            if (e.target.tagName === 'LI') {
                // Remove active class from all items
                clubList.querySelectorAll('li').forEach(li => li.classList.remove('active'));
                
                // Add active class to clicked item
                e.target.classList.add('active');
                
                // Set filter
                currentFilter = e.target.textContent;
                currentPage = 1;
                
                // Filter and render activities
                renderActivities();
                initPagination();
            }
        });
    }
    
    // View/Sort selector
    const viewSelect = document.getElementById('view');
    if (viewSelect) {
        viewSelect.addEventListener('change', () => {
            currentSort = viewSelect.value;
            currentPage = 1;
            renderActivities();
            initPagination();
        });
    }
    
    // Search functionality
    const searchInput = document.getElementById('search');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(() => {
            currentPage = 1;
            renderActivities();
            initPagination();
        }, 300));
    }
}

// Fetch activities from API
async function fetchActivities() {
    try {
        // Use JSONPlaceholder as a mock API
        const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=20');
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const posts = await response.json();
        
        // Transform the data to match our activities format
        return posts.map(post => {
            // Generate random club
            const clubs = ['Art Club', 'Astrology Club', 'Book Club', 'Movie Club', 'Music Club', 'Robotics Club', 'Sports Club'];
            const randomClub = clubs[Math.floor(Math.random() * clubs.length)];
            
            // Generate random date within next month
            const today = new Date();
            const futureDate = new Date(today);
            futureDate.setDate(today.getDate() + Math.floor(Math.random() * 30) + 1);
            
            // Generate random time
            const hours = Math.floor(Math.random() * 12) + 1;
            const minutes = Math.random() > 0.5 ? '00' : '30';
            const ampm = Math.random() > 0.5 ? 'AM' : 'PM';
            
            // Format date
            const month = futureDate.toLocaleString('default', { month: 'short' });
            const date = futureDate.getDate();
            const year = futureDate.getFullYear();
            
            // Get a relevant image based on club type
            const imageMap = {
                'Art Club': 'img/art-club.jpg',
                'Astrology Club': 'img/astorology-club.jpg',
                'Book Club': 'img/book-club.jpg',
                'Movie Club': 'img/movie-club.jpg',
                'Music Club': 'img/music-club.jpg',
                'Robotics Club': 'img/rocotics-club.jpg',
                'Sports Club': 'img/sports-club.jpg'
            };
            
            return {
                id: post.id,
                title: post.title.split(' ').slice(0, 3).join(' '),
                club: randomClub,
                content: post.body.split('.')[0],
                image: imageMap[randomClub] || 'img/placeholder.jpg',
                dateTime: `${month} ${date}, ${year} – ${hours}:${minutes} ${ampm}`
            };
        });
    } catch (error) {
        console.error('Error fetching activities:', error);
        throw error;
    }
}

// Render activities based on current filter, sort, and search criteria
function renderActivities() {
    const container = document.querySelector('.club-activities-container');
    const searchInput = document.getElementById('search');
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    
    // Remove existing activities, keeping pagination
    const pagination = container.querySelector('.pagination');
    container.innerHTML = '';
    if (pagination) {
        container.appendChild(pagination);
    }
    
    // Filter activities
    let filteredActivities = allActivities;
    
    // Filter by club
    if (currentFilter !== 'All Clubs') {
        filteredActivities = filteredActivities.filter(activity => activity.club === currentFilter);
    }
    
    // Filter by search term
    if (searchTerm) {
        filteredActivities = filteredActivities.filter(activity => 
            activity.title.toLowerCase().includes(searchTerm) || 
            activity.content.toLowerCase().includes(searchTerm) ||
            activity.club.toLowerCase().includes(searchTerm)
        );
    }
    
    // Sort activities
    filteredActivities = sortActivities(filteredActivities, currentSort);
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * activitiesPerPage;
    const endIndex = startIndex + activitiesPerPage;
    const activitiesToShow = filteredActivities.slice(startIndex, endIndex);
    
    // Show message if no activities found
    if (activitiesToShow.length === 0) {
        const noActivities = document.createElement('div');
        noActivities.className = 'no-activities';
        noActivities.textContent = 'No activities found matching your criteria.';
        container.insertBefore(noActivities, pagination);
        return;
    }
    
    // Create and append activity boxes
    activitiesToShow.forEach(activity => {
        const box = createActivityBox(activity);
        container.insertBefore(box, pagination);
    });
}

// Create an activity box element
function createActivityBox(activity) {
    const box = document.createElement('div');
    box.className = 'box';
    box.dataset.id = activity.id;
    
    box.innerHTML = `
        <div class="box-header">
            <h6>${activity.title}</h6>
            <p>${activity.club}</p>
        </div>
        <p>${activity.content}</p>
        <img src="${activity.image}" alt="${activity.title}">
        <p>${activity.dateTime}</p>
        <button class="comments-btn">Comments</button>
    `;
    
    // Add click event to show activity details
    box.addEventListener('click', (e) => {
        if (!e.target.classList.contains('comments-btn')) {
            showActivityDetails(activity);
        }
    });
    
    // Add click event for comments button
    const commentsBtn = box.querySelector('.comments-btn');
    commentsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showComments(activity.id);
    });
    
    return box;
}

// Show activity details
function showActivityDetails(activity) {
    // Create modal for activity details
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <div class="activity-details">
                <h2>${activity.title}</h2>
                <p class="club-name">${activity.club}</p>
                <img src="${activity.image}" alt="${activity.title}">
                <p class="activity-description">${activity.content}</p>
                <p class="activity-datetime">${activity.dateTime}</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal when clicking on close button or outside the modal
    const closeBtn = modal.querySelector('.close');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    // Prevent scrolling when modal is open
    document.body.style.overflow = 'hidden';
    
    // Reset scrolling when modal is closed
    modal.addEventListener('transitionend', () => {
        if (!document.body.contains(modal)) {
            document.body.style.overflow = '';
        }
    });
}

// Show comments for an activity
function showComments(activityId) {
    // Fetch comments from API
    fetch(`https://jsonplaceholder.typicode.com/posts/${activityId}/comments`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(comments => {
            // Create modal for comments
            const modal = document.createElement('div');
            modal.className = 'modal';
            
            let commentsHTML = comments.map(comment => `
                <div class="comment">
                    <h4>${comment.name}</h4>
                    <p class="comment-email">${comment.email}</p>
                    <p>${comment.body}</p>
                </div>
            `).join('');
            
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <div class="comments-container">
                        <h2>Comments</h2>
                        ${commentsHTML}
                        <form class="add-comment-form">
                            <h3>Add a Comment</h3>
                            <input type="text" placeholder="Name" required>
                            <input type="email" placeholder="Email" required>
                            <textarea placeholder="Your comment" required></textarea>
                            <button type="submit">Submit</button>
                        </form>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Close modal when clicking on close button or outside the modal
            const closeBtn = modal.querySelector('.close');
            closeBtn.addEventListener('click', () => {
                document.body.removeChild(modal);
            });
            
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    document.body.removeChild(modal);
                }
            });
            
            // Handle comment form submission
            const commentForm = modal.querySelector('.add-comment-form');
            commentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const nameInput = commentForm.querySelector('input[type="text"]');
                const emailInput = commentForm.querySelector('input[type="email"]');
                const commentInput = commentForm.querySelector('textarea');
                
                // Validate form
                if (!nameInput.value.trim() || !emailInput.value.trim() || !commentInput.value.trim()) {
                    alert('Please fill out all fields');
                    return;
                }
                
                // Simulate adding a comment
                const newComment = document.createElement('div');
                newComment.className = 'comment';
                newComment.innerHTML = `
                    <h4>${nameInput.value}</h4>
                    <p class="comment-email">${emailInput.value}</p>
                    <p>${commentInput.value}</p>
                `;
                
                // Add new comment to the top
                const commentsContainer = modal.querySelector('.comments-container');
                commentsContainer.insertBefore(newComment, commentsContainer.children[1]);
                
                // Reset form
                commentForm.reset();
            });
            
            // Prevent scrolling when modal is open
            document.body.style.overflow = 'hidden';
            
            // Reset scrolling when modal is closed
            modal.addEventListener('transitionend', () => {
                if (!document.body.contains(modal)) {
                    document.body.style.overflow = '';
                }
            });
        })
        .catch(error => {
            console.error('Error fetching comments:', error);
            showError('Failed to load comments. Please try again later.');
        });
}

// Initialize pagination
function initPagination() {
    const container = document.querySelector('.club-activities-container');
    let pagination = container.querySelector('.pagination');
    
    // If pagination doesn't exist, create it
    if (!pagination) {
        pagination = document.createElement('div');
        pagination.className = 'pagination';
        container.appendChild(pagination);
    } else {
        // Clear existing pagination buttons
        pagination.innerHTML = '';
    }
    
    // Filter activities based on current criteria
    let filteredActivities = allActivities;
    
    // Filter by club
    if (currentFilter !== 'All Clubs') {
        filteredActivities = filteredActivities.filter(activity => activity.club === currentFilter);
    }
    
    // Filter by search term
    const searchInput = document.getElementById('search');
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    if (searchTerm) {
        filteredActivities = filteredActivities.filter(activity => 
            activity.title.toLowerCase().includes(searchTerm) || 
            activity.content.toLowerCase().includes(searchTerm) ||
            activity.club.toLowerCase().includes(searchTerm)
        );
    }
    
    // Calculate total pages
    const totalPages = Math.ceil(filteredActivities.length / activitiesPerPage);
    
    // Create previous button
    const prevBtn = document.createElement('button');
    prevBtn.className = 'page-btn';
    prevBtn.textContent = '« Prev';
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderActivities();
            initPagination();
        }
    });
    pagination.appendChild(prevBtn);
    
    // Create page number buttons
    const maxPageButtons = 3;
    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxPageButtons) {
        startPage = Math.max(1, endPage - maxPageButtons + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = 'page-btn';
        pageBtn.textContent = i;
        if (i === currentPage) {
            pageBtn.classList.add('active');
        }
        pageBtn.addEventListener('click', () => {
            currentPage = i;
            renderActivities();
            initPagination();
        });
        pagination.appendChild(pageBtn);
    }
    
    // Create next button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'page-btn';
    nextBtn.textContent = 'Next »';
    nextBtn.disabled = currentPage === totalPages || totalPages === 0;
    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderActivities();
            initPagination();
        }
    });
    pagination.appendChild(nextBtn);
}

// Sort activities based on selected option
function sortActivities(activities, sortOption) {
    switch (sortOption) {
        case 'Newest':
            // Sort by date (newest first)
            return [...activities].sort((a, b) => {
                const dateA = new Date(a.dateTime.split('–')[0].trim());
                const dateB = new Date(b.dateTime.split('–')[0].trim());
                return dateB - dateA;
            });
        case 'Oldest':
            // Sort by date (oldest first)
            return [...activities].sort((a, b) => {
                const dateA = new Date(a.dateTime.split('–')[0].trim());
                const dateB = new Date(b.dateTime.split('–')[0].trim());
                return dateA - dateB;
            });
        default:
            return activities;
    }
}

// Show loading state
function showLoading(isLoading) {
    // Remove existing loader if any
    const existingLoader = document.querySelector('.loader-container');
    if (existingLoader) {
        document.body.removeChild(existingLoader);
    }
    
    if (isLoading) {
        const loaderContainer = document.createElement('div');
        loaderContainer.className = 'loader-container';
        loaderContainer.innerHTML = '<div class="loader"></div>';
        document.body.appendChild(loaderContainer);
    }
}

// Show error message
function showError(message) {
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-container';
    errorContainer.textContent = message;
    
    document.body.appendChild(errorContainer);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (document.body.contains(errorContainer)) {
            document.body.removeChild(errorContainer);
        }
    }, 5000);
}

// Debounce function to limit how often a function can be called
function debounce(func, delay) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
}