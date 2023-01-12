// Set up server
const server = require('express')();
const http = require('http').Server(server);
const io = require('socket.io')(http);
const port = 3000;

// Set up input and output sockets
var inputSocket = null;
const inputIp = "192.168.0.100";
var outputSocket = null;
const outputIp = "127.0.0.1";

server.get('/', function(request, response) {
  response.sendFile(__dirname + '/index.html');
})

// Socket.IO
io.on('connection', (socket) => {
    // Check ip address
    var socketIp = socket.request.connection.remoteAddress.split('ffff:')[1];

    // Check which socket connected and set input/output socket
    if (socketIp == inputIp) {
        inputSocket = socket;
        console.log('Input socket connected: ' + socketIp);
    } else if (socketIp == outputIp) {
        outputSocket = socket;
        console.log('Output socket connected: ' + socketIp);
        outputSocket.emit('scan', 2136528173);
    } else {
        console.log('Unwanted socket connected: ' + socketIp);
    }


    socket.on('scan', (input) => {
        // Check if correct socket, then send to output socket
        if (socketIp == inputIp && outputSocket != null) {
            // console.log(input['direction']);
            outputSocket.emit('scan', input);
        }
    });

    socket.on('disconnect', () => {
        // Check which socket disconnected and set input/output socket to null
        if (socketIp == inputIp) {
            inputSocket = null;
            console.log('Input socket disconnected: ' + socketIp);
        } else if (socketIp == outputIp) {
            outputSocket = null;
            console.log('Output socket disconnected: ' + socketIp);
        } else {
            console.log('Unwanted socket disconnected: ' + socketIp);
        }
    });
});

// Run server
http.listen(port, () => { console.log("Server running on port " + port); });
