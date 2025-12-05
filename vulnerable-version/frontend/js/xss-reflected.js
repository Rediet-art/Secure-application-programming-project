const params = new URLSearchParams(window.location.search);
const q = params.get("q");

document.getElementById("output").innerHTML = q; // VULNERABLE
