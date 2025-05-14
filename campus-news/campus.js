//campus.js for Campus News Module

const DATA_URL = "campus/news.json"; // or 
const API_BASE_URL = "https://0e4c4464-608d-4520-af48-62a05630030e-00-1xcy3qajro2rv.pike.replit.dev/Api.php";

const newsContainer = document.querySelector(".row.g-4");
const searchInput = document.querySelector("input[type='search']");
const sortSelect = document.createElement("select");
sortSelect.innerHTML = `
  <option value="default">Sort By</option>
  <option value="title">Title</option>
  <option value="date">Date</option>
`;
searchInput.parentElement.appendChild(sortSelect);

let newsData = [];
let currentPage = 1;
const itemsPerPage = 5;

async function fetchNews() {
  try {
    showLoading();
    const response = await fetch("https://0e4c4464-608d-4520-af48-62a05630030e-00-1xcy3qajro2rv.pike.replit.dev/Api.php"); 

    //const response = await fetch(DATA_URL);
    const apiNews = await response.json();

    //const localNews = JSON.parse(localStorage.getItem("newsData") || "[]");
    newsData = [...apiNews, ...localNews];

    renderNews();
  } catch (err) {
    const localNews = JSON.parse(localStorage.getItem("newsData") || "[]");
    if (localNews.length > 0) {
      newsData = localNews;
      renderNews();
    } else {
      newsContainer.innerHTML = `<p class='text-danger'>Error: ${err.message}</p>`;
    }
  }
}

function showLoading() {
  newsContainer.innerHTML = `<p>Loading news...</p>`;
}

function renderNews(data = paginate(sortNews(filterNews()))) {
    if (data.length === 0) {
      newsContainer.innerHTML = "<p>No news found.</p>";
      return;
    }
  
    newsContainer.innerHTML = data.map(news => {
      const isLocal = String(news.id).startsWith("local-");
      return `
        <article class="col-md-6">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">${news.title}</h5>
              <p class="card-text">${news.content.substring(0, 80)}...</p>
              <a href="detail.html?id=${news.id}" class="btn button" style="background-color: rgba(156, 83, 31, 0.699);">Read More</a>
             
            </div>
          </div>
        </article>
      `;
    }).join("");
  
    renderPagination(filterNews().length);
  }
  
  window.deleteNews = function (id) {
    if (!confirm("Are you sure you want to delete this news?")) return;
  
    let localNews = JSON.parse(localStorage.getItem("newsData") || "[]");
    localNews = localNews.filter(item => item.id !== id);
    localStorage.setItem("newsData", JSON.stringify(localNews));
  
    // Refresh view
    fetchNews();
  };
  
function filterNews() {
  const searchTerm = searchInput.value.toLowerCase();
  return newsData.filter(item => item.title.toLowerCase().includes(searchTerm));
}

function sortNews(data) {
  const value = sortSelect.value;
  if (value === "title") {
    return [...data].sort((a, b) => a.title.localeCompare(b.title));
  }
  if (value === "date") {
    return [...data].sort((a, b) => new Date(b.date) - new Date(a.date));
  }
  return data;
}

function paginate(data) {
  const start = (currentPage - 1) * itemsPerPage;
  return data.slice(start, start + itemsPerPage);
}

function renderPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  let paginationHtml = "<div class='mt-3'>";

  for (let i = 1; i <= totalPages; i++) {
    paginationHtml += `<button onclick="goToPage(${i})" class="btn btn-sm ${i === currentPage ? 'btn-dark' : 'btn-light'}">${i}</button> `;
  }
  paginationHtml += "</div>";
  newsContainer.insertAdjacentHTML("beforeend", paginationHtml);
}

window.goToPage = function (page) {
  currentPage = page;
  renderNews();
};

searchInput.addEventListener("input", () => {
  currentPage = 1;
  renderNews();
});

sortSelect.addEventListener("change", () => {
  currentPage = 1;
  renderNews();
});

fetchNews();
          