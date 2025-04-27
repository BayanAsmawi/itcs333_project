document.addEventListener('DOMContentLoaded', function () {
  // STARS RATING
  const stars = document.querySelectorAll('.StarsPosition .star');
  let currentRating = 0;
  let selectedRating = 0;

  const comments = []; // مصفوفة لتخزين التعليقات
  let currentPage = 1;
  const commentsPerPage = 5; // عدد التعليقات لكل صفحة

  stars.forEach(star => {
    star.addEventListener('mouseover', () => {
      const index = parseInt(star.getAttribute('data-index'));
      highlightStars(index);
    });

    star.addEventListener('mouseout', () => {
      highlightStars(currentRating);
    });

    star.addEventListener('click', () => {
      currentRating = parseInt(star.getAttribute('data-index'));
      selectedRating = currentRating;
      updateStars();
      updateRatingDisplay();
    });
  });

  function highlightStars(index) {
    stars.forEach(star => {
      const starIndex = parseInt(star.getAttribute('data-index'));
      if (starIndex <= index) {
        star.classList.add('hovered');
      } else {
        star.classList.remove('hovered');
      }
    });
  }

  function updateStars() {
    stars.forEach(star => {
      const starIndex = parseInt(star.getAttribute('data-index'));
      if (starIndex <= currentRating) {
        star.classList.add('filled');
      } else {
        star.classList.remove('filled');
      }
    });
  }

  function updateRatingDisplay() {
    // يمكن إضافة عرض رقم التقييم المختار هنا
  }

  // progress bar + total reviews
  fetch('reviews.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      const reviewCounts = data.reviews;

      let totalReviews = 0;
      for (let rating in reviewCounts) {
        totalReviews += reviewCounts[rating];
      }

      document.getElementById('total-reviews').textContent = `Based on ${totalReviews} reviews`;

      for (let rating in reviewCounts) {
        const percentage = (reviewCounts[rating] / totalReviews) * 100;
        document.querySelector(`.progress-bar[data-star="${rating}"]`).style.width = `${percentage}%`;
      }
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
      document.getElementById('total-reviews').textContent = "Failed to load reviews.";
    });

  //////////////////////////////////////////////////////////////
  // إضافة التعليقات مع pagination
  document.getElementById('buttonSubmit').addEventListener('click', function (event) {
    event.preventDefault();

    const commentText = document.getElementById('descriptionInput').value.trim();
    const filledStars = document.querySelectorAll('.star.filled');
    const rating = filledStars.length;

    document.getElementById('ratingError').style.display = 'none';
    document.getElementById('commentError').style.display = 'none';

    let isValid = false;

    if (rating > 0 || commentText !== '') {
      isValid = true;
    } else {
      alert("Please provide at least a rating or a comment.");
    }

    if (isValid) {
      comments.push({ rating: rating, text: commentText });
      currentPage = Math.ceil(comments.length / commentsPerPage); // ننتقل لآخر صفحة فيها التعليق الجديد
      displayComments();

      document.getElementById('descriptionInput').value = '';
      updateStarRating(0);
    }
  });

  function displayComments() {
    const commentContainer = document.getElementById('commentCardContainer');
    commentContainer.innerHTML = '';

    const startIndex = (currentPage - 1) * commentsPerPage;
    const endIndex = startIndex + commentsPerPage;
    const currentComments = comments.slice(startIndex, endIndex);

    currentComments.forEach(comment => {
      let newCommentCard = document.createElement('div');
      newCommentCard.classList.add('CommentCard');

      let cardHTML = `
        <div class="card p-3 cards" style="background-color: white; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
          <div class="text-center mt-5 profilepic">
            <img src="https://randomuser.me/api/portraits/men/32.jpg" 
                 class="rounded-circle border border-primary shadow" 
                 width="70" height="70">
          </div>
          <div class="startsstrap">
            <div class="commentStar">
              ${generateStars(comment.rating)}
            </div>
          </div>
          <p>${comment.text || ''}</p>
          <footer class="blockquote-footer">
            <small class="text-muted">Mustafa alsaraf</small>
            <a class="mr-60px" href="comments.html" target="_blank" rel="noopener noreferrer" style="margin-left: 60px;">learn more...</a>
          </footer> 
        </div>
      `;

      newCommentCard.innerHTML = cardHTML;
      commentContainer.appendChild(newCommentCard);
    });

    renderPaginationButtons();
  }

  function generateStars(rating) {
    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
      starsHtml += `<i class="bi bi-star-fill star ${i <= rating ? 'fullStar' : ''} fs-2"></i>`;
    }
    return starsHtml;
  }

  function updateStarRating(rating) {
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => {
      if (parseInt(star.dataset.index) <= rating) {
        star.classList.add('filled');
      } else {
        star.classList.remove('filled');
      }
    });
  }

  function renderPaginationButtons() {
    const paginationContainer = document.getElementById('paginationContainer');
    paginationContainer.innerHTML = '';

    const totalPages = Math.ceil(comments.length / commentsPerPage);

    if (totalPages <= 1) return;

    const prevButton = document.createElement('button');
    prevButton.innerText = 'السابق';
    prevButton.disabled = currentPage === 1;
    prevButton.classList.add('btn', 'btn-primary', 'm-1');
    prevButton.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        displayComments();
      }
    });

    const nextButton = document.createElement('button');
    nextButton.innerText = 'التالي';
    nextButton.disabled = currentPage === totalPages;
    nextButton.classList.add('btn', 'btn-primary', 'm-1');
    nextButton.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++;
        displayComments();
      }
    });

    paginationContainer.appendChild(prevButton);
    paginationContainer.appendChild(nextButton);
  }

  ///////////////////////////////////////////////////////////////////////
  // فلترة الكورسات حسب المستوى
  const levelFilter = document.getElementById('courseLevel');
  if (levelFilter) {
    const courseList = document.getElementById('courseList').getElementsByTagName('li');

    function filterCoursesByLevel() {
      const selectedLevel = levelFilter.value;

      Array.from(courseList).forEach(course => {
        const courseLevel = course.getAttribute('data-level');

        if (selectedLevel === '' || courseLevel === selectedLevel) {
          course.style.display = 'block';
        } else {
          course.style.display = 'none';
        }
      });
    }

    levelFilter.addEventListener('change', filterCoursesByLevel);
  }

  ///////////////////////////////////////////////////////////////////////
  // loading indicator
  const loadingIndicator = document.getElementById('loading');
  const courseList = document.getElementById('courseList');

  async function fetchCourses() {
    try {
      loadingIndicator.style.display = 'block';

      const response = await fetch('courses.json');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const courses = await response.json();
      courseList.innerHTML = '';

      courses.forEach(course => {
        const listItem = document.createElement('li');
        listItem.textContent = `${course.code} - ${course.name}`;
        courseList.appendChild(listItem);
      });
    } catch (error) {
      console.error('Error fetching courses:', error);
      alert('An error occurred while loading courses.');
    } finally {
      loadingIndicator.style.display = 'none';
    }
  }

  fetchCourses();
});

