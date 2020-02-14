const { rhost, db } = require('./config')
const shuffle = require('lodash/shuffle')
const random = require('lodash/random')
//occurs hourly via crontab
let rooms = await db.find({
    id: { $exists: true },
    fish: { $exists: true }
})
//loop through every room and in each one
let roomPromises = rooms.reduce((room) => {
    const fish = room.fish
    const fishOptions = Object.keys(fish).filter((e)=>fish[e]>0.0).sort((a, b) => fish[a] > fish[b])
    const rollTable = []
    return async () => {
        //get the lcon(players)
        let players = await rhost.get(`lcon(${room.id}/player)`)
        players=players.split(' ')
        //randomize the list for fairness
        players = shuffle(players)
        //(future update) prioritize players who have ship parts that do that
        //loop through the players and for each one
        players.forEach((player) => {
            //roll on the table for a fish
            const roll = random(1,50,true)
            //get fish from rollTable here


            //if they catch one, add it to their score
            //reduce the chance of that fish on the bait table
            //inform them of their catch with a pemit
            //continue to the next player
        })
    }
})