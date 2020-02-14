const {rhost, db} = require('./config')

const calls = {
    'baitFish': async () => {
        const baitFish = require('./bait')
        const id = process.env.MUSHQ_A
        const bait = process.env.MUSHQ_B
        await baitFish(db, id, bait)
        //remove the bait from their inventory
        calls['updateFish'](id)
    },
    'scrambleFish': async () => {
        const scrambleFish = require('./scramble')
        const id = process.env.MUSHQ_A
        const bait = process.env.MUSHQ_B
        await scrambleFish(db, id, bait)
        //remove the scrambler from their inventory
        calls['updateFish'](id)

    },
    'updateFish': async (id) => {
        let fish = await db.findOne({ id })
        fish = fish.fish
        fish = Object.keys(fish).filter((e)=>fish[e]>0.0).sort((a, b) => fish[a] > fish[b]).slice(0, 4).join()
        await rhost.post(`@set ${id}=top_five_fish:${fish}`)
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