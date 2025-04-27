document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const apiUrl = 'https://your-github-or-mockapi/items.json'; // Replace with actual path
    const article = document.querySelector('article');
  
    article.innerHTML = '<p>Loading item details...</p>';
  
    try {
      const res = await fetch(apiUrl);
      const items = await res.json();
      const item = items.find(i => i.id == id);
  
      if (!item) throw new Error('Item not found');
  
      article.innerHTML = `
        <h1>${item.title}</h1>
        <p><strong>Price:</strong> $${item.price}</p>
        <p><strong>Description:</strong> ${item.description}</p>
        <p><strong>Category:</strong> ${item.category}</p>
        <p><strong>Contact:</strong> ${item.contact}</p>
        <div class="actions">
          <button>Edit</button>
          <button class="delete">Delete</button>
          <a href="index.html">Back to Listing</a>
        </div>
      `;
    } catch (err) {
      article.innerHTML = `<p>Error: ${err.message}</p>`;
    }
  });
  