import React from 'react'
import { socket } from '../../../services/Socket'
import talonStyle from './style.module.scss'


const Talon = ({ cardGroups, chosen }) => {

    const handleOnClick = index => {
        socket.emit("chooseTalon", index)
    }


    const Groups = cardGroups.map((group, index) => 
            <div className={`${talonStyle.cardGroup} ${index === chosen ? talonStyle.selected : talonStyle.notselected}`}
                 onClick={() => handleOnClick(index)}>
                    { 
                        group.map(card => 
                            <div className={talonStyle.card}> {card} </div>) 
                    }
            </div>)

        // polepši to sranje 
    return (
        <div className={talonStyle.wrapper}>
            { Groups }
        </div>
    )
}

export default Talon