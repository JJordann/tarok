import React, { useEffect } from 'react'
import Sound from '../../services/soundEffects'

import Card from '../Hand/Card'

import activeStyles from './Active.module.scss'

const Active = ({players, table, myIndex, stage}) => {

  useEffect(() => {
    Sound.putCard()
  }, [table.length])

  const modulo = (n, mod) => (((n % mod) + mod) % mod)

  const rotation = (index, card) => {
    const n = players.length

    if(index >= n)
      return n === 3 ? 90 : 60 // Talon card - Klop

    return modulo((card.player - myIndex), n) * (360 / n)
  }

  const Cards = table.map((entry, index) => {
    return (
      <div className={activeStyles.cardContainer} key={entry.card}>
        <div style={{transform: `rotate(${rotation(index, entry)}deg)`}}>
          <Card value={entry.card} />
        </div>
      </div>
    )
  }
    
  )

  return (
    <div className={activeStyles.container}>
      {Cards}
    </div>
  )
}

export default Active