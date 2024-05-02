const TOKEN = "token"
const ID = "id"

function setToken(value){
    localStorage.setItem("token", value)
}

function getToken(){
    return localStorage.getItem(TOKEN)
}

function removeToken(){
    localStorage.removeItem(TOKEN)
}

function setID(value){
    localStorage.setItem("id", value)
}

function getID(){
    return localStorage.getItem(ID)
}

function removeID(){
    localStorage.removeItem(ID)
}

export {
    setToken, getToken, removeToken,
    setID, getID, removeID
}