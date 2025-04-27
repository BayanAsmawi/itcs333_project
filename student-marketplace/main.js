document.addEventListener('DOMContentLoaded', () => {
    const itemContainer = document.querySelector('.grid');
    const searchInput = document.querySelector('input[type="search"]');
    const categoryFilter = document.querySelector('.filters select');
    const apiUrl = 'https://your-github-or-mockapi/items.json'; // Replace with actual path
  
    async function fetchItems() {
      itemContainer.innerHTML = '<p>Loading items...</p>';
      try {
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error('Failed to fetch data');
        const items = await res.json();
        renderItems(items);
      } catch (error) {
        itemContainer.innerHTML = `<p>Error: ${error.message}</p>`;
      }
    }
  
    function renderItems(items) {
      if (!items.length) {
        itemContainer.innerHTML = '<p>No items found.</p>';
        return;
      }
  
      itemContainer.innerHTML = '';
      items.forEach((item) => {
        const article = document.createElement('article');
        article.innerHTML = `
          <h2>${item.title}</h2>
          <p>${item.description}</p>
          <a href="detail.html?id=${item.id}">View Details</a>
        `;
        itemContainer.appendChild(article);
      });
    }
  
    searchInput.addEventListener('input', async () => {
      const query = searchInput.value.toLowerCase();
      const res = await fetch(apiUrl);
      const items = await res.json();
      const filtered = items.filter(item => item.title.toLowerCase().includes(query));
      renderItems(filtered);
    });
  
    fetchItems();
  });
  