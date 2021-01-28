import React, { useEffect, useState } from "react"

import io from "socket.io-client"

//const axios = require('axios').default


const Flask = () => {

    const endpoint = "http://127.0.0.1:5000"
    const url = `/api`

    interface IState {
        socket: SocketIOClient.Socket | null
    }

    const [state, setState] = useState({socket: null})

    //socket.on("connect", () => socket.send("User joined"))

    useEffect(
        () => {
            const newsocket = io.connect(endpoint)
            setState({socket: newsocket})
        }, []
    )


    const sendIt = () => {
        if(state.socket != null)
            state.socket.emit("message", "AAAAAAAAAAAAAAAAAAAAAAAA")
    }

    /*
    fetchData() {
        axios.get(`/api/first`)
            .then((res: any) => this.setState(res.data))
    }
    */

    //this.socket.emit("message", this.state.val)
    //this.socket.on("message", (msg: number) => {this.setState({val: msg})})


    return (
        <div>
            {}
            <button onClick={sendIt}>send it</button>
        </div>
    )
}


export default Flask