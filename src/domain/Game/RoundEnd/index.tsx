import React from 'react'

import roundEndStyle from './style.module.scss'

/*
    player name
    player score sum
    player dosežene napovedi
    player pobrane karte (mogoče)
*/

const RoundEnd = ({ players }) => {

  let Scores = players.map(p => 
    <div className={roundEndStyle.scoreWrapper}>
      <div>
        { p.name }
      </div>
      <div>
        { p.scores[p.scores.length - 1] }
      </div>
    </div>
  )

  return (
    <div>
      <div className={roundEndStyle.header}> Rezultati runde </div>
      <hr />
      <div className={roundEndStyle.wrapper}>
        { Scores }
      </div>
    </div>
  )  
}

export default RoundEnd