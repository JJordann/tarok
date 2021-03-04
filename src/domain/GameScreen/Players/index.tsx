import React from 'react'

import playersStyle from './style.module.scss'

const Players = ({ players, activeIndex }) => {

  const getStyle = (index) => {
    return (index === activeIndex) ?
      `${playersStyle.playerBox} ${playersStyle.active}` : playersStyle.playerBox
  }

  const Players = players.map((player, index) =>
    <div className={ getStyle(index) } key={index}>
      <p>{ player[0] }</p>
      <span>{ player[1] }</span>
    </div>
  )

  return (
    <div className={playersStyle.wrapper}>
      { Players }
    </div>
  )
}

export default Players