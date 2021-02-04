import React from 'react'
import getSocket from './global'

const Contracts = ({ contracts }) => {

  const socket = getSocket()

  const handleContract = contract => {
    socket.emit('contract', contract)
    console.log(contract)
  }
    
  let Items = contracts.map( c => 
    <div>
      <button onClick={() => handleContract(c)}>{c}</button>
      <br />
    </div>
  )

  return (
    <div>
      { Items }
    </div>
  )
}


export default Contracts