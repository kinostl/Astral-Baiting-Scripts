const scrambleFish = require('./scramble')
const Datastore = require('nedb-promises')
let db = null

describe('empty sector', () => {
    beforeEach(() => {
        db = Datastore.create({ inMemoryOnly: true })
    })

    test('adds a new sector', async () => {
        let results = await db.findOne({ id: 1 })
        expect(results).toBeNull()
        results = await scrambleFish(db, 1, "Spass")
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

    test('reduce a lack of fish', async () => {
        let results = await db.findOne({ id: 1 })
        expect(results.fish["Astrofin"]).toBeCloseTo(0.0)
        await scrambleFish(db, 1, "Astrofin")
        results = await db.findOne({ id: 1 })
        expect(results.fish["Astrofin"]).toBeCloseTo(0.0)
    })

    test('reduce an existing fish', async () => {
        let results = await db.findOne({ id: 1 })
        expect(results.fish["Spass"]).toBeCloseTo(1.0)
        await scrambleFish(db, 1, "Spass")
        results = await db.findOne({ id: 1 })
        expect(results.fish["Spass"]).toBeCloseTo(0.7)
    })
})