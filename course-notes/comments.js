// format date for display function
function formatDate() {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const date = new Date();
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

// Function to create a comment element
function createCommentElement(comment) {
  const commentDiv = document.createElement("div");
  commentDiv.className = "comment";

  // Generate a random date in the past month
  const randomDay = Math.floor(Math.random() * 30) + 1;
  const date = new Date();
  date.setDate(date.getDate() - randomDay);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const formattedDate = `${
    months[date.getMonth()]
  } ${date.getDate()}, ${date.getFullYear()}`;

  // Use the provided name or extract from email if it's from the API
  const commenterName =
    comment.name || comment.email?.split("@")[0] || "Anonymous";

  commentDiv.innerHTML = `
        <div class="comment-header">
            <div class="commenter-name">${commenterName}</div>
            <div class="comment-date">${formattedDate}</div>
        </div>
        <div class="comment-text">
            ${comment.body}
        </div>
    `;

  return commentDiv;
}

// fetch comments from the API
async function fetchComments() {
  try {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/comments"
    );

    if (!response.ok) {
      throw new Error("Failed to fetch comments");
    }

    const comments = await response.json();
    const commentsContainer = document.getElementById("api-comments");
    const loadingIndicator = document.getElementById("loading");

    // Hide loading indicator
    loadingIndicator.style.display = "none";

    // Display only first 10 comments to avoid overwhelming the page
    const displayComments = comments.slice(0, 10);

    displayComments.forEach((comment) => {
      commentsContainer.appendChild(createCommentElement(comment));
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    const loadingIndicator = document.getElementById("loading");
    loadingIndicator.style.display = "none";

    const errorDiv = document.createElement("div");
    errorDiv.className = "error";
    errorDiv.textContent = "Failed to load comments. Please try again later.";
    document.getElementById("api-comments").appendChild(errorDiv);
  }
}

// Handle comment form submission
document
  .querySelector(".comment-form button")
  .addEventListener("click", function (e) {
    e.preventDefault(); // Prevent form submission

    const usernameInput = document.getElementById("username");
    const commentTextarea = document.querySelector(".comment-form textarea");

    const username = usernameInput.value.trim();
    const commentText = commentTextarea.value.trim();

    if (commentText) {
      const newComment = {
        name: username || "Anonymous",
        body: commentText,
      };

      // Add the new comment to the top of the list
      const commentsContainer = document.getElementById("api-comments");
      commentsContainer.insertBefore(
        createCommentElement(newComment),
        commentsContainer.firstChild
      );

      // Clear the form inputs
      usernameInput.value = "";
      commentTextarea.value = "";
    }
  });

// fetch comments when the page loads
document.addEventListener("DOMContentLoaded", fetchComments);
