import random
from deck import *
from functools import reduce


def suit(card):
    return card.split("_")[0]


def rank(card):
    return card.split("_")[1]


def cards(table):
    return [c["card"] for c in table]


def cardValue(card):
    if "kraljica" in card:
        return 4
    if "kralj" in card or card in ["tarok_22", "tarok_1", "tarok_21"]:
        return 5
    if "konj" in card:
        return 3
    if "poba" in card:
        return 2
    else:
        return 1


def keyRed(card):
    if cardValue(card) == 1:
        return -int(rank(card))
    else:
        return cardValue(card)


def keyBlack(card):
    if cardValue(card) == 1:
        return int(rank(card))
    else:
        return 10 + cardValue(card)


def orderHand(cards):
    return (
        sorted([c for c in cards if suit(c) == "kara"], key=keyRed)
        + sorted([c for c in cards if suit(c) == "srce"], key=keyRed)
        + sorted([c for c in cards if suit(c) == "pik"], key=keyBlack)
        + sorted([c for c in cards if suit(c) == "kriz"], key=keyBlack)
        + sorted([c for c in cards if suit(c) == "tarok"], key=lambda c: int(rank(c)))
    )


orderedDeck = orderHand(deck)


def dealCards(deck, nPlayers):
    random.shuffle(deck)
    talon = deck[0:6]
    handSize = round(48 / nPlayers)
    hands = []
    for i in range(0, nPlayers):
        start = 6 + i * handSize
        end = start + handSize
        hands.append(deck[start:end])
    return (talon, hands)


def playableRegular(hand, table, nPlayers):
    # if table is empty, any card can be played
    if table == [] or len(table) == nPlayers:
        return hand

    if suit(table[0]) != "tarok":
        if any(suit(table[0]) == suit(card) for card in hand):
            # if first card on table is not a tarot and player has card of same suit in hand,
            # return all cards of the same suit
            return [card for card in hand if suit(card) == suit(table[0])]
        elif any(suit(card) == "tarok" for card in hand):
            # else, if player has a tarot card, return all tarot cards in hand
            return [card for card in hand if suit(card) == "tarok"]
        else:
            return hand

    # card on table is a tarot card
    # if player has any tarot card in hand, return all tarot cards
    if any(suit(card) == "tarok" for card in hand):
        return [card for card in hand if suit(card) == "tarok"]
    else:
        # card on table is tarot, player does not have any tarot cards, return all cards
        return hand


def playableNadigravanje(hand, table, nPlayers):
    # if player has a higher ranking card, they must play it
    _playable = playableRegular(hand, table, nPlayers)
    if len(table) == 0:
        return _playable

    def isHigher(a, b):
        return suit(a) == suit(b) and orderedDeck.index(a) > orderedDeck.index(b)

    higher = [c for c in _playable if isHigher(c, table[0])]

    if higher != []:
        return higher
    else:
        return _playable


def playable(hand, table, nPlayers, gameType):
    if gameType in ["pikolo", "berac", "odprti_berac", "klop"]:
        # "pravilo nadigravanja"
        return playableNadigravanje(hand, table, nPlayers)
    else:
        return playableRegular(hand, table, nPlayers)


def dominantSuit(table):
    return suit(next(card for card in table if "tarok" not in card))


def takes(table):
    if any("tarok" in card for card in table):
        # if table contains tarot card, return highest rank among tarot cards
        cand = [c for c in table if "tarok" in c]
        return table.index(max(cand, key=lambda c: int(rank(c))))

    # if table does not contain tarot card, return maximum for the
    # among cards of dominant suit orderHand ordering
    global orderedDeck
    cand = [c for c in table if suit(c) == dominantSuit(table)]
    return table.index(max(cand, key=orderedDeck.index))


tests = [
    ["kara_1", "pik_kralj", "srce_kralj", "kara_poba"],
    ["kara_dama", "tarok_1", "kara_kralj", "pik_kralj"],
    ["pik_konj", "srce_kralj", "kara_kralj", "pik_7"],
    ["tarok_1", "tarok_2", "tarok_12", "tarok_3"],
    ["kara_1", "pik_kralj", "pik_poba", "pik_kraljica"],
    ["kara_4", "kara_3"],
]


def score(cards):
    return sum(map(cardValue, cards)) - 2 * int(len(cards) / 3)


def pagatUltimo(table):
    if table[takes(table)] == "tarok_1":
        return takes(table)
    else:
        return -1
