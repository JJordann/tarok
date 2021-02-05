import React from "react"

import roundEndStyles from '../style/roundEnd.module.scss'

/*
    player name
    player score sum
    player dosežene napovedi
    player pobrane karte (mogoče)
*/

const RoundEnd = ({ players }) => {




    return (
        <div className={roundEndStyles.wrapper}>
            Round end
        </div>
    )
    
}


export default RoundEnd