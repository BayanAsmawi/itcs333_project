document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const groupId = urlParams.get('id');

  if (!groupId) {
    document.getElementById('group-detail').innerHTML = '<p>Error: No group ID found.</p>';
    return;
  }

  try {
    const response = await fetch(`https://680ce6622ea307e081d5600b.mockapi.io/studyGroups/${groupId}`);
    if (!response.ok) throw new Error('Failed to fetch group details.');

    const group = await response.json();
    document.getElementById('group-name').textContent = group.groupName;
    document.getElementById('subject').textContent = group.subject;
    document.getElementById('meeting-times').textContent = group.meetingTimes;
    document.getElementById('members-count').textContent = group.membersCount ?? 0;
    document.getElementById('description').textContent = group.description;

    document.getElementById('edit-link').href = `add-group.html?id=${group.id}`;
  } catch (error) {
    console.error(error);
    document.getElementById('group-detail').innerHTML = '<p>Error loading group details. Please try again later.</p>';
  }
});
