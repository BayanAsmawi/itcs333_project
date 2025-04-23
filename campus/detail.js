// detail.js for Campus News

//const DETAIL_DATA_URL = "https://mocki.io/v1/bcb1013f-d234-4fbd-a50e-3c6ab1775151"; // Replace with your actual source
const DETAIL_DATA_URL =  "news.json" ;
const params = new URLSearchParams(window.location.search);
const newsId = isNaN(params.get("id")) ? params.get("id") : Number(params.get("id"));
const detailContainer = document.querySelector("article");

async function fetchDetail() {
  try {
    detailContainer.innerHTML = "<p>Loading...</p>";

    // Try loading from localStorage first
    const localNews = JSON.parse(localStorage.getItem("newsData") || "[]");
    const localItem = localNews.find(item => item.id == newsId);
    if (localItem) {
      return renderDetail(localItem);
    }

    // Fallback: Load from API
    const response = await fetch(DETAIL_DATA_URL);
    const apiNews = await response.json();
    const apiItem = apiNews.find(item => item.id == newsId);

    if (apiItem) {
      return renderDetail(apiItem);
    }

    detailContainer.innerHTML = "<p class='text-danger'>News not found.</p>";
  } catch (error) {
    detailContainer.innerHTML = `<p class='text-danger'>Error: ${error.message}</p>`;
  }
}

function renderDetail(newsItem) {
  detailContainer.innerHTML = `
    <h1>${newsItem.title}</h1>
    <p><strong>Date:</strong> ${newsItem.date}</p>
    <p>${newsItem.content}</p>

    <div class="my-4">
      <button class="btn button" style="background-color: rgba(156, 83, 31, 0.699);">Edit</button>
      <button class="btn button" style="background-color: rgba(156, 83, 31, 0.699);" onclick="deleteNews('${newsItem.id}')">Delete</button>
      <a href="campus.html" class="btn button" style="background-color: rgba(156, 83, 31, 0.699);">Back to Listing</a>
    </div>
  `;
}

window.deleteNews = function (id) {
  const confirmDelete = confirm("Are you sure you want to delete this news?");
  if (!confirmDelete) return;

  let localNews = JSON.parse(localStorage.getItem("newsData") || "[]");
  localNews = localNews.filter(item => item.id !== id);
  localStorage.setItem("newsData", JSON.stringify(localNews));
  alert("News deleted.");
  window.location.href = "campus.html";
};

fetchDetail();
