async function scrambleFish(db, _id, bait) {
    let sector = await db.findOne({ _id })
    if (!sector) {
        const fish = require('./fish')
        sector = {
            '_id': _id,
            'fish': fish,
        }
    }
    const fishBait = sector.fish[bait]
    sector.fish[bait] = fishBait - 0.3
    if (sector.fish[bait] < 0.0) {
        sector.fish[bait] = 0.0
    }
    await db.update({ _id: sector._id }, sector, { upsert: true })
}

module.exports = scrambleFish