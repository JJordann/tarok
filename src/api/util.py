import random
from deck import *
from functools import reduce



# gameState, card, playerSID -> gameState
def playCard(gameState, card, player):
    return None


# ce si prvi na vrsti, lahko vrzes katerokoli
# ce nisi:
#   fst = prva karta na mizi
#   ce imas v roki karto iste barve kot fst:
#       lahko vrzes samo karto iste barve kot fst
#   sicer ce imas taroka:
#       vrzes taroka
#   sicer: 
#       lahko vrzes katerokoli karto


def suit(card):
    return card.split('_')[0]


def rank(card): 
    return card.split('_')[1]


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


def playable(table, hand):
    # if table is empty, any card can be played
    if table == []:
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




# ordering "a takes b"
def takesOrder(a, b):
    if "tarok" in a and "tarok" in b:
        # both cards are tarots, higher ranking takes
        return int(rank(a)) > int(rank(b))

    # one card is tarot and the other is not, tarot takes
    if "tarok" in a and "tarok" not in b:
        return True
    if "tarok" not in a and "tarok" in b:
        return False

    # neither card is tarot
    if not (cardValue(a) == 1 and cardValue(b) == 1):
        # not both cards are number cards, return more valuable one
        return cardValue(a) > cardValue(b)
    else:
        # both cards are number cards, return higher rank
        return rank(a) > rank(b)
     


def dominantSuit(table):
    return suit(next(card for card in table if "tarok" not in card))


# returns index of player who takes
def takes(table):

    # no tarot cards - highest rank of dominant suit takes
    if not any("tarok" in card for card in table):
        candidates = [card for card in table if suit(card) == dominantSuit(table)]
    else:
        candidates = table

    # return maximum for the takesOrder ordering among candidates
    highest = reduce(lambda a, b: a if takesOrder(a, b) else b, candidates)
    return table.index(highest)



tests = [
    ["kara_1", "pik_kralj", "srce_kralj", "kara_poba"],
    ["kara_dama", "tarok_1", "kara_kralj", "pik_kralj"],
    ["pik_konj", "srce_kralj", "kara_kralj", "pik_7"],
    ["tarok_1", "tarok_2", "tarok_12", "tarok_3"]
]

for table in tests: 
    print(table, " -> ", table[takes(table)])



#table = ["tarok_1"]
#hand = ["srce_kralj", "pik_kralj", "kriz_kralj", "kara_kralj"]

#p = playable(table, hand)
#print(p)



def dealCards(deck, connected):
    random.shuffle(deck)
    talon = deck[0:6]
    nPlayers = len(connected)
    handSize = round(48 / nPlayers)
    hands = []
    for i in range(0, nPlayers):
        start = 6 + i * handSize
        end = start + handSize
        hands.append(deck[start:end])

    return (talon, hands)




def initGame(deck, connected):
    (talon, hands) = dealCards(deck, connected)
    return {
        "table": [],
        "talon": talon,
        "players": [
            {
                "name": user["name"],
                "sid": user["sid"],
                "hand": hands[i],
                "cardsWon": [],
                "turn": (i == 0)
            } for (i, user) in enumerate(connected)
        ]

    }
    




def score(cards):
    return sum(map(cardValue, cards)) - 2 * int(len(cards) / 3)


