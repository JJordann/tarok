import io from "socket.io-client"

var socket = null

const getSocket = () => {
    if(socket == null)
        socket = io.connect("http://127.0.0.1:5000")

    return socket
}

export default getSocket