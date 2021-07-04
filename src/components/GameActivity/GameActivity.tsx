import React, { useState } from 'react'

import Contracts from '../GameStages/Contracts'
import Talon from '../GameStages/Talon'

import gameActivityStyles from './GameActivity.module.scss'

const GameActivity = ({state}) => {
  
  let CurrentActivity = <></>
  switch(state.stage) {
    case 'gameType': CurrentActivity =
        <Contracts playableContracts={state.playableGames}
          show={(state.turn === state.myIndex)} />
      break
    case 'chooseTalon': CurrentActivity =
      <Talon talon={state.talon} players={state.players}
        myIndex={state.myIndex} turn={state.turn} />
  }

  return (
    <div className={gameActivityStyles.container}>
      {CurrentActivity}
    </div>
  )
}

export default GameActivity