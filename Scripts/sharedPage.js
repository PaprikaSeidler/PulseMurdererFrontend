// sharedPage.js
const socket = new WebSocket("ws://192.168.14.248:8082");

// const piWS = new WebSocket("http://localhost:8083")
// piWS.onopen = function () {
//     document.getElementById("data").innerText = "Connected";
// };
//
// piWS.onmessage = function (event) {
//     console.log(event)
//     document.getElementById("data").innerText = event.data.replace(/\.\d+/g, '');
// };
//
// piWS.onerror = function (error) {
//     console.log("WebSocket Error: " + error);
//     document.getElementById("data").innerText = "Error";
// };
//
// piWS.onclose = function () {
//     document.getElementById("data").innerText = "Disconnected";
// };
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
