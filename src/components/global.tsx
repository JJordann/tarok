import io from "socket.io-client"

var socket = null

const getSocket = () => {
    if(socket == null)
        socket = io.connect("http://127.0.0.1:5000/joined")

    return socket
}

export default getSocket