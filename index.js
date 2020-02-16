const {rhost, db} = require('./config')

const calls = {
    'baitFish': async () => {
        const baitFish = require('./bait')
        const _id = process.env.MUSHQ_A
        const bait = process.env.MUSHQ_B
        await baitFish(db, _id, bait)
        //remove the bait from their inventory
        calls['updateFish'](_id)
    },
    'scrambleFish': async () => {
        const scrambleFish = require('./scramble')
        const _id = process.env.MUSHQ_A
        const bait = process.env.MUSHQ_B
        await scrambleFish(db, _id, bait)
        //remove the scrambler from their inventory
        calls['updateFish'](_id)

    },
    'updateFish': async (_id) => {
        let fish = await db.findOne({ _id })
        fish = fish.fish
        fish = Object.keys(fish).filter((e)=>fish[e]>0.0).sort((a, b) => fish[a] > fish[b]).slice(0, 4).join()
        await rhost.post(`@set ${_id}=top_five_fish:${fish}`)
    }
}

async function makeCall() {
    const call = calls[process.env.MUSHQ_Z]
    if (call) {
        try {
            await call()
        } catch (e) {
            console.error(e)
        }
    }
}

makeCall()