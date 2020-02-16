async function baitFish(db, _id, bait) {
    let sector = await db.findOne({ _id })
    if (!sector) {
        const fish = require('./fish')
        sector = {
            '_id': _id,
            'fish': fish,
        }
    }
    const fishBait = sector.fish[bait]
    if (fishBait > 0.0) {
        sector.fish[bait] = fishBait + (1.0 / fishBait)
    } else {
        sector.fish[bait] = 1.0
    }
    await db.update({ _id: sector._id }, sector, { upsert: true })
}

module.exports = baitFish