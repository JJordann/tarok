// A hand is valid if it contains at least one tarok
export const validHand = (hand: string[]) => hand.some(card => card.startsWith('tarok'))