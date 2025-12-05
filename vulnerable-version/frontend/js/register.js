document.getElementById("regForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;

    fetch(`${API_URL}/register?name=${name}&email=${email}&password=${pass}`)
        .then(res => res.text())
        .then(data => alert(data));
});
