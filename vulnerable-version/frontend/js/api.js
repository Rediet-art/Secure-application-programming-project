const API_URL = "http://localhost:3000"; // vulnerable backend

async function apiPost(path, data) {
    const response = await fetch(`${API_URL}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    return response.json();
}

async function apiGet(path) {
    const response = await fetch(`${API_URL}${path}`);
    return response.json();
}
