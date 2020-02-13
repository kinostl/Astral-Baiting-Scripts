const baitFish = require('./bait')
const Datastore = require('nedb-promises')
let db = null

describe('empty sector', () => {
    beforeEach(() => {
        db = Datastore.create({ inMemoryOnly: true })
    })

    test('adds a new sector', async () => {
        let results=await db.findOne({id:1})
        expect(results).toBeNull()
        results = await baitFish(db, 1, "Spass")
        expect(results).not.toBeNull()
    })
})

describe('existing sector', () => {
    beforeEach(async () => {
        const fish = require('./fish')
        fish['Spass'] = 1
        db = Datastore.create({ inMemoryOnly: true })
        await db.insert({
            id: 1,
            fish: fish
        })
    })

    test('initalizes a fish', async () => {
        let results=await db.findOne({id:1})
        expect(results.fish["Astrofin"]).toBeCloseTo(0.0)
        await baitFish(db, 1, "Astrofin")
        results=await db.findOne({id:1})
        expect(results.fish["Astrofin"]).toBeCloseTo(1.0)
    })

    test('increases existing fish', async () => {
        let results=await db.findOne({id:1})
        expect(results.fish["Spass"]).toBeCloseTo(1.0)
        await baitFish(db, 1, "Spass")
        results=await db.findOne({id:1})
        expect(results.fish["Spass"]).toBeCloseTo(2.0)
    })
})