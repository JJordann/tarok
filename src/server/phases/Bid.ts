import { dealCards, shuffleDeck } from '../Deck'
import { CARDS_ORDERED } from '../GameState'

const startNewRound = (G: any, ctx: any) => {
  const dealt = dealCards(shuffleDeck(CARDS_ORDERED, ctx), ctx)

  G.hands = dealt.hands
  G.talon = dealt.talon
  G.table = []
}

const Bid = {
  onBegin: startNewRound,

  // This is the initial phase of the game
  start: true
}

export default Bid