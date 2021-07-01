import React from 'react'

import playerCardStyles from './PlayerCard.module.scss'

const PlayerCard = ({name, active, ...props}) => {

  return (
    <div className={`${playerCardStyles.playerCard} ${props.className}`}
      onClick={props.onClick}>
      <p>{name}</p>
      <div className={(active ?
          playerCardStyles.active : playerCardStyles.inactive)}>
      </div>
    </div>
  )
}

export default PlayerCard