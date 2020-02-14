async function scrambleFish(db, id, bait) {
    let sector = await db.findOne({ id })
    if (!sector) {
        const fish = require('./fish')
        sector = {
            'id': id,
            'fish': fish,
        }
    }
    const fishBait = sector.fish[bait]
    sector.fish[bait] = fishBait - 0.3
    if (sector.fish[bait] < 0.0) {
        sector.fish[bait] = 0.0
    }
    await db.update({ id: sector.id }, sector, { upsert: true })
}

module.exports = scrambleFish