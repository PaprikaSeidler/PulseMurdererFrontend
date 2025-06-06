const baseUrl = 'https://pulsemurdererrest20250508143404-fgb6aucvcwhgbtb6.canadacentral-01.azurewebsites.net/api/players'

function Sleep(ms){
    return new Promise(resolve => setTimeout(resolve,ms))
}

let alivePlayers = []
async function Get(){
    const response = await axios.get(baseUrl)
    let data = response.data
    alivePlayers = []

    if(Array.isArray(data)){
        for(let i = 0; i < 6; i++){
            if(data[i] && data[i].isAlive){
                alivePlayers.push(data[i])
            }
        }
        console.log(alivePlayers.length)
    }
}

let playerId = localStorage.getItem("playerId");
let thisPlayer = null;

// Initialize WebSocket connection in the browser
const ws = new WebSocket(`ws://192.168.14.248:8082`);

function broadcastData(data){
    console.log(data)
    if(ws.readyState === WebSocket.OPEN){
        ws.send(data)
    }
    else{
        console.error("Websocket error!",ws.readyState)
    }
}
ws.onopen = function() {
    console.log('WebSocket connection established');
};

ws.onerror = function(error) {
    console.error('WebSocket error:', error);
};

ws.onclose = function(){
    console.log("Websocket closed")
}

ws.onmessage = function(event){
    Get()
    if(event.data instanceof Blob){
        const reader = new FileReader()
        reader.onload = function(){
            alivePlayers.length = reader.result
            if(reader.result === 'killed' || reader.result === 'nextRound' || reader.result === 'start'){
                window.location.reload()
            }
        }
        reader.readAsText(event.data)
    }
    else{
        if(event.data === 'killed' || event.data === 'nextRound' || event.data === 'start'){
            window.location.reload()
        }
    }
}

Vue.createApp({
    data() {
        return {
            Players: [
            ],
        }
    }
}).mount("#playerInfo");

window.onload = async function () {
    if (!playerId) {
        alert("Missing player ID");
        return;
    }

    await loadPlayer()
    await loadPlayers()

    document.getElementById("voteButton").onclick = vote;
    document.getElementById("killButton").onclick = kill;
}


// Try to get ID from URL if not in storage
if (!playerId) {
    sessionStorage.clear()
    let urlParams = new URLSearchParams(window.location.search);
    playerId = urlParams.get("id");

    if (playerId) {
        localStorage.setItem("playerId", playerId);
    }
}

if (!playerId) {
    document.body.innerHTML = "<h3>Error: No player ID provided. Please join using a valid player link.</h3>";
}
else {
    // fetch(`https://pulsemurdererrest20250508143404-fgb6aucvcwhgbtb6.canadacentral-01.azurewebsites.net/api/players/${playerId}`)
    fetch(`${baseUrl+"/"+playerId}`)
        .then(res => {
            if (!res.ok) throw new Error("Player not found");
            return res.json();
        })
        .then(player => {
            document.getElementById("playerName").textContent = player.name;
            document.getElementById("playerId").textContent = player.id;
            document.getElementById("playerStatus").textContent = player.isAlive ? "Alive" : "Dead";
            document.getElementById("playerInfo").classList.remove("hidden");
        })
        .catch(err => {
            document.body.innerHTML = `<h3>Error: ${err.message}</h3>`;
        });
}

async function loadPlayer() {
    let res = await fetch(`https://pulsemurdererrest20250508143404-fgb6aucvcwhgbtb6.canadacentral-01.azurewebsites.net/api/players/${playerId}`);
    let player = await res.json();
    thisPlayer = player;

    let resPlayers = await fetch(`https://pulsemurdererrest20250508143404-fgb6aucvcwhgbtb6.canadacentral-01.azurewebsites.net/api/players/`);
    let players = await resPlayers.json();


    document.getElementById("playerName").innerText = player.name;
    document.getElementById("roleInfo").innerText = player.isMurderer ? "🔪 You are the Murderer" : "🧑 Civilian";
    document.getElementById("status").innerText = player.isAlive ? "Alive" : "Eliminated";

    if (!player.isAlive || player.hasVoted) {
        document.getElementById("voteSection").style.display = "none";
    }

    if (player.isMurderer && player.isAlive) {
        document.getElementById("killSection").style.display = "block";
    }
}
// async function loadPlayer() {
//     // let res = await fetch(`https://pulsemurdererrest20250508143404-fgb6aucvcwhgbtb6.canadacentral-01.azurewebsites.net/api/players/${playerId}`);
//     let res = await fetch(`${baseUrl}/${playerId}`);
//     let player = await res.json();
//     thisPlayer = player;
//
//     // let resPlayers = await fetch(`https://pulsemurdererrest20250508143404-fgb6aucvcwhgbtb6.canadacentral-01.azurewebsites.net/api/players/`);
//     let resPlayers = await fetch(`${baseUrl}`);
//     let players = await resPlayers.json();
//
//     document.getElementById("playerName").innerText = player.name;
//     document.getElementById("roleInfo").innerText = player.isMurderer ? "🔪 You are the Murderer" : "🧑 Civilian";
//     document.getElementById("status").innerText = player.isAlive ? "Alive" : "Eliminated";
//
//     document.getElementById("voteSection").style.display = "block";
//     document.getElementById("killSection").style.display = "block";
//
//     if(!player.isMurderer){
//         document.getElementById("killSection").style.display = "none";
//     }
//     else{
//         if(alivePlayers.length === 4){
//             document.getElementById("killSection").style.display = "initial";
//         }
//     }
//
//     if(player.hasVoted || !player.isAlive){
//         document.getElementById("voteSection").style.display = "none";
//     }
//     else{
//         if(alivePlayers.length === 5 || alivePlayers.length === 3){
//             document.getElementById("voteSection").style.display = "block";
//         }
//     }
// }

async function loadPlayers() {
    let res = await fetch(`${baseUrl}`);
    let players = await res.json();
    this.Players = res;

    const voteSelect = document.getElementById("voteTarget");
    voteSelect.innerHTML = "";
    players
        .filter(p => p.id != playerId && p.isAlive)
        .forEach(p => {
            let opt = document.createElement("option");
            opt.value = p.id;
            opt.textContent = p.name;
            voteSelect.appendChild(opt);
        });

    loadKillTargets(players);
}

function loadKillTargets(players) {
    let killSelect = document.getElementById("killTarget"); killSelect.innerHTML = "";

    players
        .filter(p => p.id != playerId && p.isAlive)
        .forEach(p => {
            let opt = document.createElement("option");
            opt.value = p.id;
            opt.textContent = p.name;
            killSelect.appendChild(opt);
        });
}

async function vote() {
    let target = document.getElementById("voteTarget").value;
    await fetch(`${baseUrl}/${playerId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetId: parseInt(target) })
    });
    alert("Vote submitted");
    document.getElementById("voteSection").style.display = "none";
    Sleep(1000000)
    // await loadPlayer()
    // window.location.reload()
}

async function kill() {
    let target = document.getElementById("killTarget").value;
    await fetch(`${baseUrl}/${playerId}/kill`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetId: parseInt(target) })
    });
    alert("Player killed");
    document.getElementById("killSection").style.display = "none";
    await loadPlayer()
    broadcastData('killed')
    // Sleep(1000)
    // window.location.reload()
}
