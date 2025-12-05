fetch(`${API_URL}/events`)
    .then(res => res.json())
    .then(events => {
        let html = "";
        events.forEach(ev => {
            html += `<p><b>${ev.name}</b> – ${ev.date}</p>`;
        });
        document.getElementById("eventList").innerHTML = html;
    });
