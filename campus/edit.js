const params = new URLSearchParams(window.location.search);
const newsId = isNaN(params.get("id")) ? params.get("id") : Number(params.get("id"));
const titleInput = document.getElementById("title");
const dateInput = document.getElementById("date");
const contentInput = document.getElementById("content");

function loadNewsData() {
  const localNews = JSON.parse(localStorage.getItem("newsData") || "[]");
  const newsItem = localNews.find(item => item.id == newsId);

  if (!newsItem) {
    alert("News item not found!");
    window.location.href = "campus.html";
    return;
  }

  titleInput.value = newsItem.title;
  dateInput.value = newsItem.date;
  contentInput.value = newsItem.content;
}

function saveNewsData(e) {
  e.preventDefault();

  const updatedTitle = titleInput.value.trim();
  const updatedDate = dateInput.value;
  const updatedContent = contentInput.value.trim();

  if (!updatedTitle || !updatedDate || !updatedContent) {
    alert("All fields are required!");
    return;
  }

  let localNews = JSON.parse(localStorage.getItem("newsData") || "[]");
  localNews = localNews.map(item => {
    if (item.id == newsId) {
      return {
        ...item,
        title: updatedTitle,
        date: updatedDate,
        content: updatedContent
      };
    }
    return item;
  });

  localStorage.setItem("newsData", JSON.stringify(localNews));
  alert("News updated successfully!");
  window.location.href = "campus.html";
}

loadNewsData();

document.getElementById("editForm").addEventListener("submit", saveNewsData);
