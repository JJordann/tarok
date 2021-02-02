import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Hand from './Hand'
import Table from './Table'
import Chat from './Chat'
import getSocket from './global'
import Contracts from './Contracts'

import gameStyle from '../style/game.module.scss'

const Game = () => {
  const socket = getSocket()

  const [gameSummary, setGameSummary] = useState(null)

  const [state, setState] = useState({
    phase: "contracts",
    myIndex: 0,
    myName: "",    
    table: [],     // cards on table
    players: [],   // json: {name: string, contracts: string[]}
    hand: [],      // cards in hand
    playable: [],  // playable cards in hand
    cardsWon: [], 
    turn: false,    // is it my turn?
    playableContracts: []
  })

  useEffect(() => {
    // fetch connected users immediately after first render
    socket.emit('getState')

    socket.on('getState', s => {
      let _s = JSON.parse(s)
      console.log(_s)
      setState(_s)
    })

    socket.on("gameOver", info => {
      console.log(info)
      setGameSummary(info)
    })

    return () => {
      socket.off('getState')
      socket.off("gameOver")
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  let _style = {
    border: `10px solid ${ state.turn ? "green" : "gray" }`,
    margin: 20
  }

  let Summary = gameSummary == null ? null : 
    gameSummary.map(obj => <pre>{JSON.stringify(obj).replace(/,/g, "\n")}</pre>)


  // TODO spremeni v redirect al pa v nekaj lepšega
  let Tableandhand = 
    <div style={_style} >
      { state.phase === "contracts" ? <Contracts playable={state.playableContracts} /> : <Table cards={state.table} /> }
      <Hand cards={state.hand} playable={state.playable} />
    </div>

  //let myName = state.players[state.myIndex].name
  let myName = ""

  return (
    <div className={gameStyle.game} >
      <Chat myName={myName} />
      { gameSummary == null ? Tableandhand : Summary }
    </div>
  )
}

export default Game