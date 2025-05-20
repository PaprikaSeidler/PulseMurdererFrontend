// sharedPage.js
const socket = new WebSocket("ws://192.168.14.248:8082");

socket.onmessage = function (event) {
    console.log(event)
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
