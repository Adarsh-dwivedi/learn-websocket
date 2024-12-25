const http = require("http");
const {WebSocketServer} = require("ws");
const url = require("url");
const uuid4 = require("uuid").v4;

const server = http.createServer();
const wsServer = new WebSocketServer({server});

const connections = {};
const users = {};

const broadcastUsers = ()=>{
    Object.keys(connections).forEach((uuid)=>{
        const connection = connections[uuid];
        const message = JSON.stringify(users);
        connection.send(message);
    })
}

const handleMessage = (bytes, uuid)=>{
    const message = JSON.parse(bytes.toString());
    const user = users[uuid];
    user.state = message;
    broadcastUsers();
}

const handleClose = (uuid)=>{
    delete connections[uuid];
    delete users[uuid];

    broadcastUsers();
}

wsServer.on("connection", (connection, request)=>{
    const {username} = url.parse(request.url, true).query;
    const uuid = uuid4();
    
    connections[uuid] = connection;
    users[uuid] = {
        username,
        state: {}
    }
    connection.on("message", message => handleMessage(message, uuid));
    connection.on("close", ()=>handleClose(uuid));

})

server.listen(8000, ()=>{
    console.log("Web socket server is running on 8000");
})