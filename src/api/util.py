import random
from deck import *
from functools import reduce


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



def playable(hand, table):
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



def dominantSuit(table):
    return suit(next(card for card in table if "tarok" not in card))



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
    return (sorted([c for c in cards if suit(c) == "kara"], key=keyRed)
    + sorted([c for c in cards if suit(c) == "srce"], key=keyRed)
    + sorted([c for c in cards if suit(c) ==  "pik"], key=keyBlack)
    + sorted([c for c in cards if suit(c) == "kriz"], key=keyBlack)
    + sorted([c for c in cards if suit(c) == "tarok"], key=rank))



orderedDeck = orderHand(deck)

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
    ["kara_4", "kara_3"]
]



#for table in tests: 
    #print(table, " -> ", table[takes(table)])



def score(cards):
    return sum(map(cardValue, cards)) - 2 * int(len(cards) / 3)



def trula(cards):
    return "tarok_1" in cards and "tarok_21" in cards and "tarok_22" in cards



def trulapagat(cards):
    return trula(cards) and pagatUltimo(cards)



def kralji(cards):
    return len([card for card in cards if rank(card) == "kralj"]) == 4



def valat(cards):
    return len(cards) == 48



def contractBonus(cards):
    bonus = []

    if valat(cards): 
        bonus.append({"bonus": "Valat", "value": 250})

    if trulapagat(cards):
        bonus.append({"bonus": "Trulapagat", "value": 35})
    elif trula(cards):
        bonus.append({"bonus": "Trula", "value": 10})

    if kralji(cards):
        bonus.append({"bonus": "Kralji", "value": 10})

    return bonus




def concludeGame(gameState):
    print("---- GAME OVER ----")

    for player in gameState["players"]:
        player["contractBonus"] += contractBonus(player["cardsWon"])
        for contract in player["contractBonus"]:
            player["score"] += contract["value"]

    ranked = sorted(gameState["players"], key=lambda p: score(p["cardsWon"]), reverse=True)
    return [
        {
            "name": player["name"],
            "place": index,
            "score": score(player["cardsWon"]),
            "cardsWon": player["cardsWon"],
            "contractBonus": player["contractBonus"]
        } for index, player in enumerate(ranked)
    ]



def pagatUltimo(table):
    if table[takes(table)] == "tarok_1":
        return takes(table)
    else:
        return -1




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
    state = {
        "phase": "contracts",    # contracts / active / finished
        "table": [],
        "talon": talon,
        "players": [
            {
                "name": user["name"],
                "sid": user["sid"],
                "hand": hands[i],
                "cardsWon": [],
                "turn": (i == 0),
                "contractBonus": [],
                "contracts": []
            } for (i, user) in enumerate(connected)
        ]
    }
    connected = []
    return state
    


contracts = {
        "naprej": 0,
        "tri": 10,
        "solo_tri": 20,
        "dva": 20,
        "ena": 30,
        "solo_dva": 30,
        "solo_ena": 40,
        "solo_brez": 50,
        "pikolo": 60,
        "berac": 70,
        "odprti_berac": 80,
}


def highestContract(cs):
    return reduce(lambda cmax, el: el if contracts[el] > contracts[cmax] else cmax, cs)




def playableContracts(gameState):
    playedContracts = [c for p in gameState["players"] for c in p["contracts"]]

    global contracts
    if playedContracts == []:
        return list(contracts.keys())

    highest = highestContract(playedContracts)
    return [c for c in contracts.keys() if contracts[c] > contracts[highest]]