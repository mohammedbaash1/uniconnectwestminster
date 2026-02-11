document.addEventListener('DOMContentLoaded', async () => {
    const list = document.getElementById('jobsList');
    const res = await fetch('/api/jobs');
    const jobs = await res.json();
    document.getElementById('loading').style.display = 'none';
    list.innerHTML = jobs.map(j => `
        <div style="background:white; border:1px solid #eee; padding:20px; border-radius:15px; margin-bottom:10px; display:flex; justify-content:space-between;">
            <div><b>${j.title}</b><br><small>${j.company}</small></div>
            <div style="color:green; font-weight:bold;">${j.salary}</div>
        </div>
    `).join('');
});