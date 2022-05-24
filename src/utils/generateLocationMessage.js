

function generateLocaionMessage(url){
    return {
        url,
        createdAt : new Date().getTime()
    }
}

module.exports = {
    generateLocaionMessage
}