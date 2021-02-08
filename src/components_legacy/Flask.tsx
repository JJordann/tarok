import React, { useState } from "react"


import getSocket from "./global"


const Flask = () => {

    let socket = getSocket();

    const connect = () => {

        socket.emit("join", name)
    }

    const ready = () => {
        socket.emit("ready", "ready")
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
            {socket != null ? <button onClick={ready}>ready</button> : null }
        </div>
    )
}


export default Flask