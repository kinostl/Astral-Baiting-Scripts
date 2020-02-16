async function startRaid(db, hp, players) {
    const title="Cool Fish Name"
    //Add the game to the db
    const newGame = await db.insert({
        title,
        hp,
        current_player:null,
        players,
        hands:null,
        deck:null,
    })
    return newGame._id
}

async function startRound(db, _id) {
    let hands = {}
    let deck = []
    let current_player = 0

    //Start the round by distributing a card to each player
    players.forEach((player) => {
        hands[player] = [sample(deck)]
        //remove card from deck
    })

    await db.update({ _id  }, {
        current_player,
        hands,
        deck
    } , { upsert: true })
}

async function startTurn(db, _id){
    //get Game
    let game = await db.findOne({_id})
    hands[currentPlayer].push(sample(deck))
    //Give the player a second card
    //Return a string that does all of the following.
        //Inform the player of the current board state
            /**
             * Discards:
             * 1. Phasers (Jin), 2. Warp Core (Daz), 3. ...
             * 
             * Your Hand:
             * 1. Phasers (Equipped)
             *     Value: 1
             *     Effect: Target another ship and name a Non-Phaser System. If target ship has that system active, they're out of the round
             * 2. Shields (Drawn)
             *     Value: 4
             *     Effect: Until your next turn, ignore all effects that target you.
             * 
             * View all effects with `effects`.
             * Discard a card with `play #`
             */
        //Ask them which card the discard
        //Ask them to make necessary choices

}

async function resolveTurn(db, _id){
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

async function endRound(db, _id){
    //Reduce the HP and Give the winner the Catch Token
    //While Raid has HP, start a round
}

async function endRaid(db, _id){
    //Determine the winner, and reward them the Raid
}