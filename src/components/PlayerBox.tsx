import React from 'react'

import playerBoxStyle from '../style/playerBox.module.scss';

const PlayerBox = ({name, activity = null}) => {
  return (
    <div className={playerBoxStyle.box}>
      <p>{name}</p>
      { (activity) ? <p>{activity}</p> : '' }
    </div>
  )
}

export default PlayerBox;