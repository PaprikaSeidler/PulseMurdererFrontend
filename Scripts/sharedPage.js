// sharedPage.js
const socket = new WebSocket("wss://pulsemurderer-bqaqacc5feh8h3aa.northeurope-01.azurewebsites.net:8080");

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
