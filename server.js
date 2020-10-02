const path = require('path'); //modules
const http = require('http'); 
const express = require('express');
const formatMessage = require('./utils/messages');
const socketio = require('socket.io');  //importing socket .io
const  {   userJoin , getCurrentUser , userLeave ,getRoomUsers} = require('./utils/users');

const app = express();

const server = http.createServer(app);
const io = socketio(server);

// const message2;


//static folder
app.use(express.static(path.join(__dirname,'public')));

const botname = 'Groovy&nbsp;<i class="far fa-check-circle"></i>' ;

io.on('connection', socket =>{

socket.on('joinRoom',({username , room}) =>{
const user = userJoin(socket.id ,username , room);
    socket.join(user.room);

     //welcome curent user
    socket.emit('message2' , formatMessage(botname,'welcome to G-Chat!'));

     
     //brodcast 
    socket.broadcast.to(user.room).emit('message2' ,formatMessage(botname,` ${user.username} joined.`));

    //send user and room info
    io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
    });

});

   
       

    //Listen for chatMessage

    socket.on('chatMessage',msg => {
        const user = getCurrentUser(socket.id);
        // console.log(user);
        // console.log(user.userName);
        // console.log(msg);
        // if(user==)
        io.to(user.room).emit('message' ,formatMessage(user.username,msg));
    });

        //when client disconnect
   
    socket.on('disconnect' ,function (){

    const user = userLeave(socket.id);

    if(user)

    {
        io.to(user.room).emit('message2' , formatMessage(botname,` ${user.username} has left the chat`));

            //send user and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    }
});

});
// var socket = io.connect('http://localhost:3000');
const PORT = 3000 || process.env.PORT;

server.listen(PORT , () => console.log(`Server running on port ${PORT}`));
