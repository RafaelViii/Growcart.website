// --- Roblox Profile Preview ---
robloxInput.addEventListener('input', async function() {
  const username = robloxInput.value.trim();
  robloxProfilePreview.innerHTML = '';
  if (!username) return;
  robloxProfilePreview.innerHTML = '<span style="color:#bbb">Loading...</span>';
  try {
    const res = await fetch('https://688f241798a3e500087df8a0--tranquil-sprinkles-488bbb.netlify.app/.netlify/functions/roblox-lookup', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username })
    });
    const data = await res.json();
    if (!data.data || !data.data[0]) throw 0;
    const user = data.data[0];
    const avatarRes = await fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${user.id}&size=100x100&format=Png&isCircular=true`);
    const avatarData = await avatarRes.json();
    const imgUrl = avatarData.data[0]?.imageUrl;
    robloxProfilePreview.innerHTML = `
      <a href="https://www.roblox.com/users/${user.id}/profile" target="_blank" title="View Roblox Profile" style="display:flex;align-items:center;text-decoration:none;">
        <img src="${imgUrl}" alt="" />
        <span class="username">${user.username}</span>
      </a>
    `;
  } catch {
    robloxProfilePreview.innerHTML = `<span class="error">User not found or banned.</span>`;
  }
});