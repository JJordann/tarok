import socketio from 'socket.io-client'
import { SOCKET_URL } from './config'





/*
    to be executed when first component mounts

    after connecting, check if client has a cookie set
    if cookie is set, emit its value to attempt reconnect
*/


// returns ID if set, else null
const getCookieID = (): string | null => {

    console.log("Cookies: ", document.cookie)
    if (!document.cookie)
        return null

    let idRow = 
        document.cookie
            .split("; ")
            .find(item => item.startsWith("id"))
    
    return idRow ? idRow.split("=")[1] : null
}

const handleReconnect = (stage: string) => {
    console.log(`attempting reconnect (stage: ${stage})`)
    if(stage === "inactive")
        // game is no longer active, do not redirect
        console.log("should not redirect")
    else if(stage === "lobby")
        console.log("should redirect to /lobby")
        // redirect to /lobby
    else 
        // redirect to /game
        console.log("should redirect to /game")
}


const setCookieId = (id: string, ttl: number) =>
    document.cookie = 
        `id=${id};max-age=${ttl};path=/`



const handleConnectionID = (id: string) => {
    console.log("setting reconnect ID: ", id)
    setCookieId(id, 60*60*2)
}



var socket: SocketIOClient.Socket;

if (!socket) {
    socket = socketio.connect(SOCKET_URL)
    socket.on("connectionID", handleConnectionID)
    console.log("id: ", getCookieID())

    let id = getCookieID()
    if (id != null) {
        socket.on("reconnect", handleReconnect)
        socket.emit("reconnect", id)
    }
}


export {
    socket
}