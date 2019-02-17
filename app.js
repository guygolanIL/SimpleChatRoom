var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var connections = {};

app.get('/' , function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

io.on('connection' , function (socket){

    socket.on('con' , function(obj) {
        console.log(`${obj.who} is connecting`);
        connections[socket.id] = obj.who ;
        console.log('connections: ');
        for(var socketId in connections){
            if(connections.hasOwnProperty(socketId)){
                console.log(`${socketId} => ${connections[socketId]}`);
            }
        }
        io.emit('added connection' , connections);
    });
    socket.on('chat message' , function(obj){
        console.log(`${obj.who}: ${obj.what}`);
        io.emit('chat message', `${obj.who}: ${obj.what}`);
    });
    socket.on('disconnect' , function (){
        console.log(`${connections[socket.id]} disconnected`);
        delete connections[socket.id]; 
        io.emit('disconnected' , connections);   
    });
});



http.listen(3000, function (){
    console.log('listening on port: 3000');
});