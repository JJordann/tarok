import { getEmptyGameState } from './GameState'

import PlayMoreCheck from './phases/PlayMoreCheck'
import Bid from './phases/Bid'
import CallKing from './phases/CallKing'
import Talon from './phases/Talon'
import Announcements from './phases/Announcements'
import Tricks from './phases/Tricks'

export const Tarok = {
  setup: getEmptyGameState,

  phases: {

    playMoreCheck: PlayMoreCheck,

    bid: Bid,

    callKing: CallKing,

    talon: Talon,

    announcements: Announcements,

    tricks: Tricks

  },

  minPlayers: 3,
  maxPlayers: 4
}