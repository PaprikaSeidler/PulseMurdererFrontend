const dgram = require("dgram");
const WebSocket = require("ws");
const http = require("http");

// Create UDP socket
const udpServer = dgram.createSocket("udp4");

// Create HTTP server
const httpServer = http.createServer((req, res) => {
    if (req.url === "/") {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Player pulse</title>
            </head>
            <body>
                <h1 class="container" align:"center">Puls:</h1>
                <div id="data" class="container"></div>
                <script>
                    const ws = new WebSocket("ws://localhost:8080");
                    ws.onmessage = function(event) {
                        document.getElementById("data").innerText = event.data;
                    };
                </script>
            </body>
            </html>
        `);
    } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not Found");
    }
});

// Initialize WebSocket server with the HTTP server
const wss = new WebSocket.Server({ server: httpServer });

udpServer.on("error", (err) => {
    console.log(`UDP server error:\n${err.stack}`);
    udpServer.close();
});

udpServer.on("message", (msg, rinfo) => {
    console.log(`UDP server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
    const udpData = msg.toString();
    broadcastData(udpData);
});

udpServer.on("listening", () => {
    const address = udpServer.address();
    console.log(`UDP server listening ${address.address}:${address.port}`);
});

udpServer.bind(13000);

function broadcastData(data) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}

// Start HTTP server on the port specified by the PORT environment variable
const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
    console.log(`HTTP server listening on port ${PORT}`);
});

