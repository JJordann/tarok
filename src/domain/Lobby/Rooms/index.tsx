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
            socket.on("createLobby", handleCreateLobby)
            socket.emit("getLobbies")
            return () => {
                socket.off("getLobbies")
                socket.off("createLobby")
            }
        }, [])


    const handleGetLobbies = (msg) => {
        console.log("got rooms: ", msg)
        setRooms(JSON.parse(msg))
    }


    const history = useHistory()

    const handleCreateLobby = msg => {
        // on new lobby request,
        // server creates new lobby 
        // and responds with its unique ID
        history.push(`/lobby/${msg}`)
    }

    /* TODO:
        - renderi rooms kot grid
        - vsaka soba naj ima onClick = redirect v sobo
        - dodaj grid item za novo sobo (na začetek)
    */

    const handleNewRoom = () => {
        socket.emit("createLobby")
    }

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
                key={i}
            >
                { room.id }
                <hr />
                { 
                    room.players.map(
                        (player, i) => <p key={i}>{player}</p>
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