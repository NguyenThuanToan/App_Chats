const path = require('path')
const express = require('express')
const formatMessage = require('./utils/messages')
const {userJoin, getCurrentUser,getRoomUsers,userLeave} = require('./utils/Users')
const http = require('http')

const socketio = require('socket.io')
const { Socket } = require('dgram')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

app.use(express.static(path.join(__dirname,'public')))

const botName = 'ChatTeam Bot'

//Chạy khi có người kết nối
io.on('connection', socket =>{
    socket.on('joinRoom',({username,room}) =>{
    const user = userJoin(socket.id, username,room)
    socket.join(user.room)
    //Chào mừng người hiện tại
    socket.emit('message', formatMessage(botName,'Welcome to ChatTeam'))
    //Phát tín hiệu khi có người kết nối
    socket.broadcast.to(user.room).emit('message', formatMessage(botName,`${user.username} has joined the chat`))
    //Gửi thông tin của user và phòng
    io.to(user.room).emit('roomUsers',{
        room: user.room,
        users: getRoomUsers(user.room)
    })
})
    //Lắng nghe cuộc trò chuyện
    socket.on('chatMessage', (msg) =>{
        const user = getCurrentUser(socket.id);
        if (user && user.room) {
            io.to(user.room).emit('message', formatMessage(user.username, msg));
        }
        // io.to(user.room).emit('message', formatMessage(user.username, msg));
    })
         //Phát tín hiệu khi có người ngắt nối
    socket.on('disconnect', () =>{
        const user = userLeave(socket.id)
        if(user){
            io.to(user.room).emit('message', formatMessage(botName,`${user.username} has left the chat`));
            io.to(user.room).emit('roomUsers',{
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }
    })
})

const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));





