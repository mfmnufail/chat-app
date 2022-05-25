const users = []

const addUser=({id, username, room})=>{

    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase();

    if(!username || !room){
        return {
            error : "Username and room are required"
        }
    }

    const existingUser = users.find(user=>{
        return user.username === username && user.room === room
    })

    if(existingUser){
        return {
            error : "Username in use!"
        }
    }

    const user = {id, username, room}
    users.push(user)

    return { user}
}


