import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Hand from './Hand'
import Table from './Table'
import Chat from './Chat'
import getSocket from './global'

import gameStyle from '../style/game.module.scss'

const Game = () => {
  const socket = getSocket()

  const [gameSummary, setGameSummary] = useState(null)

  const [state, setState] = useState({
    myName: "",    
    table: [],     // cards on table
    players: [],   // players in room
    hand: [],      // cards in hand
    playable: [],  // playable cards in hand
    cardsWon: [], 
    turn: false    // is it my turn?
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
      <Table cards={state.table} />
      <Hand cards={state.hand} playable={state.playable} />
    </div>

  return (
    <div className={gameStyle.game} >
      <Chat myName={state.myName} />
      { gameSummary == null ? Tableandhand : Summary }
    </div>
  )
}

export default Game