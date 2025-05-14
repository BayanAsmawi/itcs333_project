const API_URL = 'https://0e4c4464-608d-4520-af48-62a05630030e-00-1xcy3qajro2rv.pike.replit.dev/club-activities/api.php';

// State variables
let currentLimit = 6; 
let currentSearch = '';
let currentClub = 'All Clubs';
let currentSort = 'Newest';

/**
 * Fetch activities from the API
 */
async function fetchActivities() {
    try {
        // Build URL with parameters
        const params = new URLSearchParams();
        params.append('action', 'getActivities');
        
        if (currentSearch) params.append('search', currentSearch);
        if (currentClub !== 'All Clubs') params.append('club', currentClub);
        params.append('sort', currentSort.toLowerCase());
        params.append('page', currentPage);
        params.append('limit', currentLimit);
        
        const url = `${API_URL}?${params.toString()}`;
        console.log(`Fetching from API: ${url}`);
        
        // Show loading message or indicator (using your existing styles)
        const loadingMessage = document.createElement('div');
        loadingMessage.className = 'loading-message';
        loadingMessage.textContent = 'Loading activities...';
        document.querySelector('.club-activities-container').appendChild(loadingMessage);
        
        // Fetch data
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        
        // Remove loading message
        loadingMessage.remove();
        
        if (data.status === 'success') {
            console.log('API Response:', data);
            displayActivities(data.data);
            updatePagination(data.meta);
        } else {
            alert(data.message || 'An error occurred');
        }
    } catch (error) {
        console.error('Error fetching activities:', error);
        alert('Failed to load activities. Please try again later.');
    }
}

function displayActivities(activities) {
    // Get the container
    const container = document.querySelector('.club-activities-container');
    
    // Clear existing activities (except pagination)
    const boxes = container.querySelectorAll('.box');
    boxes.forEach(box => box.remove());
    
    // Check if no activities found
    if (activities.length === 0) {
        const noActivitiesEl = document.createElement('div');
        noActivitiesEl.className = 'no-activities';
        noActivitiesEl.innerHTML = '<h3>No activities found</h3><p>Try a different search term or filter.</p>';
        container.appendChild(noActivitiesEl);
        return;
    }
    
    // Create activity boxes using your existing HTML structure
    activities.forEach(activity => {
        const box = document.createElement('div');
        box.className = 'box';
        
        // Format the date
        const activityDate = new Date(activity.datetime);
        const formattedDate = activityDate.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
        
        box.innerHTML = `
            <div class="box-header">
                <h6>${escapeHtml(activity.title)}</h6>
                <p>${escapeHtml(activity.club)}</p>
            </div>
            <p>${escapeHtml(activity.content)}</p>
            <img src="${escapeHtml(activity.image_url)}" alt="${escapeHtml(activity.title)}" />
            <p>${formattedDate}</p>
            <button class="comments-btn" data-id="${activity.id}">Comments</button>
        `;
        
        // Add to container (before pagination if it exists)
        const pagination = container.querySelector('.pagination');
        if (pagination) {
            container.insertBefore(box, pagination);
        } else {
            container.appendChild(box);
        }
        
        // Add event listener for comments button
        const commentsBtn = box.querySelector('.comments-btn');
        commentsBtn.addEventListener('click', () => showComments(activity.id));
    });
}

function updatePagination(meta) {
    // Remove existing pagination
    const existingPagination = document.querySelector('.pagination');
    if (existingPagination) {
        existingPagination.remove();
    }
    
    // Create pagination container
    const pagination = document.createElement('div');
    pagination.className = 'pagination';
    
    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.className = 'page-btn';
    prevBtn.disabled = meta.page <= 1;
    prevBtn.textContent = '« Prev';
    prevBtn.addEventListener('click', () => {
        if (meta.page > 1) {
            currentPage--;
            fetchActivities();
        }
    });
    pagination.appendChild(prevBtn);
    
    // Page numbers
    for (let i = 1; i <= meta.totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = 'page-btn';
        if (i === meta.page) {
            pageBtn.classList.add('active');
        }
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', () => {
            currentPage = i;
            fetchActivities();
        });
        pagination.appendChild(pageBtn);
    }
    
    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'page-btn';
    nextBtn.disabled = meta.page >= meta.totalPages;
    nextBtn.textContent = 'Next »';
    nextBtn.addEventListener('click', () => {
        if (meta.page < meta.totalPages) {
            currentPage++;
            fetchActivities();
        }
    });
    pagination.appendChild(nextBtn);
    
    // Add pagination to container
    document.querySelector('.club-activities-container').appendChild(pagination);
}

