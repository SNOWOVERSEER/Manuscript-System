const TOKEN = "token"

function setToken(value){
    localStorage.setItem(TOKEN, value)
}

function getToken(){
    return localStorage.getItem(TOKEN)
}

function removeToken(){
    localStorage.removeItem(TOKEN)
}

export {setToken, getToken, removeToken}