const CARDS = [
  'kara_4', 'kara_3', 'kara_2', 'kara_1',
  'kara_poba', 'kara_konj', 'kara_kraljica', 'kara_kralj',
  'kriz_7', 'kriz_8', 'kriz_9', 'kriz_10',
  'kriz_poba', 'kriz_konj', 'kriz_kraljica', 'kriz_kralj',
  'pik_7', 'pik_8', 'pik_9', 'pik_10',
  'pik_poba', 'pik_konj', 'pik_kraljica', 'pik_kralj',
  'srce_4', 'srce_3', 'srce_2', 'srce_1',
  'srce_poba', 'srce_konj', 'srce_kraljica', 'srce_kralj',
  'tarok_1', 'tarok_2', 'tarok_3', 'tarok_4',
  'tarok_5', 'tarok_6', 'tarok_7', 'tarok_8',
  'tarok_9', 'tarok_10', 'tarok_11', 'tarok_12',
  'tarok_13', 'tarok_14', 'tarok_15', 'tarok_16',
  'tarok_17', 'tarok_18', 'tarok_19', 'tarok_20',
  'tarok_21', 'tarok_22'
]

const TALON_LENGTH = 6

// Fisher-Yates
const shuffleCards = (cards: string[]) => {
  const shuffledCards = [...cards]

  for(let i = shuffledCards.length - 1; i >= 0; i--) {
    let randomCard = Math.floor(Math.random() * shuffledCards.length)
    
    let tmp = shuffledCards[i]
    shuffledCards[i] = shuffledCards[randomCard]
    shuffledCards[randomCard] = tmp
  }

  return shuffledCards
}

const dealCards = (shuffledCards: string[], numberOfPlayers: number) => {
  const hands = new Array(4).fill(null).map(hand => [])
  const talon = shuffledCards.slice(0, TALON_LENGTH)

  for(let i = TALON_LENGTH; i < shuffledCards.length; i++) {
    let playerIndex = i % numberOfPlayers

    hands[playerIndex].push(shuffledCards[i])
  }

  return {
    hands: hands,
    talon: talon
  }
}

export const Tarok = {
  setup: (ctx, setupData) => {

    console.log(setupData)

    console.log(ctx)
    const shuffledCards = shuffleCards(CARDS)
    return dealCards(shuffledCards, ctx.numPlayers)
  },

  moves: {
    playCard: (G, ctx, id) => {
      return G.cards[id]
    }
  }
}