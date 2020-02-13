async function baitFish(db, id, bait) {
    let sector = await db.findOne({ id })
    if (!sector) {
        const fish = require('./fish')
        sector = {
            'id': id,
            'fish': fish,
        }
    }
    const fishBait = sector.fish[bait]
    if (fishBait > 0.0) {
        sector.fish[bait] = fishBait + (1.0 / fishBait)
    } else {
        sector.fish[bait] = 1.0
    }
    await db.update({ id: sector.id }, sector, { upsert: true })
}

module.exports = baitFish