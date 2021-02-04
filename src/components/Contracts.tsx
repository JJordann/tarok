import React from 'react'
import getSocket from './global'

import contractStyle from '../style/contracts.module.scss'

const Contracts = ({ contracts }) => {

  const socket = getSocket()

  const handleContract = contract => {
    socket.emit('contract', contract)
    console.log(contract)
  }
    
  let Items = contracts.map((contract, index) =>
    <div>
      <button onClick={() => handleContract(contract)} key={index}>{contract}</button>
    </div>
  )

  return (
    <div className={contractStyle.container}>
      { Items }
    </div>
  )
}


export default Contracts