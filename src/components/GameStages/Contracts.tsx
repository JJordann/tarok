import React, { useEffect } from 'react'

import { GameTypes } from './GameTypes'

import { chooseContract } from '../../services/APIWrapper/GameWrapper'

import Sound from '../../services/soundEffects'

import contractsStyles from './Contracts.module.scss'

const Contracts = ({playableContracts, show}) => {

  useEffect(() => {
    Sound.shuffleDeck()
  }, [])

  const List = playableContracts.map((contract, index) =>
    <div onClick={() => handleContract(contract)}>{GameTypes[contract]}</div>
  )

  const handleContract = (contract) => {
    chooseContract(contract)
  }

  return (
    <div className={contractsStyles.container}>
      {(show) ? List : <></>}
    </div>
  )
}

export default Contracts