import React from 'react'

import { getPlayerHashRGB } from '../../services/Player/Player'

import talonSwapStyles from './TalonSwap.module.scss'

const TalonSwap = ({players, turn, myIndex}) => {

  const choosingText = () => {
    if(myIndex === turn) {
      return 'Izmenjaj s talonom'
    }
    
    return <p>
      <span style={{color: `#${getPlayerHashRGB(players[turn].name)}`}}>
        {players[turn].name}
      </span>
      &nbsp;izmenjuje s talonom
    </p>
  }

  return (
    <div className={talonSwapStyles.container}>
      <h2>{choosingText()}</h2>
    </div>
  )
}

export default TalonSwap