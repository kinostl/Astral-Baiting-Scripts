const rhost = new require("@digibear/rhost-wrapper")({
        user: "#123",
        password: "xxxxxxxxxx",
        port: 2222,
        encode: true // On by default to fix an stunnel bug.
    });

const Datastore = require('nedb-promises')
const db = Datastore.create('./fish.db')

module.exports={
    rhost,
    db,
}