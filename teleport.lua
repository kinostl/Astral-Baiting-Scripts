local nk = require("nakama")

local function custom_rpc_func(ctx)
    local stats = {}
    local total = 100
    local chance = math.random(total)
    total = total - chance
    stats[1] = {name = "fish", chance = chance}
    chance = math.random(total)
    total = total - chance
    stats[2] = {name = "plants", chance = chance}
    chance = math.random(total)
    total = total - chance
    stats[3] = {name = "bugs", chance = chance}
    stats[4] = {name = "n/a", chance = total}
    stats = {
        name = "Unanchored Location",
        description = "Some kind of place in space.",
        stats = stats
    }
    nk.storage_write({
        {
            collection = "anchors",
            key = "unanchored",
            user_id = ctx.user_id,
            value = stats,
            permission_read = 1,
            permission_write = 0
        }, {
            collection = "player_data",
            key = "current_location",
            user_id = ctx.user_id,
            value = stats,
            permission_read = 1,
            permission_write = 0
        }
    })
    return nk.json_encode(stats)
end

nk.register_rpc(custom_rpc_func, "teleport")
