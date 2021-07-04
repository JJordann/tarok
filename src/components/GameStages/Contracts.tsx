import React from 'react'

import { GameTypes } from './GameTypes'

import contractsStyles from './Contracts.module.scss'
import { chooseContract } from '../../services/APIWrapper/GameWrapper'

const Contracts = ({playableContracts, show}) => {

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