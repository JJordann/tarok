import React, { useState, useEffect } from "react"
import getSocket from './global'

import chatStyles from '../style/chat.module.scss'


const Chat = ({ myName }) => {

    let socket = getSocket()

    let _history = [{sender: "janko", message: "o ne"}, 
                    {sender: "tezki_poldek", message: "ojoj"},
                    {sender: "betka", message: "adasdasfasf"}]

    let [history, setHistory] = useState(_history)

    useEffect(
        () => {
            // register
            socket.on("chat", msg => {
                setHistory(old => old.concat(JSON.parse(msg)))
            })

            return () => {
                // cleanup
                socket.off("chat")
            }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps



    
    const handleSend = (e) => {
        e.preventDefault()
        socket.emit("chat", mymessage)
        setMymessage("")
    }

    const handleChange = e => {
        console.log(mymessage)
        setMymessage(e.target.value)
    }

    const [mymessage, setMymessage] = useState("")

    let History = history.map(m => <pre>{m["sender"]}: {m["message"]}</pre>)

    return (
        <div className={chatStyles.wrapper}>
            { History }
            <div className={chatStyles.inputRow}>
                <hr />
                <pre>{myName + ">"}</pre>
                <input type="text" onChange={handleChange} value={mymessage}/>
                <button type="submit" onClick={handleSend}>send</button>
            </div>
        </div>
    )
}


export default Chat