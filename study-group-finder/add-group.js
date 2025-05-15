// add-group.js

const BASE_API_URL = '../backend/'; // Assuming add-group.html is one level down from root

const STUDY_GROUPS_API_URL = `${BASE_API_URL}studygroups-api/manage_study_group.php`;
const COURSES_API_URL = `${BASE_API_URL}courses-api/get_courses.php`;

const groupForm = document.getElementById('groupForm');
const formTitle = document.querySelector('section.sec'); // Target the section title
const submitBtn = document.getElementById('submitBtn');
const subjectSelect = document.getElementById('subject');

const urlParams = new URLSearchParams(window.location.search);
const groupId = urlParams.get('id');

// Function to populate subjects/departments
async function populateSubjects() {
    try {
        const response = await fetch(`${COURSES_API_URL}?fetch_type=departments`);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Failed to fetch subjects. Server returned an error.' }));
            throw new Error(errorData.error || 'Failed to fetch subjects.');
        }
        const data = await response.json();
        if (data.status === 'success' && data.departments) {
            subjectSelect.innerHTML = '<option value="">Select Subject</option>'; // Clear existing and add placeholder
            data.departments.forEach(department => {
                const option = document.createElement('option');
                option.value = department;
                option.textContent = department;
                subjectSelect.appendChild(option);
            });
        } else {
            throw new Error(data.error || 'Could not load subjects.');
        }
    } catch (error) {
        console.error('Error populating subjects:', error);
        subjectSelect.innerHTML = '<option value="">Error loading subjects</option>';
        alert(`Error loading subjects: ${error.message}`);
    }
}

// Function to fetch existing group data for editing
async function fetchGroupData(id) {
    try {
        const response = await fetch(`${STUDY_GROUPS_API_URL}?id=${id}`); // Assuming GET request to fetch by ID
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Failed to fetch group data. Server returned an error.' }));
            throw new Error(errorData.error || 'Failed to fetch group data.');
        }
        const result = await response.json();
        if (result.status === 'success' && result.group) {
            const group = result.group;
            document.getElementById('group-name').value = group.group_name;
            // The 'subject' select will be populated by populateSubjects.
            // We need to set its value *after* it's populated.
            await populateSubjects(); // Ensure subjects are loaded before setting the value
            subjectSelect.value = group.department; // Assuming API returns department for the group
            document.getElementById('meeting-times').value = group.meeting_times;
            document.getElementById('members-count').value = group.members_count || 0;
            document.getElementById('description').value = group.description;
        } else {
            throw new Error(result.error || 'Group data not found or invalid response.');
        }
    } catch (error) {
        console.error('Error fetching group data:', error);
        alert(`Error fetching group data: ${error.message}`);
        // Optionally redirect if group data cannot be loaded for editing
        // window.location.href = 'finder.html';
    }
}

// Initialize form: Populate subjects and fetch data if editing
async function initializeForm() {
    if (groupId) {
        if(formTitle) formTitle.textContent = 'Edit Study Group';
        submitBtn.textContent = 'Update Group';
        await fetchGroupData(groupId); // fetchGroupData will call populateSubjects
    } else {
        if(formTitle) formTitle.textContent = 'Add New Study Group';
        submitBtn.textContent = 'Create Group';
        await populateSubjects(); // Populate for new group
    }
}

// Form submission handler
groupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = groupId ? 'Updating...' : 'Creating...';

    const groupData = {
        group_name: document.getElementById('group-name').value.trim(),
        department: subjectSelect.value, // This is the selected department name
        meeting_times: document.getElementById('meeting-times').value.trim(),
        members_count: parseInt(document.getElementById('members-count').value) || 1, // Default to 1 if not set
        description: document.getElementById('description').value.trim(),
    };

    // Add group_id if we are editing
    if (groupId) {
        groupData.group_id = groupId;
    }

    // Basic client-side validation
    if (!groupData.group_name || !groupData.department || !groupData.meeting_times) {
        alert('Please fill in all required fields: Group Name, Subject, and Meeting Times.');
        submitBtn.disabled = false;
        submitBtn.textContent = groupId ? 'Update Group' : 'Create Group';
        return;
    }


    try {
        const method = groupId ? 'PUT' : 'POST';
        const response = await fetch(STUDY_GROUPS_API_URL, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(groupData),
        });

        const result = await response.json();

        if (response.ok && result.status === 'success') {
            alert(result.message || 'Study group saved successfully!');
            window.location.href = 'index.php'; // Redirect to the finder page
        } else {
            throw new Error(result.error || 'Failed to save group. Please try again.');
        }
    } catch (error) {
        console.error('Error saving group:', error);
        alert(`Error: ${error.message}`);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = groupId ? 'Update Group' : 'Create Group';
    }
});

// Call initializeForm when the DOM is ready
document.addEventListener('DOMContentLoaded', initializeForm);
