const eventsList = document.getElementById('events-list');
const eventForm = document.getElementById('event-form');
const searchInput = document.getElementById('search');
const sortSelect = document.getElementById('sort-by');
const formError = document.getElementById('form-error');
const submitButton = document.querySelector('#event-form button[type="submit"]');

let events = [];
let currentEditId = null;

const API_URL = 'https://0e4c4464-608d-4520-af48-62a05630030e-00-1xcy3qajro2rv.pike.replit.dev/events.php';

document.getElementById('searchEvents')?.addEventListener('input', function (e) {
  const query = e.target.value.toLowerCase();
  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(query)
  );
  renderEvents(filteredEvents);
});

async function loadEvents() {
  try {
    const response = await fetch(API_URL);
    events = await response.json();
    renderEvents();
  } catch (error) {
    console.error('Error loading events:', error);
    eventsList.innerHTML = '<p class="error">Failed to load events.</p>';
  }
}

async function saveEvent(eventData) {
  const method = currentEditId ? 'PUT' : 'POST';
  const url = currentEditId ? `${API_URL}?id=${currentEditId}` : API_URL;

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData)
    });
    const result = await response.json();
    if (result.error) throw new Error(result.error);
    await loadEvents();
    resetForm();
  } catch (error) {
    console.error('Error saving event:', error);
    formError.textContent = 'Error saving event. Please try again.';
  }
}

async function deleteEvent(id) {
  if (!confirm('Are you sure you want to delete this event?')) return;

  try {
    const response = await fetch(`${API_URL}?id=${id}`, {
      method: 'DELETE'
    });
    const result = await response.json();
    if (result.error) throw new Error(result.error);
    await loadEvents();
  } catch (error) {
    console.error('Error deleting event:', error);
    alert('Failed to delete event.');
  }
}

function renderEvents(filtered = events) {
  eventsList.innerHTML = '';
  if (filtered.length === 0) {
    eventsList.innerHTML = '<p>No events found.</p>';
    return;
  }

  filtered.forEach(event => {
    const card = document.createElement('div');
    card.className = 'event-card';
    card.innerHTML = `
      <h4>${event.title}</h4>
      <p><strong>Date:</strong> ${event.date}</p>
      <p><strong>Location:</strong> ${event.location}</p>
      <div class="d-flex justify-content-end gap-2 mt-2">
        <button class="btn btn-sm btn-info" onclick="viewDetails('${event.id}')">View</button>
        <button class="btn btn-sm btn-warning" onclick="editEvent('${event.id}')">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteEvent('${event.id}')">Delete</button>
      </div>
    `;
    eventsList.appendChild(card);
  });
}

function viewDetails(id) {
  window.location.href = `events-details.html?id=${id}`;
}

function validateForm(title, date, location, description) {
  if (!title || !date || !location || !description) {
    formError.textContent = "All fields are required.";
    return false;
  }
  formError.textContent = '';
  return true;
}

function resetForm() {
  eventForm.reset();
  currentEditId = null;
  submitButton.textContent = "Add Event";
  // Hide cancel button when not editing
  const cancelButton = document.getElementById('cancel-edit');
  if (cancelButton) {
    cancelButton.style.display = 'none';
  }
}

eventForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  const title = document.getElementById('title').value.trim();
  const date = document.getElementById('date').value.trim();
  const location = document.getElementById('location').value.trim();
  const description = document.getElementById('description').value.trim();

  if (!validateForm(title, date, location, description)) return;

  const eventData = { title, date, location, description };
  await saveEvent(eventData);
});

async function editEvent(id) {
  // Add confirmation dialog
  if (!confirm('Are you sure you want to edit this event?')) return;
  
  const event = events.find(e => e.id === id);
  if (!event) return;

  currentEditId = id;
  document.getElementById('title').value = event.title;
  document.getElementById('date').value = event.date;
  document.getElementById('location').value = event.location;
  document.getElementById('description').value = event.description;
  submitButton.textContent = "Update Event";
  
  // Show cancel button when editing
  const cancelButton = document.getElementById('cancel-edit');
  if (cancelButton) {
    cancelButton.style.display = 'inline-block';
  } else {
    // Create cancel button if it doesn't exist
    const cancelBtn = document.createElement('button');
    cancelBtn.id = 'cancel-edit';
    cancelBtn.type = 'button';
    cancelBtn.className = 'btn btn-secondary ms-2';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.addEventListener('click', resetForm);
    submitButton.parentNode.insertBefore(cancelBtn, submitButton.nextSibling);
  }
  
  eventForm.scrollIntoView({ behavior: 'smooth' });
}

searchInput?.addEventListener('input', function () {
  const query = this.value.toLowerCase();
  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(query) || event.location.toLowerCase().includes(query)
  );
  renderEvents(filteredEvents);
});

sortSelect?.addEventListener('change', function () {
  const value = this.value;
  if (value === 'title') {
    events.sort((a, b) => a.title.localeCompare(b.title));
  } else if (value === 'date') {
    events.sort((a, b) => new Date(a.date) - new Date(b.date));
  }
  renderEvents();
});

// Initialize the cancel button event listener if it exists
document.getElementById('cancel-edit')?.addEventListener('click', resetForm);

// Initialize the form
window.addEventListener('DOMContentLoaded', () => {
  loadEvents();
  resetForm(); // Make sure cancel button is hidden initially
});
