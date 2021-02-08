import React from "react"

import roundEndStyles from '../style/roundEnd.module.scss'

/*
    player name
    player score sum
    player dosežene napovedi
    player pobrane karte (mogoče)
*/

const RoundEnd = ({ players }) => {


    let Scores = players.map(p => 
        <div className={roundEndStyles.scoreWrapper}>
            <div>
                { p.name }
            </div>
            <div>
                { p.scores[p.scores.length - 1] }
            </div>
        </div>)


    return (
        <div>
            <div className={roundEndStyles.header}> Rezultati runde </div>
            <hr />
            <div className={roundEndStyles.wrapper}>
                { Scores }
            </div>
        </div>

    )
    
}


export default RoundEnd