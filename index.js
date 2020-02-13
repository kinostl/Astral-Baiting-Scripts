const Datastore = require('nedb-promises')
const db = Datastore.create('./fish.db')
const rhost = new require("@digibear/rhost-wrapper")({
    user: "#123",
    password: "xxxxxxxxxx",
    port: 2222,
    encode: true // On by default to fix an stunnel bug.
});

const calls = {
    'baitFish': async () => {
        const baitFish = require('./bait')
        const id = process.env.MUSHQ_A
        const bait = process.env.MUSHQ_B
        await baitFish(db, id, bait)
        calls['updateFish'](id)
    },
    'updateFish': async (id) => {
        let fish = await db.findOne({ id })
        fish = fish.fish
        fish = Object.keys(fish).sort((a, b) => fish[a] > fish[b]).slice(0, 4).join()
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