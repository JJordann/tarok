import React, { useState, useEffect } from 'react'
import { socket } from '../../../services/Socket'


const Rooms = () => {


    const [rooms, setRooms] = useState([])

    useEffect(
        () => {
            socket.on("getLobbies", handleGetLobbies)
            socket.emit("getLobbies")
            return () => {
                socket.off("getLobbies")
            }
        }, [])


    const handleGetLobbies = (msg) => {
        console.log("got rooms: ", msg)
        setRooms(JSON.parse(msg))
    }

    /* TODO:
        - renderi rooms kot grid
        - vsaka soba naj ima onClick = redirect v sobo
    */


    return (
        <pre>{ JSON.stringify(rooms) }</pre>
    )
}


export default Rooms