document.getElementById("btn1").addEventListener("click", function() {
  window.location.href = "index.html";
});

document.getElementById("btn2").addEventListener("click", function() {
window.location.href = "index.html";
});

document.getElementById("btn3").addEventListener("click", function() {
window.location.href = "index.html";
});

document.getElementById("btn4").addEventListener("click", function() {
window.location.href = "index.html";
});

// Fetch fake comments and add them to the comment section (advanced version)
function fetchFakeComments() {
fetch('https://jsonplaceholder.typicode.com/comments?_limit=5') // نجيب 5 كومنتات
  .then(response => response.json())
  .then(data => {
    data.forEach(comment => {
      const randomRating = Math.floor(Math.random() * 5) + 1; // تقييم عشوائي بين 1 و 5
      const randomUserId = Math.floor(Math.random() * 100); // نختار رقم لصورة المستخدم من 0 إلى 99
      const randomGender = Math.random() < 0.5 ? 'men' : 'women'; // تحديد جنس عشوائي للصورة

      const fakeUser = {
        name: comment.name.split(' ')[0], // ناخذ أول كلمة كاسم المستخدم
        imageUrl: `https://randomuser.me/api/portraits/${randomGender}/${randomUserId}.jpg`,
        comment: comment.body,
        rating: randomRating
      };

      displayFakeComment(fakeUser);
    });
  })
  .catch(error => {
    console.error('Error fetching fake comments:', error);
  });
}

