const API_URL = 'https://680ce6622ea307e081d5600b.mockapi.io/studyGroups';

const groupList = document.querySelector('.group-list');
const loadingIndicator = document.querySelector('.loading');
const searchInput = document.getElementById('searchInput');
const filterSelect = document.getElementById('filterSelect');
const sortSelect = document.getElementById('sortSelect');
const paginationNav = document.querySelector('.pagination');

let groups = [];
let currentPage = 1;
const itemsPerPage = 3;

async function fetchGroups() {
  loadingIndicator.style.display = 'block';
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch study groups.');
    groups = await response.json();
    renderGroups();
    populateCollege();
  } catch (error) {
    groupList.innerHTML = `<p style="color: red;">${error.message}</p>`;
  } finally {
    loadingIndicator.style.display = 'none';
  }
}

function populateCollege() {
  const college = [...new Set(groups.map(g => g.college))].filter(Boolean);
  filterSelect.innerHTML = '<option value="">Ⴤ</option>';
  college.forEach(college => {
    const option = document.createElement('option');
    option.value = college;
    option.textContent = college;
    filterSelect.appendChild(option);
  });
}

function renderGroups() {
  const searchText = searchInput.value.toLowerCase();
  const filterCollege = filterSelect.value;
  const sortType = sortSelect.value;

  let filtered = groups.filter(group => {
    const matchesSearch = group.groupName.toLowerCase().includes(searchText);
    const matchesFilter = !filterCollege || group.college === filterCollege;
    return matchesSearch && matchesFilter;
  });

  // Sorting logic based on selected option
  if (sortType === 'member') {
    filtered.sort((a, b) => a.membersCount - b.membersCount);
  } else if (sortType === 'members') {
    filtered.sort((a, b) => b.membersCount - a.membersCount);
  } else if (sortType === 'az') {
    filtered.sort((a, b) => a.groupName.localeCompare(b.groupName));
  } else if (sortType === 'za') {
    filtered.sort((a, b) => b.groupName.localeCompare(a.groupName));
  }

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(start, start + itemsPerPage);

  groupList.innerHTML = paginated.map(group => `
    <article>
      <h3>${group.groupName}</h3>
      <p><strong>College:</strong> ${group.college}</p>
      <p><strong>Meeting Times:</strong> ${group.meetingTimes}</p>
      <p><strong>Members:</strong> ${group.membersCount ?? 0}</p>
      <p><strong>Description:</strong> ${group.description}</p>
      <a class="viewBtn" href="group-detail.html?id=${group.id}" role="button">View Details</a>
    </article>
  `).join('');
  
  renderPagination(totalPages);
}

function renderPagination(totalPages) {
  paginationNav.innerHTML = '';
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    if (i === currentPage) btn.classList.add('contrast');
    btn.addEventListener('click', () => goToPage(i));
    paginationNav.appendChild(btn);
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

fetchGroups();
