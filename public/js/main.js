const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')

//Lấy tên người dùng và phòng từ URL
const{username,room} = Qs.parse(location.search,{
    ignoreQueryPrefix: true
})

console.log(username, room);


const socket = io();

//Tham gia nhóm chat
socket.emit('joinRoom', {username, room});

//Lấy phòng và users
socket.on('roomUsers',({room,users})=>{
    outputRoomName(room);
    outputUsers(users);
});


//Tin nhắn từ server
socket.on('message', message =>{
    console.log(message);
    outputMessage(message)
    //Thanh cuộn tin nhắn
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

//gửi tin nhắn
chatForm.addEventListener('submit', (e) =>{
    e.preventDefault();
    //Lấy tin nhắn
    const msg = e.target.elements.msg.value;
    // console.log(msg);
    //Gửi tin nhắn đến server
    socket.emit('chatMessage', msg);
    //Làm sạch những thứ đã nhập
    e.target.elements.msg.value ='';
    e.target.elements.msg.focus();
})

//Xuất ra DOm
function outputMessage(message){
    const div = document.createElement('div')
    div.classList.add('message')
    div.innerHTML = `<p class="meta">${message.username}<span>${message.time}</span></p>
    <p class="text">
    ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
    
}

//Thêm room vào DOM
function outputRoomName(room){
    roomName.innerHTML = room;
}
function outputUsers(users){
    userList.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join('')}`
}
