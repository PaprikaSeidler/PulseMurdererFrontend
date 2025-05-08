//const dgram = require("dgram");
//const http = require("http");
//const url = require("url");
//const WebSocket = require("ws");
//
//const server = dgram.createSocket("udp4");
//const httpServer = http.createServer();
//const wss = new WebSocket.Server({ server });
//
//let udpData = "";
//
//wss.on(`connection`, (ws) =>{
//    console.log(`Client connected`)
//
//    ws.on("message", (message) =>{
//        console.log(`Revieved: ${message}`)
//
//        wss.clients.forEach((client) =>{
//            if(client !== ws && client.readyState === WebSocket.OPEN){
//                client.send(message)
//            }
//        })
//    })
//
//    ws.on('close', () =>{
//        console.log('Client disconnected')
//    })
//})
//
//server.on("error", (err) => {
//    console.log(`server error:\n${err.stack}`);
//    server.close();
//});
//
//server.on("message", (msg, rinfo) => {
//    console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
//    udpData = msg.toString();
//    broadcastData(udpData);
//});
//
//server.on("listening", () => {
//    const address = server.address();
//    console.log(`server listening ${address.address}:${address.port}`);
//});
//
//server.bind(13000);
//
//function broadcastData(data) {
//    wss.clients.forEach((client) => {
//        if (client.readyState === WebSocket.OPEN) {
//            client.send(data);
//        }
//    });
//}
//
//httpServer.listen(process.env.PORT || 13000, () => {
//    console.log(`HTTP server listening on port ${server.address().port}`);
//});
const dgram = require("dgram");
const http = require("http");
const url = require("url");
const WebSocket = require("ws");

// Create UDP socket
const udpServer = dgram.createSocket("udp4");

// Create HTTP server
const httpServer = http.createServer((req, res) => {
    const pathname = url.parse(req.url).pathname;

    if (pathname === "/sharedPage.html") {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>WebSocket Test</title>
            </head>
            <body>
                <h1>WebSocket Test</h1>
                <div id="status">Connecting...</div>
                <script>
                    const ws = new WebSocket("wss://pulsemurderer-bqaqacc5feh8h3aa.northeurope-01.azurewebsites.net/");

                    ws.onopen = function() {
                        document.getElementById("status").innerText = "Connected";
                    };

                    ws.onmessage = function(event) {
                        console.log("Message received: " + event.data);
                    };

                    ws.onerror = function(error) {
                        console.log("WebSocket Error: " + error);
                        document.getElementById("status").innerText = "Error";
                    };

                    ws.onclose = function() {
                        document.getElementById("status").innerText = "Disconnected";
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

let udpData = "";

wss.on("connection", (ws) => {
    console.log("Client connected");

    ws.on("message", (message) => {
        console.log(`Received: ${message}`);

        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on("close", () => {
        console.log("Client disconnected");
    });
});

udpServer.on("error", (err) => {
    console.log(`UDP server error:\n${err.stack}`);
    udpServer.close();
});

udpServer.on("message", (msg, rinfo) => {
    console.log(`UDP server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
    udpData = msg.toString();
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

