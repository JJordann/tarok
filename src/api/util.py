import random
from deck import *
from functools import reduce





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

    # maximum for the takesOrder ordering among candidates
    highest = reduce(lambda a, b: a if takesOrder(a, b) else b, candidates)
    return table.index(highest)



tests = [
    ["kara_1", "pik_kralj", "srce_kralj", "kara_poba"],
    ["kara_dama", "tarok_1", "kara_kralj", "pik_kralj"],
    ["pik_konj", "srce_kralj", "kara_kralj", "pik_7"],
    ["tarok_1", "tarok_2", "tarok_12", "tarok_3"],
    ["kara_1", "pik_kralj", "pik_poba", "pik_kraljica"]
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



def playCard(gameState, card, player):
    sender = next(p for p in gameState["players"] if p["sid"] == player)

    if sender["turn"] != True:
        print("It's not your turn. Stop hacking.")
        return gameState

    if card not in playable(sender["hand"], gameState["table"]):
        print("Illegal move. Stop hacking.")
        return gameState

    nPlayers = len(gameState["players"])
    playerIndex = next(i for i,p in enumerate(gameState["players"]) if p["turn"] == True)

    # transfer played card from hand to table
    gameState["table"].append(card)
    gameState["players"][playerIndex]["hand"].remove(card)

    # transfer turn to next player
    gameState["players"][playerIndex]["turn"] = False
    gameState["players"][(playerIndex + 1) % nPlayers]["turn"] = True

    if len(gameState["table"]) < nPlayers:
        # round is not over
        return gameState
    
    # round is over, transfer table to round winner
    takesPlayer = (playerIndex + takes(gameState["table"])) % nPlayers
    gameState["players"][takesPlayer]["cardsWon"] += gameState["table"]

    if all(len(p["hand"]) == 0 for p in gameState["players"]):
        # players have no cards, game ends
        # check for pagat ultimo
        pagatIndex = pagatUltimo(gameState["table"])
        if pagatIndex > -1:
            pagatPlayer = (pagatIndex + pagatIndex) % nPlayers
            gameState["players"][pagatPlayer]["contractBonus"] += [{"bonus": "pagatUltimo", "value": 25}]
            print("PAGAT ULTIMO: ", gameState["players"][pagatPlayer]["name"])

    # after round ends, skip a player
    gameState["players"][(playerIndex + 1) % nPlayers]["turn"] = False
    gameState["players"][(playerIndex + 2) % nPlayers]["turn"] = True
    gameState["table"] = []
    return gameState



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
        "table": [],
        "talon": talon,
        "players": [
            {
                "name": user["name"],
                "sid": user["sid"],
                "hand": hands[i][0:2],
                "cardsWon": [],
                "turn": (i == 0),
                "contractBonus": [],
                "contracts": []
            } for (i, user) in enumerate(connected)
        ]
    }
    connected = []
    return state
    


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


#random.shuffle(deck)
#print(orderHand(deck))






