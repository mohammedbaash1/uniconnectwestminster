document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const regForm = document.getElementById('registerForm');

    if (regForm) {
        regForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    password: document.getElementById('password').value
                })
            });
            if (res.ok) window.location.href = '/dashboard';
            else alert("Registration Error");
        });
    }
    // (Login logic is similar - if you hit register it will flow to dashboard)
});