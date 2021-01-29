import React, { useEffect, useState } from "react"
import io from "socket.io-client"


const Flask = () => {

    const url = `/api`
    const endpoint = "http://127.0.0.1:5000"

    interface IState {
        socket: SocketIOClient.Socket | null
    }

    const [state, setState] = useState({socket: null})


    //useEffect(
        //() => {
            //const newsocket = io.connect(endpoint)

            //newsocket.on("message", (msg) => {
                //console.log(msg)
            //})


            //setState({socket: newsocket})

            //return () => state.socket.disconnect()
        //}, [] // eslint-disable-line react-hooks/exhaustive-deps
    //)


    const connect = () => {

        let newsocket = io.connect(`${endpoint}/joined`)
        newsocket.emit("join", name)

        setState({socket: newsocket})
    }

    const [name, setName] = useState("")

    const handleChange = event => {
        console.log(name)
        setName(event.target.value)
    }

    return (
        <div>
            <input type="text" value={name} onChange={handleChange} />
            <button onClick={connect}>connect</button>
        </div>
    )
}


export default Flask