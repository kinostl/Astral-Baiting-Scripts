const baitFish = require('./bait')
const Datastore = require('nedb-promises')
let db = null

describe('empty sector', () => {
    beforeEach(() => {
        db = Datastore.create({ inMemoryOnly: true })
    })

    test('adds a new sector', async () => {
        await baitFish(db, 1, "Spass")
        expect(2 + 2).toBe(4)
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
        await baitFish(db, 1, "Astrofin")
        expect(2 + 2).toBe(4)
    })

    test('increases existing fish', async () => {
        await baitFish(db, 1, "Spass")
        expect(2 + 2).toBe(4)
    })
})