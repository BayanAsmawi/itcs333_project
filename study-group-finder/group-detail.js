document.addEventListener('DOMContentLoaded', () => {
    const deleteButton = document.getElementById('delete-button');
    const commentForm = document.getElementById('commentForm');
    const commentsListDiv = document.getElementById('comments-list');
    const commentCountSpan = document.getElementById('comment-count');
    const commentErrorSpan = document.getElementById('commentError');
    
    // API URLs (assuming group-detail.php is in study-group-finder, backend is one level up)
    const MANAGE_GROUP_API_URL = '../backend/studygroups-api/manage_study_group.php'; // For DELETE
    const COMMENTS_API_URL = '../backend/studygroups-api/manage_comments.php';

    // currentGroupId and isLoggedIn are now passed from PHP script block
    // const urlParams = new URLSearchParams(window.location.search);
    // const groupIdFromUrl = urlParams.get('id');
    // const groupId = currentGroupId || groupIdFromUrl; // Prefer PHP-passed ID

    if (!currentGroupId) {
        if (commentsListDiv) commentsListDiv.innerHTML = '<p>Error: Group ID not available for comments.</p>';
        // The main group details error is handled by PHP
        return;
    }

    async function fetchComments() {
        if (!commentsListDiv) return;
        commentsListDiv.innerHTML = '<p class="loading-comments">Loading comments...</p>';
        try {
            const response = await fetch(`${COMMENTS_API_URL}?group_id=${currentGroupId}`);
            if (!response.ok) {
                const errorResult = await response.json().catch(() => ({ error: "Failed to fetch comments." }));
                throw new Error(errorResult.error || 'Failed to fetch comments.');
            }
            const result = await response.json();
            if (result.status === 'success' && result.comments) {
                renderComments(result.comments);
            } else {
                throw new Error(result.error || 'Could not load comments.');
            }
        } catch (error) {
            console.error('Fetch Comments Error:', error);
            commentsListDiv.innerHTML = `<p style="color:red;">Error loading comments: ${error.message}</p>`;
            if (commentCountSpan) commentCountSpan.textContent = '0';
        }
    }

    function renderComments(comments) {
        if (!commentsListDiv) return;
        if (commentCountSpan) commentCountSpan.textContent = comments.length;

        if (comments.length === 0) {
            commentsListDiv.innerHTML = '<p>No comments yet. Be the first to comment!</p>';
            return;
        }
        commentsListDiv.innerHTML = comments.map(comment => {
            // Format date nicely (optional)
            let formattedDate = 'just now';
            try {
                 formattedDate = new Date(comment.created_at).toLocaleString(undefined, { 
                    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                });
            } catch(e) { /* use default if parsing fails */ }

            return `
                <article class="comment-item" id="comment-${comment.comment_id}">
                    <p><strong>${htmlspecialchars(comment.user_full_name || 'Anonymous')}:</strong></p>
                    <p>${nl2br(htmlspecialchars(comment.comment_text || ''))}</p>
                    <small>Posted on: ${formattedDate}</small>
                </article>
            `;
        }).join('');
    }

    // Helper to prevent XSS, similar to PHP's htmlspecialchars
    function htmlspecialchars(str) {
        if (typeof str !== 'string') return '';
        return str.replace(/[&<>"']/g, function (match) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;' // Or &apos;
            }[match];
        });
    }
    // Helper to mimic PHP's nl2br for displaying line breaks
    function nl2br(str) {
        if (typeof str !== 'string') return '';
        return str.replace(/\r\n|\r|\n/g, '<br>');
    }


    // Post a new comment
    if (commentForm && isLoggedIn) { // Only add listener if form exists and user is logged in
        commentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const commentTextInput = document.getElementById('comment_text');
            const commentText = commentTextInput.value.trim();
            const groupIdForComment = document.getElementById('comment_group_id').value;
            const submitButton = commentForm.querySelector('button[type="submit"]');

            if (!commentText) {
                if(commentErrorSpan) {
                    commentErrorSpan.textContent = 'Comment cannot be empty.';
                    commentErrorSpan.style.display = 'block';
                }
                return;
            }
            if(commentErrorSpan) commentErrorSpan.style.display = 'none';


            submitButton.disabled = true;
            submitButton.textContent = 'Posting...';

            try {
                const response = await fetch(COMMENTS_API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        group_id: groupIdForComment,
                        comment_text: commentText
                    })
                });
                const result = await response.json();

                if (response.ok && result.status === 'success' && result.comment) {
                    commentTextInput.value = ''; // Clear textarea
                    // Add the new comment to the top or bottom of the list dynamically
                    const newCommentElement = document.createElement('article');
                    newCommentElement.classList.add('comment-item');
                    newCommentElement.id = `comment-${result.comment.comment_id}`;
                    let formattedDate = 'just now';
                    try {
                        formattedDate = new Date(result.comment.created_at).toLocaleString(undefined, { 
                            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                        });
                    } catch(e) { /* use default */ }

                    newCommentElement.innerHTML = `
                        <p><strong>${htmlspecialchars(result.comment.user_full_name || 'You')}:</strong></p>
                        <p>${nl2br(htmlspecialchars(result.comment.comment_text || ''))}</p>
                        <small>Posted on: ${formattedDate}</small>
                    `;
                    // If "No comments yet" message is present, remove it
                    const noCommentsMsg = commentsListDiv.querySelector('p');
                    if (noCommentsMsg && noCommentsMsg.textContent.includes('No comments yet')) {
                        commentsListDiv.innerHTML = '';
                    }
                    commentsListDiv.appendChild(newCommentElement); // Add to bottom, or prependChild for top
                    if (commentCountSpan) commentCountSpan.textContent = parseInt(commentCountSpan.textContent) + 1;

                } else {
                    throw new Error(result.error || 'Failed to post comment.');
                }
            } catch (error) {
                console.error('Post Comment Error:', error);
                if(commentErrorSpan) {
                    commentErrorSpan.textContent = error.message;
                    commentErrorSpan.style.display = 'block';
                } else {
                    alert(`Error: ${error.message}`);
                }
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = 'Post Comment';
            }
        });
    }


    // Delete button functionality (from previous step, ensure it's still relevant)
    if (deleteButton) {
        deleteButton.addEventListener('click', async () => {
            const groupIdForDelete = deleteButton.dataset.groupid;
            if (!groupIdForDelete) {
                alert('Error: Group ID for deletion is missing.');
                return;
            }
            if (confirm('Are you sure you want to delete this study group? This action cannot be undone.')) {
                try {
                    const response = await fetch(`${MANAGE_GROUP_API_URL}?id=${groupIdForDelete}`, {
                        method: 'DELETE'
                    });
                    const result = await response.json();
                    if (response.ok && result.status === 'success') {
                        alert(result.message || 'Study group deleted successfully.');
                        window.location.href = 'index.php'; 
                    } else {
                        throw new Error(result.error || 'Failed to delete study group.');
                    }
                } catch (error) {
                    console.error('Delete Error:', error);
                    alert(`Error: ${error.message}`);
                }
            }
        });
    }

    // Initial fetch of comments if a group is loaded
    if (currentGroupId) {
        fetchComments();
    }
});
