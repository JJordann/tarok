import { GameState, TALON_LENGTH } from './GameState'
import { validHand } from './Hand'

// Fisher-Yates
export const shuffleDeck = (deck: string[], ctx) => {
  const shuffledCards = [...deck]

  for(let i = shuffledCards.length - 1; i >= 0; i--) {
    let randomCard = Math.floor(ctx.random.Number() * shuffledCards.length)
    
    let tmp = shuffledCards[i]
    shuffledCards[i] = shuffledCards[randomCard]
    shuffledCards[randomCard] = tmp
  }

  return shuffledCards
}

export const dealCards = (shuffledCards: string[], ctx): GameState => {
  const hands: string[][] = new Array(ctx.numPlayers).fill(null).map(hand => [])
  const talon = shuffledCards.slice(0, TALON_LENGTH)

  for(let i = TALON_LENGTH; i < shuffledCards.length; i++) {
    let playerIndex = i % ctx.numPlayers

    hands[playerIndex].push(shuffledCards[i])
  }

  for(let hand of hands) {
    if(!validHand(hand)) {
      return dealCards(shuffledCards, ctx)
    }
  }

  return {
    table: [],
    talon: talon,
    hands: hands,
    scores: []
  }
}