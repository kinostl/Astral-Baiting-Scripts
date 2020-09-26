local nk = require("nakama")

local function custom_rpc_func(context, payload)
    nk.logger_info(string.format("Payload: %q", payload))

    -- "payload" is bytes sent by the client we'll JSON decode it.
    local json = nk.json_decode(payload)

    return nk.json_encode(json)
end

nk.register_rpc(custom_rpc_func, "helloworld")
