document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;

    // VULNERABLE login request
    const res = await fetch(`${API_URL}/login?email=${email}&password=${pass}`);

    const data = await res.text();
    alert(data);
});
