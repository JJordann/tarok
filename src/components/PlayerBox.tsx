import React from 'react'

import playerBoxStyle from '../style/playerBox.module.scss';

const PlayerBox = ({name, activity = null, hasTurn = false}) => {
  return (
    <div className={`${playerBoxStyle.box} ${hasTurn ? playerBoxStyle.active : ''}`}>
      <p>{name}</p>
      { (activity) ? <p>{activity}</p> : '' }
    </div>
  )
}

export default PlayerBox;