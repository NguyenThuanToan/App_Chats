const users =[];
//Thêm user để chat
function userJoin(id,username, room){
    const user ={id,username,room}
    users.push(user);
    return user;
}

//Lấy user hiện tại
function getCurrentUser(id){
    return users.find(user => user.if === id)
}

//User rời chat
function userLeave(id){
    const index = users.findIndex(user => user.id === id);
    if(index !== -1){
        return users.splice(index,1)[0]
    }
}
//Lấy phòng của user
function getRoomUsers(room){
    return users.filter(user => user.room === room)
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
}