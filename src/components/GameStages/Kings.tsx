import React from 'react'

import Card from '../Hand/Card'

import { chooseKing } from '../../services/APIWrapper/GameWrapper'

import kingsStyles from './Kings.module.scss'
import { getPlayerHashRGB } from '../../services/Player/Player'

const kings = ['kara_kralj', 'kriz_kralj', 'pik_kralj', 'srce_kralj']

const Kings = ({players, myIndex, turn}) => {

  const handleClick = (king) => {
    chooseKing(king)
  }

  const choosingText = () => {
    if(myIndex === turn) {
      return 'Izberi kralja'
    }
    
    return <p>
      <span style={{color: `#${getPlayerHashRGB(players[turn].name)}`}}>
        {players[turn].name}
      </span>
      &nbsp;kliče kralja
    </p>
  }

  const Kings = kings.map((king) =>
    <Card value={king} key={king} onClick={() => handleClick(king)} />
  )

  return (
    <div className={kingsStyles.container}>
      <h2>{choosingText()}</h2>
      <div className={kingsStyles.cardContainer}>
        {Kings}
      </div>
    </div>
  )
}

export default Kings