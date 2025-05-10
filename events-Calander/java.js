// ==================== Variables and Selectors ====================
const eventsList = document.getElementById('events-list');
const eventForm = document.getElementById('event-form');
const searchInput = document.getElementById('search');
const sortSelect = document.getElementById('sort-by');
const formError = document.getElementById('form-error');
const submitButton = document.querySelector('#event-form button[type="submit"]');

let events = []; // This will hold all events (dummy + created)
let currentEditId = null; // To track which event is being edited

document.getElementById('searchEvents').addEventListener('input', function(e) {
  const query = e.target.value.toLowerCase();
  const filteredEvents = events.filter(event => 
      event.title.toLowerCase().includes(query)
  );
  renderEvents(filteredEvents);
});
// ==================== Dummy Events ====================
const dummyEvents = [
    {
        id: generateId(),
        title: "Open Day",
        date: "2025-05-10",
        location: "Campus Auditorium",
        description: "Explore university clubs and activities."
    },
    {
        id: generateId(),
        title: "Tech Talk",
        date: "2025-06-05",
        location: "Lecture Hall A",
        description: "Future of AI and Machine Learning."
    },
    {
        id: generateId(),
        title: "Sports Meet",
        date: "2025-07-15",
        location: "Campus Stadium",
        description: "Annual sports competitions!"
    }
];

// ==================== Helper Functions ====================

// Generate random ID for events
function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

// Save events to localStorage
function saveEvents() {
    localStorage.setItem('events', JSON.stringify(events));
}

// Load events from localStorage
function loadEvents() {
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
        events = JSON.parse(storedEvents);
    } else {
        events = dummyEvents; // First time, load dummy events
        saveEvents();
    }
}

// Render all events on the page
function renderEvents(filteredEvents = events) {
    eventsList.innerHTML = '';
    if (filteredEvents.length === 0) {
        eventsList.innerHTML = '<p>No events found.</p>';
        return;
    }

    filteredEvents.forEach(event => {
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

// Redirect to event details page
function viewDetails(id) {
    window.location.href = `events-details.html?id=${id}`;
}

// Validate form inputs
function validateForm(title, date, location, description) {
    if (!title || !date || !location || !description) {
        formError.textContent = "All fields are required.";
        return false;
    }
    formError.textContent = '';
    return true;
}

// Reset form to add mode
function resetForm() {
    eventForm.reset();
    currentEditId = null;
    submitButton.textContent = "Add Event";
}

// ==================== Event Handlers ====================

// Handle form submit
eventForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const title = document.getElementById('title').value.trim();
    const date = document.getElementById('date').value.trim();
    const location = document.getElementById('location').value.trim();
    const description = document.getElementById('description').value.trim();

    if (!validateForm(title, date, location, description)) {
        return;
    }

    const eventData = {
        title,
        date,
        location,
        description
    };

    let successMessage = '';
    
    if (currentEditId) {
        // Update existing event
        eventData.id = currentEditId;
        events.push(eventData);
        successMessage = `Event "${title}" has been updated successfully!`;
        currentEditId = null;
        submitButton.textContent = "Add Event";
    } else {
        // Add new event
        eventData.id = generateId();
        events.push(eventData);
        successMessage = `Event "${title}" has been added successfully!`;
    }

    saveEvents();
    renderEvents();
    eventForm.reset();
    
    // Show success popup
    alert(successMessage);
});

// Handle event delete
function deleteEvent(id) {
    if (confirm('Are you sure you want to delete this event?')) {
        events = events.filter(event => event.id !== id);
        saveEvents();
        renderEvents();
        
        // If the deleted event was being edited, reset the form
        if (currentEditId === id) {
            resetForm();
        }
    }
}

// Handle event edit
function editEvent(id) {
    if (confirm('Are you sure you want to edit this event?')) {
        const event = events.find(e => e.id === id);
        if (event) {
            // Set form to edit mode
            currentEditId = id;
            submitButton.textContent = "Update Event";
            
            // Populate form fields
            document.getElementById('title').value = event.title;
            document.getElementById('date').value = event.date;
            document.getElementById('location').value = event.location;
            document.getElementById('description').value = event.description;

            // Remove the event temporarily while editing
            events = events.filter(e => e.id !== id);
            saveEvents();
            renderEvents();
            
            // Scroll to form
            eventForm.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

// Handle search input
searchInput.addEventListener('input', function () {
    const searchTerm = this.value.toLowerCase();
    const filteredEvents = events.filter(event =>
        event.title.toLowerCase().includes(searchTerm) ||
        event.location.toLowerCase().includes(searchTerm)
    );
    renderEvents(filteredEvents);
});

// Handle sorting
sortSelect.addEventListener('change', function () {
    const sortBy = this.value;

    if (sortBy === 'title') {
        events.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'date') {
        events.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    renderEvents();
});

// Add a cancel edit button event listener
document.getElementById('cancel-edit')?.addEventListener('click', function() {
    resetForm();
});

// ==================== Initialization ====================
window.addEventListener('DOMContentLoaded', function () {
    loadEvents();
    renderEvents();
});
