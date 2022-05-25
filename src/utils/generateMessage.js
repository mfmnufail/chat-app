
function generateMessage(username,text){
    return{
        username,
        text:text,
        createdAt : new Date().getTime()
    }
}


module.exports={
    generateMessage
}