// دالة لعرض الكومنت الوهمي
function displayFakeComment(user) {
let commentContainer = document.getElementById('commentCardContainer');

let newCommentCard = document.createElement('div');
newCommentCard.classList.add('CommentCard');

let cardHTML = `
  <div class="card p-3 cards" style="background-color: white; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
    <div class="text-center mt-5 profilepic">
      <img src="${user.imageUrl}" 
           class="rounded-circle border border-primary shadow" 
           width="70" height="70">
    </div>
    <div class="startsstrap">
      <div class="commentStar">
        ${generateStars(user.rating)}
      </div>
    </div>
    <p>${user.comment}</p>
    <footer class="blockquote-footer">
      <small class="text-muted">${user.name}</small>
      <a class="mr-60px" href="comments.html" target="_blank" rel="noopener noreferrer" style="margin-left: 60px;">learn more...</a>
    </footer> 
  </div>
`;

newCommentCard.innerHTML = cardHTML;
commentContainer.appendChild(newCommentCard);
}
fetchFakeComments();

// test request from user

function testRequest() {


}

////test
const loading = document.getElementById('loading');
const usersDiv = document.getElementById('users');

loading.style.display = 'block'; // عرض جاري التحميل

fetch('https://randomuser.me/api/?results=5')
  .then(response => response.json())
  .then(data => {
    loading.style.display = 'none';
    const users = data.results;
    users.forEach(user => {
      usersDiv.innerHTML += `
        <div class="user">
          <img src="${user.picture.medium}" alt="صورة المستخدم" />
          <h3>${user.name.first} ${user.name.last}</h3>
          <p>البريد: ${user.email}</p>
          <p>الدولة: ${user.location.country}</p>
        </div>
      `;
    });
  })
  .catch(error => {
    loading.style.display = 'none';
    alert('حدث خطأ أثناء تحميل المستخدمين');
    console.error(error);
  });

  const endpoint = 'users'; // اسم النقطة النهائية

    // جلب البيانات وعرضها في البطاقات
    async function fetchData() {
      try {
        const response = await fetch(`https://680d366ac47cb8074d8fe614.mockapi.io/api/v1/${endpoint}`);
        const data = await response.json();

        const container = document.getElementById('cards-container');
        container.innerHTML = ''; // تنظيف الحاوية

        if (data.length === 0) {
          container.innerHTML = '<p>لا توجد بيانات لعرضها.</p>';
          return;
        }

        data.forEach(user => {
          const { id, name, text } = user;

          const card = document.createElement('div');
          card.className = 'card';
          card.innerHTML = `
            <h3>${name}</h3>
            <p> ${id}</p>
            <p> ${text || 'لا يوجد نص'}</p>
          `;
          container.appendChild(card);
        });
      } catch (error) {
        console.error('حدث خطأ أثناء جلب البيانات:', error);
        document.getElementById('cards-container').innerHTML = '<p>حدث خطأ أثناء جلب البيانات.</p>';
      }
    }

    // 
    fetchData();

function test(){
  if (document.getElementById('textbox1').value === ''){
    alert('Please enter a comment before submitting.');
  }
  if (typeof(Number(currentRating.value)) === Number  ){
    alert('Please Enter a string value for the rating.');
  }
}