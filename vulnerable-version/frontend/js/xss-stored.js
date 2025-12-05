document.getElementById("commentForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const text = document.getElementById("comment").value;

    // store in localStorage (simulating DB)
    let comments = JSON.parse(localStorage.getItem("comments")) || [];
    comments.push(text);
    localStorage.setItem("comments", JSON.stringify(comments));

    loadComments();
});

function loadComments() {
    let comments = JSON.parse(localStorage.getItem("comments")) || [];

    let html = "";
    comments.forEach(c => {
        html += `<p>${c}</p>`; // VULNERABLE stored XSS
    });

    document.getElementById("commentList").innerHTML = html;
}

loadComments();
