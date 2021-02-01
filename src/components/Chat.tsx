import React, { useState, useEffect, useRef } from "react"
import getSocket from './global'

import chatStyles from '../style/chat.module.scss'


const Chat = ({ myName }) => {

    let socket = getSocket()

    let _history = [{sender: "janko", message: "o ne"}, 
                    {sender: "tezki_poldek", message: "ojoj"},
                    {sender: "betka", message: "adasdasfasf"}]

    let [history, setHistory] = useState(_history)

    const historyRef = useRef(null)

    useEffect(
        () => {
            // register
            socket.on("chat", msg => {
                setHistory(old => old.concat(JSON.parse(msg)))
            })

            socket.on("INFO", info => {
                setHistory(old => old.concat({sender: 'INFO', message: info}))
            })

            return () => {
                // cleanup
                socket.off("chat")
                socket.off("INFO")
            }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }, [history])



    
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

    let History = history.map(m => <pre><span>{m["sender"]}</span>: {m["message"]}</pre>)

    return (
        <div className={chatStyles.wrapper}>
            <div ref={historyRef} className={chatStyles.history}>
                { History }
            </div>
            
            <form className={chatStyles.inputRow} onSubmit={handleSend}>
                <label>
                    <p>{myName}:</p>
                    <input type="text" onChange={handleChange} value={mymessage}/>
                </label>
            </form>
        </div>
    )
}


export default Chat