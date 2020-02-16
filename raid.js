async function startRaid(db, hp, players) {
    const title="Cool Fish Name"
    //Add the game to the db
    const newGame = await db.insert({
        title,
        hp,
        current_player:null,
        card_option: null,
        players,
        hands:null,
        deck:null,
        discards:null,
    })
    return newGame._id
}

async function startRound(db, _id) {
    let hands = {}
    let deck = shuffle([])
    let discards = []
    let current_player = 0

    //Start the round by distributing a card to each player
    players.forEach((player) => {
        hands[player] = deck.shift()
    })

    await db.update({ _id  }, {
        current_player,
        hands,
        deck,
        discards
    } , { upsert: true })
}

async function startTurn(db, _id){
    //get Game
    let game = await db.findOne({_id})
    //Give the player a second card
    game.card_option = game.deck.shift()
    let card_equipped = game.hands[game.current_player]
    let turnInfo="Discards: "
    turnInfo = game.discards.reduce((discards, card, index)=>`${discards}\n${index}. ${card}`, turnInfo)
    turnInfo = 
    `${turnInfo}
Your Hand:
1. ${card_equipped.name} (Equipped)
2. ${card_option.name} (Drawn)
View discard effects with \`effects\` or \`effect \\[card name\\]\`
Discard a card with \`play #\` or \`play [card name]\`
    `
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

    await db.update({ _id  }, game , { upsert: true })
    return turnInfo
}

async function startSpecialEffect(db, _id){}
async function resolveSpecialEffect(db, _id){}

async function resolveTurn(db, _id){
    //get Game
    let game = await db.findOne({_id})
    //Discard the card
    //Check for special effects
    //Remove necessary players from the round
    //Check to see if the game has ended
    //Yes
        //endRaid
    //No
        //starTurn
}

async function endRound(db, _id){
    let game = await db.findOne({_id})
    //Reduce the HP and Give the winner the Catch Token
    //While Raid has HP, start a round
}

async function endRaid(db, _id){
    let game = await db.findOne({_id})
    //Determine the winner, and reward them the Raid
}