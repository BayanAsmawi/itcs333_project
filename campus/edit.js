async function loadNewsData() {
  let localNews = JSON.parse(localStorage.getItem("newsData") || "[]");
  let newsItem = localNews.find(item => item.id == newsId);

  if (!newsItem) {
    // Try fetching from news.json as fallback
    try {
      const response = await fetch('news.json');
      const newsData = await response.json();
      newsItem = newsData.find(item => item.id == newsId);

      if (!newsItem) {
        alert("News item not found!");
        window.location.href = "campus.html";
        return;
      }

      // Optional: Add it to localStorage for future edits
      localNews.push(newsItem);
      localStorage.setItem("newsData", JSON.stringify(localNews));
    } catch (error) {
      alert("Error loading news data!");
      console.error(error);
      window.location.href = "campus.html";
      return;
    }
  }

  titleInput.value = newsItem.title;
  dateInput.value = newsItem.date;
  contentInput.value = newsItem.content;
}
