async function startRaid(db, catch_rating, players) {
    const title="Cool Fish Name"
    //Add the game to the db
    const newGame = await db.insert({
        title,
        catch_rating,
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
    deck.shift()
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
    //if card_equipped is warp core
    //check to see if it explodes
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
        await db.update({ _id }, game)
        return startSpecialEffect(game)
    }else{
        return "Not a card option. Please choose 1 or 2."
    }
}

function startSpecialEffect(game){
    //These just need to return a string telling targetting information.
    //No need to actually edit the game.
    let effects={
        "phasers": 'Phasers ready! Who are you going to shoot?',
        "sensor_array": 'Sensors Array aligned! Who\'s power grid are you going to scan?',
        "computer": 'Wide network scan engaged! Who would you like to disable?',
        "shields": 'Shields activated! You\'re safe from damage until your next turn.',
        "scrambler": 'Scramblers configured! Who\'s power grid are you going to redistribute?',
        "teleporters": 'Teleporters fully powered! Who are you going to swap places with?',
        "warp_core": 'Warp core ejected! You\'re safe from that exploding now.',
        "tractor_beam": 'Tractor beam hold lost! You\'re out of the round.',
    }

    if(['warp_core', 'tractor_beam', 'shield'].indexOf(game.card_in_effect) > -1){
        //Just give this back to the handler and let it call resolveTurn
        return [false, effects[game.card_in_effect]]
    }

    return [true,
`
${effects[game.card_in_effect]}

==Available Targets==
${game.players.map((player, index)=>`#${index}. ${player.name}`)}

${game.card_in_effect != 'phasers' ?
    `Choose your target with \`target #\`` :
    `Choose your target  and guess with \`target # \[Card\]\``
    }
`
    ]
}
async function resolveSpecialEffect(db, _id, choice){
    let game = await db.findOne({_id})
    //Effects
    //Remove necessary players from the round
    let effects={
        "phasers": (game, choice) => { },
        "sensor_array": (game, choice) => { },
        "computer": (game, choice) => { },
        "scrambler": (game, choice) => { },
        "teleporters": (game, choice) => { },
    }
    let result = effects[game.card_in_effect](game, choice)
    [valid, game, result] = result
    if (valid) {
        await db.update({ _id }, game)
        return resolveTurn(game, result)
    }
    return result
}

function resolveTurn(game, result){
    //Check to see if the Round has ended
    //Yes
        //endRound
    //No
        //starTurn
}

async function endRound(db, _id){
    let game = await db.findOne({_id})
    //Give the winner the Catch Token
    //While no one has reached the Catch Rating, start a round
}

async function endRaid(db, _id){
    let game = await db.findOne({_id})
    //Determine the winner, and reward them the Raid
}