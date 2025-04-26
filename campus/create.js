document.querySelector("form").addEventListener("submit", function (e) {
    e.preventDefault();
    const DATA_URL = "news.json";
    const title = document.getElementById("title").value.trim();
    const date = document.getElementById("date").value;
    const content = document.getElementById("content").value.trim();
  
    if (!title || !date || !content) {
      alert("All fields are required!");
      return;
    }
  
    const newNews = {
       id: `local-${Date.now()}`,
      title,
      date,
      content
    };
    
    const storedNews = JSON.parse(localStorage.getItem("newsData") || "[]");
    storedNews.push(newNews);
    localStorage.setItem("newsData", JSON.stringify(storedNews));
  
    alert("News added successfully!");
    window.location.href = "campus.html";
  });
  