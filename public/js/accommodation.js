document.addEventListener('DOMContentLoaded', async () => {
    const list = document.getElementById('accommodationList');
    const token = localStorage.getItem('token');

    if (!token) { window.location.href = '/login'; return; }

    try {
        const res = await fetch('/api/accommodation', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        document.getElementById('loading').style.display = 'none';

        list.innerHTML = data.map(item => `
            <div class="acc-card">
                <div class="icon-box">🏠</div>
                <div class="info">
                    <h3>${item.title}</h3>
                    <p>${item.address}</p>
                    <div class="tags">
                        <span class="tag">${item.type}</span>
                        <span class="tag">${item.distanceFromCampus}</span>
                    </div>
                </div>
                <div class="price-box">
                    <div class="price">£${item.price}</div>
                    <div class="per-week">per week</div>
                    <div class="bookmark">🔖</div>
                </div>
            </div>
        `).join('');
    } catch (err) { console.error(err); }
});