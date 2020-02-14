const { rhost, db } = require('./config')
const shuffle = require('lodash/shuffle')
const random = require('lodash/random')
//occurs hourly via crontab
let rooms = await db.find({
    id: { $exists: true },
    fish: { $exists: true }
})
//loop through every room and in each one
let roomPromises = rooms.map((room) => {
    const fish = room.fish
    const fishOptions = Object.keys(fish).filter((e) => fish[e] > 0.0).sort((a, b) => fish[a] > fish[b])
    let rollTable = fishOptions.reduce((acc, curr) => {
        acc[curr] = fish[curr]
        acc[curr] += acc['last_value']
        acc['last_value'] = acc[curr]
        return acc
    }, { 'last_value': 0.0 })
    if (rollTable['last_value'] < 50.0) {
        rollTable['nothing'] = 50.0
        rollTable['last_value'] = 50.0
    }
    const maxVal = rollTable['last_value']
    delete rollTable['last_value']
    return async () => {
        //get the lcon(players)
        let players = await rhost.get(`lcon(${room.id}/player)`)
        players = players.split(' ')
        //randomize the list for fairness
        players = shuffle(players)
        //(future update) prioritize players who have ship parts that do that
        //loop through the players and for each one
        players.forEach((player) => {
            //roll on the table for a fish
            const roll = random(0, maxVal, true)
            //get fish from rollTable here
            const caughtFish = Object.keys(rollTable)
                .filter((e) => { rollTable[e] >= roll })
                .shift()

            //if they catch one, add it to their score
            if (caughtFish != 'nothing') {
                //reduce the chance of that fish on the bait table
                await db.update({ id: room.id }, { $dec: {[`fish.${caughtFish}`]: 1.0}})
                //inform them of their catch with a pemit
                await rhost.post(`@pemit ${player}=You caught a ${caughtFish}`)
                //actually give them a fish somehow
            }
        })
    }
}, [])

Promise.all(roomPromises)