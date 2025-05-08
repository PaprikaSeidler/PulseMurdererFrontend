const dgram = require("dgram");
const http = require("http");
const url = require("url");
const WebSocket = require("ws");

const server = dgram.createSocket("udp4");
const httpServer = http.createServer();
const wss = new WebSocket.Server({ server: httpServer });

let udpData = "";

server.on("error", (err) => {
    console.log(`server error:\n${err.stack}`);
    server.close();
});

server.on("message", (msg, rinfo) => {
    console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
    udpData = msg.toString();
    broadcastData(udpData);
});

server.on("listening", () => {
    const address = server.address();
    console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(13000);

function broadcastData(data) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}

httpServer.listen(13000, () => {
    console.log("HTTP server listening on port 13000");
});
