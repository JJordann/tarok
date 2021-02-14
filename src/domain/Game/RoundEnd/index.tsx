import React from 'react'

import roundEndStyle from './style.module.scss'

/*
    player name
    player score sum
    player dosežene napovedi
    player pobrane karte (mogoče)
*/

const RoundEnd = ({ scores }) => {

  let nicejson = o => Object.entries(o).map(entry => `${entry[0]} ~ ${entry[1]}`).join("\n")

  let Scores = scores.map(s => 
    <div className={roundEndStyle.scoreWrapper}>
      <pre>
        { nicejson(s) }
      </pre>
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