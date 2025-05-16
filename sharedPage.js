// sharedPage.js
const socket = new WebSocket("ws://localhost:13000");

socket.onmessage = function (event) {
    const players = JSON.parse(event.data);
    const list = document.getElementById("playerList");
    list.innerHTML = "";

    players.forEach(p => {
        const item = document.createElement("li");
        item.innerHTML = `
            <strong>${p.name}</strong> - ${p.isAlive ? "🟢 Alive" : "💀 Dead"} - Votes: ${p.votesRecieved}
        `;
        list.appendChild(item);
    });
};
