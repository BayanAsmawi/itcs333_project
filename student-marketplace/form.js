document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
  
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
  
      const title = form.title.value.trim();
      const description = form.description.value.trim();
      const price = parseFloat(form.price.value);
      const category = form.category.value;
      const contact = form.contact.value.trim();
  
      if (!title || !description || !price || !category || !contact) {
        alert('All fields marked * are required.');
        valid = false;
      }
  
      if (isNaN(price) || price < 0) {
        alert('Price must be a positive number.');
        valid = false;
      }
  
      if (!/\S+@\S+\.\S+/.test(contact)) {
        alert('Enter a valid email.');
        valid = false;
      }
  
      if (valid) {
        alert('Item submitted successfully (mock).');
        // Here you'd normally send a POST request to an API
      }
    });
  });
  