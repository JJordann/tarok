import { Client } from 'boardgame.io/react'
import { Tarok } from '../server/Game'

const App = Client({ game: Tarok })

export default App