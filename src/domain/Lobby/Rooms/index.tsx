import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { socket } from '../../../services/Socket'
import roomsStyles from './rooms.module.scss'
import { faStar } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


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
        - dodaj grid item za novo sobo (na začetek)
    */

    const handleNewRoom = () => {
        socket.emit("createRoom")
    }

    const history = useHistory()
    const handleJoinRoom = (roomId) => {
      history.push(`/lobby/${roomId}`)
    }

    let CreateRoom = 
        <div 
            className={roomsStyles.item}
            onClick={handleNewRoom}
        >
            Create new room
            <hr />
            <FontAwesomeIcon icon={faStar} /> 
        </div>

    let AllRooms = rooms.map(
        (room, i) => 
            <div 
                className={roomsStyles.item}
                onClick={() => handleJoinRoom(room.id)}
            >
                { room.id }
                <hr />
                { 
                    room.players.map(
                        player => <p>{player}</p>
                    ) 
                }
            </div>
    )


    return (
        <div className={roomsStyles.roomsContainer}>
            { CreateRoom }
            { AllRooms }
        </div>
    )
}


export default Rooms