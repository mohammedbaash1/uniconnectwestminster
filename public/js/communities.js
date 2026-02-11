document.addEventListener('DOMContentLoaded', async () => {
    const list = document.getElementById('communitiesList');
    const loading = document.getElementById('loading');
    const token = localStorage.getItem('token');

    try {
        const res = await fetch('/api/communities', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (loading) loading.style.display = 'none';

        list.innerHTML = data.map(item => `
            <div class="comm-card">
                <div class="comm-icon">👥</div>
                <div class="comm-info">
                    <span class="category-badge">${item.category}</span>
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                </div>
                <button class="join-btn">Join Society</button>
            </div>
        `).join('');
    } catch (err) {
        if (loading) loading.innerHTML = "Error loading data.";
    }
});