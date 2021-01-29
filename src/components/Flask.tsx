import React, { useEffect, useState } from "react"
import io from "socket.io-client"


const Flask = () => {

    const url = `/api`

    interface IState {
        socket: SocketIOClient.Socket | null
    }

    const [state, setState] = useState({socket: null})


    useEffect(
        () => {
            const endpoint = "http://127.0.0.1:5000"
            const newsocket = io.connect(endpoint)

            newsocket.on("message", (msg) => {
                console.log(msg)
            })


            setState({socket: newsocket})

            return () => state.socket.disconnect()
        }, [] // eslint-disable-line react-hooks/exhaustive-deps
    )


    const sendIt = () => {
        if(state.socket != null)
            state.socket.emit("message", "AAAAAAAAAAAAAAAAAAAAAAAA")
    }


    return (
        <div>
            {}
            <button onClick={sendIt}>send it</button>
        </div>
    )
}


export default Flask