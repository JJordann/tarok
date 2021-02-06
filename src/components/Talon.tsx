import React from 'react'
import getSocket from './global'


import talonStyles from '../style/talon.module.scss'

const Talon = ({ cardGroups }) => {

    const socket = getSocket()

    const handleOnClick = index => {
        socket.emit("chooseTalon", index)
    }

    const Groups = cardGroups.map((group, index) => 
            <div className={talonStyles.cardGroup}
                 onClick={() => handleOnClick(index)}>
                    { 
                        group.map(card => 
                            <div className={talonStyles.card}> {card} </div>) 
                    }
            </div>)

        // polepši to sranje 
    return (
        <div className={talonStyles.wrapper}>
            { Groups }
        </div>
    )
}

export default Talon