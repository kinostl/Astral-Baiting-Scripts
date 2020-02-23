async function startRaid(db, hp, players) {
    const title="Cool Fish Name"
    //Add the game to the db
    const newGame = await db.insert({
        title,
        hp,
        current_player:null,
        current_target:null,
        card_option: null,
        card_equipped: null,
        card_in_effect: null,
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
    })

    return hands
}

async function startTurn(db, _id){
    //get Game
    let game = await db.findOne({_id})
    //Give the player a second card
    game.card_equipped = game.hands[game.current_player]
    game.card_option = game.deck.shift()
    let turnInfo =
`==Discards==
${game.discards.map((card, index)=>`${index+1}. ${card}`).join('\n')}

==Your Hand==
1.(Equipped) ${game.card_equipped.name} 
2.(Drawn)    ${game.card_option.name} 
View discard effects with \`effects\` or \`effect \\[card name\\]\`
Discard a card with \`play #\` or \`play \\[card name\\]\``

    await db.update({ _id  }, game )
    return turnInfo
}

async function resolveStart(db, _id, choice){
    //get Game
    let game = await db.findOne({_id})
    //Discard the card
    let chosen=null
    let discard=null
    if(choice == '1' || choice == game.card_equipped){
        chosen = game.card_equipped
        discard = game.card_option
    }
    if(choice == '2' || choice == game.card_option){
        chosen = game.card_option
        discard = game.card_equipped
    }

    if(chosen && discard){
        game.card_equipped=null
        game.card_option=null
        game.hands[game.current_player]=chosen
        game.card_in_effect=discard
    }else{
        return "Not a card option. Please choose 1 or 2."
    }
}

async function startSpecialEffect(db, _id){}
async function resolveSpecialEffect(db, _id, choice){}

async function resolveTurn(db, _id){
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