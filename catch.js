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
    let rollTable = fishOptions.reduce((acc, curr)=>{
        acc[curr]=fish[curr]
        if(acc['last_value']){
            acc[curr]+=acc['last_value']
        }
        if(acc[curr]>50.0){
            acc[curr]=50.0
        }
        acc['last_value'] = acc[curr]
        return acc
    }, {'last_value':null})
    if(rollTable['last_value'] < 50.0){
        rollTable['nothing']=50.0
    }
    delete rollTable['last_value']
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
            const roll = random(0,50,true)
            //get fish from rollTable here
            const caughtFish = Object.keys(rollTable)
            .filter((e)=>{rollTable[e] <= roll})
            .shift()


            //if they catch one, add it to their score
            //reduce the chance of that fish on the bait table
            //inform them of their catch with a pemit
            //continue to the next player
        })
    }
})