import React from 'react'

import { chooseTalon } from '../../services/APIWrapper/GameWrapper'
import { getPlayerHashRGB } from '../../services/Player/Player'

import Card from '../Hand/Card'

import talonStyles from './Talon.module.scss'

const Talon = ({talon, players, myIndex, turn}) => {

  const Cards = talon.map((cardGroup, index) =>
    <div onClick={() => chooseTalon(index)} key={index}
      className={(myIndex === turn) ? talonStyles.active : talonStyles.inactive}>
      {cardGroup.map(card =>
        <Card value={card} key={card} />
      )}
    </div>
  )

  const choosingText = () => {
    if(myIndex === turn) {
      return 'Izberi talon'
    }
    
    return <p>
      <span style={{color: `#${getPlayerHashRGB(players[turn].name)}`}}>
        {players[turn].name}
      </span>
      &nbsp;izbira talon
    </p>
  }

  return (
    <div className={talonStyles.container}>
      <h2>{choosingText()}</h2>
      <div className={talonStyles.cardContainer}>
        {Cards}
      </div>
    </div>
  )
}

export default Talon