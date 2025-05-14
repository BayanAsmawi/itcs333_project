document.querySelector("form").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const title = document.getElementById("title").value.trim();
    const date = document.getElementById("date").value;
    const content = document.getElementById("content").value.trim();
  
    if (!title || !date || !content) {
      alert("All fields are required!");
      return;
    }
  
    fetch("https://0e4c4464-608d-4520-af48-62a05630030e-00-1xcy3qajro2rv.pike.replit.dev/Api.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title, date, content })
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === "success" || data.data) {
          alert("News added successfully!");
          window.location.href = "campus.html";
        } else {
          alert("Failed to add news.");
        }
      })
      .catch(err => {
        console.error("API error:", err);
        alert("An error occurred while adding news.");
      });
  });
  