import React from 'react'
import getSocket from './global'

const Talon = ({ cardGroups }) => {

    const socket = getSocket()

    const handleOnClick = index => {
        socket.emit("chooseTalon", index)
    }


        // polepši to sranje 
    return (
        <div style={{display: "flex", flexDirection: "row"}}>
            {
                cardGroups.map((group, index) => 
                <div style={{border: "1px solid black", padding: 5}}>
                    { group.map(card => 
                        <div onClick={() => handleOnClick(index)}
                        style={{border: "1px solid black", margin: 5}}>
                            [{card}]
                        </div>) 
                    }
                </div>)
            }
        </div>
    )
}

export default Talon