async function showComments(activityId) {
    try {
        // Fetch activity with comments
        const url = `${API_URL}?action=getActivity&id=${activityId}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        
        if (data.status !== 'success') {
            throw new Error(data.message || 'Failed to load comments');
        }
        
        const activity = data.data;
        const comments = activity.comments || [];
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Comments for "${escapeHtml(activity.title)}"</h2>
                <div class="comments-list">
                    ${comments.length > 0 ? comments.map(comment => `
                        <div class="comment">
                            <div class="comment-header">
                                <strong>${escapeHtml(comment.name)}</strong>
                                <span>${new Date(comment.created_at).toLocaleString()}</span>
                            </div>
                            <p>${escapeHtml(comment.comment)}</p>
                        </div>
                    `).join('') : '<p>No comments yet. Be the first to comment!</p>'}
                </div>
                <form class="comment-form">
                    <h3>Add a Comment</h3>
                    <div class="form-group">
                        <label for="name">Your Name</label>
                        <input type="text" id="name" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="comment">Your Comment</label>
                        <textarea id="comment" name="comment" rows="3" required></textarea>
                    </div>
                    <button type="submit">Submit</button>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal when clicking the 'x'
        const closeBtn = modal.querySelector('.close');
        closeBtn.addEventListener('click', () => {
            modal.remove();
        });
        
        // Close modal when clicking outside
        modal.addEventListener('click', event => {
            if (event.target === modal) {
                modal.remove();
            }
        });
        
        // Handle comment submission
        const commentForm = modal.querySelector('.comment-form');
        commentForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            const formData = new FormData(commentForm);
            const commentData = {
                activity_id: activityId,
                name: formData.get('name'),
                comment: formData.get('comment')
            };
            
            try {
                const response = await fetch(`${API_URL}?action=addComment`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(commentData)
                });
                
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                
                const data = await response.json();
                
                if (data.status === 'success') {
                    // Close the current modal and reopen with updated comments
                    modal.remove();
                    showComments(activityId);
                } else {
                    alert(data.message || 'Failed to add comment');
                }
            } catch (error) {
                console.error('Error adding comment:', error);
                alert('Failed to add comment. Please try again later.');
            }
        });
    } catch (error) {
        console.error('Error loading comments:', error);
        alert('Failed to load comments. Please try again later.');
    }
}


function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe
        .toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function initApp() {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    currentSearch = urlParams.get('search') || '';
    currentClub = urlParams.get('club') || 'All Clubs';
    currentSort = urlParams.get('sort') || 'Newest';
    currentPage = parseInt(urlParams.get('page')) || 1;
    
    // Set initial form values
    const searchInput = document.getElementById('search');
    if (searchInput) {
        searchInput.value = currentSearch;
        // Add event listener for search input (with debounce)
        searchInput.addEventListener('input', debounce(() => {
            currentSearch = searchInput.value.trim();
            currentPage = 1;
            fetchActivities();
        }, 500));
    }
    
    // Set up view select
    const viewSelect = document.getElementById('view');
    if (viewSelect) {
        viewSelect.value = currentSort;
        viewSelect.addEventListener('change', () => {
            currentSort = viewSelect.value;
            currentPage = 1;
            fetchActivities();
        });
    }
    
    // Set up club selection
    const clubsMenu = document.querySelector('.all-clubs-container ul');
    if (clubsMenu) {
        const clubItems = clubsMenu.querySelectorAll('li');
        clubItems.forEach(item => {
            item.classList.toggle('active', item.textContent === currentClub);
            
            item.addEventListener('click', () => {
                clubItems.forEach(c => c.classList.remove('active'));
                item.classList.add('active');
                
                currentClub = item.textContent;
                currentPage = 1;
                fetchActivities();
            });
        });
    }
    
    // Fetch initial data
    fetchActivities();
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);