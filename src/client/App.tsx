import { Client } from 'boardgame.io/react'
import { Tarok } from '../server/Game'

const App = Client({
  game: Tarok,
  numPlayers: 4
})

export default App