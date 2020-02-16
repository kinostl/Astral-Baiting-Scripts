//Determine Raid's strength
async function startRaid(hp, players) {
    //Add the game to the db
}

async function startRound(gameId) {
    let deck = []
    let hands = {}
    let currentPlayerId = 0
    let currentPlayer = players[currentPlayerId]

    //Start the round by distributing a card to each player
    players.forEach((player) => {
        hands[player] = [sample(deck)]
        //remove card from deck
    })
}

async function startTurn(gameId){
    //get Game
    hands[currentPlayer].push(sample(deck))
    //Give the player a second card
    //Inform the player of the current board state
    //Ask them which card the discard
    //Ask them to make necessary choices

}

async function resolveTurn(gameId){
    //get Game
    //Remove necessary players from the round
    //Discard the card
    //Check for special effects
    //Check to see if the game has ended
    //Yes
        //endRaid
    //No
        //starTurn
}

async function endRound(gameId){
    //Reduce the HP and Give the winner the Catch Token
    //While Raid has HP, start a round
}

async function endRaid(gameId){
    //Determine the winner, and reward them the Raid
}