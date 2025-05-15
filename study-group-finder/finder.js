// finder.js

// Define the base URL for your backend APIs
// Adjust this path if your 'backend' folder is located differently relative to where finder.html is.
// If finder.html is in 'study-group-finder/', then '../backend/' should be correct.
const BASE_API_URL = '../backend/'; // Assuming finder.html is one level down from root

const STUDY_GROUPS_API_URL = `${BASE_API_URL}studygroups-api/get_study_groups.php`;
const COURSES_API_URL = `${BASE_API_URL}courses-api/get_courses.php`;


const groupList = document.querySelector('.group-list');
const loadingIndicator = document.querySelector('.loading');
const searchInput = document.getElementById('searchInput');
const filterSelect = document.getElementById('filterSelect');
const sortSelect = document.getElementById('sortSelect');
const paginationNav = document.querySelector('.pagination');

let allFetchedGroups = []; // Store all groups fetched from API
let currentPage = 1;
const itemsPerPage = 3;

async function fetchGroups() {
    loadingIndicator.style.display = 'block';
    groupList.innerHTML = ''; // Clear previous groups
    try {
        const response = await fetch(STUDY_GROUPS_API_URL);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Failed to fetch study groups. Server returned an error.' }));
            throw new Error(errorData.error || 'Failed to fetch study groups.');
        }
        const data = await response.json();
        if (data.status === 'success' && data.study_groups) {
            allFetchedGroups = data.study_groups.map(group => ({
                id: group.id, // Ensure your API returns 'id'
                groupName: group.group_name,
                subject: group.subject, // This is 'department' aliased as 'subject' from API
                meetingTimes: group.meeting_times,
                membersCount: group.members_count || 0,
                description: group.description
            }));
            renderGroups(); // Initial render
            // Populate subjects after groups are fetched if not already populated by a dedicated call
            // populateSubjectsFilter(); // This will be called by initializePage
        } else {
            throw new Error(data.error || 'Could not load study groups.');
        }
    } catch (error) {
        console.error('Error fetching groups:', error);
        groupList.innerHTML = `<p style="color: red;">Error loading study groups: ${error.message}</p>`;
    } finally {
        loadingIndicator.style.display = 'none';
    }
}

async function populateSubjectsFilter() {
    try {
        const response = await fetch(`${COURSES_API_URL}?fetch_type=departments`);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Failed to fetch subjects for filter. Server error.' }));
            throw new Error(errorData.error || 'Failed to fetch subjects for filter.');
        }
        const data = await response.json();
        if (data.status === 'success' && data.departments) {
            filterSelect.innerHTML = '<option value="">All Subjects</option>'; // Placeholder
            data.departments.forEach(department => {
                const option = document.createElement('option');
                option.value = department;
                option.textContent = department;
                filterSelect.appendChild(option);
            });
        } else {
            throw new Error(data.error || 'Could not load subjects for filter.');
        }
    } catch (error) {
        console.error('Error populating subjects filter:', error);
        filterSelect.innerHTML = '<option value="">Error loading subjects</option>';
        // alert(`Error loading subjects for filter: ${error.message}`); // Optional alert
    }
}

function renderGroups() {
    const searchText = searchInput.value.toLowerCase();
    const filterSubjectValue = filterSelect.value; // This will be the department name
    const sortType = sortSelect.value;

    let filteredGroups = allFetchedGroups.filter(group => {
        const groupNameLower = group.groupName ? group.groupName.toLowerCase() : '';
        const subjectLower = group.subject ? group.subject.toLowerCase() : '';

        const matchesSearch = groupNameLower.includes(searchText);
        const matchesFilter = !filterSubjectValue || (group.subject && group.subject === filterSubjectValue);
        return matchesSearch && matchesFilter;
    });

    // Sorting logic
    if (sortType === 'member') { // Least members
        filteredGroups.sort((a, b) => (a.membersCount || 0) - (b.membersCount || 0));
    } else if (sortType === 'members') { // Most members
        filteredGroups.sort((a, b) => (b.membersCount || 0) - (a.membersCount || 0));
    } else if (sortType === 'az') {
        filteredGroups.sort((a, b) => (a.groupName || '').localeCompare(b.groupName || ''));
    } else if (sortType === 'za') {
        filteredGroups.sort((a, b) => (b.groupName || '').localeCompare(a.groupName || ''));
    }

    const totalPages = Math.ceil(filteredGroups.length / itemsPerPage);
    currentPage = Math.min(currentPage, totalPages) || 1; // Ensure currentPage is valid
    const start = (currentPage - 1) * itemsPerPage;
    const paginatedGroups = filteredGroups.slice(start, start + itemsPerPage);

    if (paginatedGroups.length === 0 && allFetchedGroups.length > 0) { // Check if filtering resulted in no groups
        groupList.innerHTML = '<p>No study groups match your current filters.</p>';
    } else if (paginatedGroups.length === 0 && allFetchedGroups.length === 0 && loadingIndicator.style.display === 'none') {
        // This case is if the initial fetch returned no groups at all.
        // The fetchGroups function will handle the "Error loading study groups" or similar.
        // If fetchGroups was successful but returned an empty array, this might be shown.
        // We can refine this message if needed.
        groupList.innerHTML = '<p>No study groups available at the moment.</p>';
    }
    else {
        groupList.innerHTML = paginatedGroups.map(group => `
            <article>
                <h3>${group.groupName || 'Unnamed Group'}</h3>
                <p><strong>Subject:</strong> ${group.subject || 'N/A'}</p>
                <p><strong>Meeting Times:</strong> ${group.meetingTimes || 'N/A'}</p>
                <p><strong>Members:</strong> ${group.membersCount ?? 0}</p>
                <p>${group.description || 'No description available.'}</p>
                <a href="group-detail.php?id=${group.id}" role="button">View Details</a>
            </article>
        `).join('');
    }
    renderPagination(totalPages);
}

function renderPagination(totalPages) {
    paginationNav.innerHTML = '';
    if (totalPages <= 1) return; // Don't show pagination if only one page or no pages

    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li'); // Create li for picoCSS pagination
        const button = document.createElement('button');
        button.textContent = i;
        if (i === currentPage) {
            button.setAttribute('aria-current', 'page'); // For PicoCSS styling of current page
            button.classList.add('contrast'); // Your custom class
        }
        button.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent potential form submission if pagination is inside a form
            goToPage(i);
        });
        li.appendChild(button);
        paginationNav.appendChild(li);
    }
}

function goToPage(page) {
    currentPage = page;
    renderGroups();
}

searchInput.addEventListener('input', () => {
    currentPage = 1;
    renderGroups();
});

filterSelect.addEventListener('change', () => {
    currentPage = 1;
    renderGroups();
});

sortSelect.addEventListener('change', () => {
    currentPage = 1;
    renderGroups();
});

// Initialize the page
async function initializePage() {
    await populateSubjectsFilter(); // Populate subjects first
    await fetchGroups();          // Then fetch and render groups
}

document.addEventListener('DOMContentLoaded', initializePage);
