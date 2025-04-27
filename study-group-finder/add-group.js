const API_URL = 'https://680ce6622ea307e081d5600b.mockapi.io/studyGroups';
const groupForm = document.getElementById('groupForm');
const formTitle = document.getElementById('formTitle');
const submitBtn = document.getElementById('submitBtn');

const urlParams = new URLSearchParams(window.location.search);
const groupId = urlParams.get('id');

if (groupId) {
  formTitle.textContent = 'Edit Study Group';
  submitBtn.textContent = 'Update Group';
  fetchGroupData(groupId);
}

async function fetchGroupData(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error('Failed to fetch group data.');

    const group = await response.json();
    document.getElementById('group-name').value = group.groupName;
    document.getElementById('subject').value = group.subject;
    document.getElementById('meeting-times').value = group.meetingTimes;
    document.getElementById('members-count').value = group.membersCount ?? 0;
    document.getElementById('description').value = group.description;
  } catch (error) {
    alert(error.message);
  }
}

groupForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const newGroup = {
    groupName: document.getElementById('group-name').value.trim(),
    subject: document.getElementById('subject').value,
    meetingTimes: document.getElementById('meeting-times').value.trim(),
    membersCount: parseInt(document.getElementById('members-count').value) || 0,
    description: document.getElementById('description').value.trim(),
  };

  try {
    const method = groupId ? 'PUT' : 'POST';
    const endpoint = groupId ? `${API_URL}/${groupId}` : API_URL;

    const response = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newGroup),
    });

    if (!response.ok) throw new Error('Failed to save group.');
    alert('Study group saved successfully!');
    window.location.href = 'index.html';
  } catch (error) {
    alert(error.message);
  }
});
