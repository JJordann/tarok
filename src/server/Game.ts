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
const shuffleDeck = (deck: string[], ctx) => {
  const shuffledCards = [...deck]

  for(let i = shuffledCards.length - 1; i >= 0; i--) {
    let randomCard = Math.floor(ctx.random.Number() * shuffledCards.length)
    
    let tmp = shuffledCards[i]
    shuffledCards[i] = shuffledCards[randomCard]
    shuffledCards[randomCard] = tmp
  }

  return shuffledCards
}

interface Dealt {
  talon: string[],
  hands: string[][]
}

// A hand is valid if it contains at least one tarok
const validHand = (hand: string[]) => hand.some(card => card.startsWith('tarok'))

const dealCards = (ctx): Dealt => {
  const shuffledCards = shuffleDeck(CARDS, ctx)

  const hands = new Array(ctx.numPlayers).fill(null).map(hand => [])
  const talon = shuffledCards.slice(0, TALON_LENGTH)

  for(let i = TALON_LENGTH; i < shuffledCards.length; i++) {
    let playerIndex = i % ctx.numPlayers

    hands[playerIndex].push(shuffledCards[i])
  }

  for(let hand of hands) {
    if(!validHand(hand)) {
      return dealCards(ctx.numPlayers)
    }
  }

  return {
    talon: talon,
    hands: hands
  }
}

const setupGameState = (ctx) => {
  return {
    table: [],
    talon: [],
    hands: [],
    scores: []
  }
}

export const Tarok = {
  setup: setupGameState,

  phases: {

    playMoreCheck: {
      moves: {

      },
      next: 'bid'
    },

    bid: {
      onBegin: (G, ctx) => {
        const dealt = dealCards(ctx)

        G.talon = dealt.talon
        G.hands = dealt.hands
      },
      start: true
    },

    callKing: {
      next: 'talon'
    },

    talon: {
      next: 'announcements'
    },

    announcements: {
      next: 'tricks'
    },

    tricks: {
      moves: {
        playCard: (cardId: string) => {
          console.log('Hello')
        }
      },
      next: 'playMoreCheck'
    }

  },

  minPlayers: 3,
  maxPlayers: 4
}