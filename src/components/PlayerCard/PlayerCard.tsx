import React from 'react'

import playerCardStyles from './PlayerCard.module.scss'

const PlayerCard = ({name, active}) => {

  return (
    <div className={playerCardStyles.playerCard}>
      <p>{name}</p>
      <div className={(active ?
          playerCardStyles.active : playerCardStyles.inactive)}>
      </div>
    </div>
  )
}

export default PlayerCard