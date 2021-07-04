import React, { useState } from 'react'

import Contracts from '../GameStages/Contracts'

import gameActivityStyles from './GameActivity.module.scss'

const GameActivity = ({state}) => {
  
  let CurrentActivity = <></>
  switch(state.stage) {
    case 'gameType': CurrentActivity =
        <Contracts playableContracts={state.playableGames}
          show={(state.turn === state.myIndex)} />
      break
  }

  return (
    <div className={gameActivityStyles.container}>
      {CurrentActivity}
    </div>
  )
}

export default GameActivity