const http = require("http");
const url = require("url");
const WebSocket = require("ws");
const dgram = require('dgram')
const server = dgram.createSocket('udp4')

server.on('message',(msg,rinfo) => {
    console.log(`server got: ${msg}`)
    broadcastData(msg.toString())
})
server.on('listening', () =>{
    const address = server.address()
})
server.bind(8082)

// Create HTTP server
const httpServer = http.createServer();

// Create WebSocket server
const wss = new WebSocket.Server({ server: httpServer });

wss.on('connection', function connection(ws) {
    console.log('New client connected');

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);

        // Broadcast the message to all clients
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', function() {
        console.log('Client disconnected');
    });
});

function broadcastData(data) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}

httpServer.on("request", (req, res) => {
  const pathname = url.parse(req.url).pathname;
  if (pathname === "./sharedPage.html") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`
      <!DOCTYPE html>
      <html>
      <head>
          <title>WebSocket Data Display</title>
      </head>
      <body>
          <h1>WebSocket Data Display</h1>
          <div id="data"></div>
          <script>
              const ws = new WebSocket("ws://localhost:8082");
              ws.onmessage = function(event) {
                  document.getElementById("data").innerText = event.data;
              };
          </script>
      </body>
      </html>
    `);
  }
});

const port =  8082; // Use the port specified by Azure or default to 3000

httpServer.listen(port, () => {
    console.log(`HTTP server listening on port ${port}`);
});
