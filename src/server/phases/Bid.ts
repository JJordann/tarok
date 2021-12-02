import { dealCards, shuffleDeck } from '../Deck'
import { CARDS_ORDERED, GameState } from '../GameState'

const startNewRound = (G: any, ctx: any) => {
  const dealt = dealCards(shuffleDeck(CARDS_ORDERED, ctx), ctx)

  G.hands = dealt.hands
  G.talon = dealt.talon
  G.table = []
}

export default {
  onBegin: startNewRound,

  // This is the initial phase of the game
  start: true
}