const path = require('path')
const nodepath = path.join(__dirname, "../")
console.log(nodepath)

let MPath1_config = nodepath + 'config/'
let MPath1_controller = nodepath + 'controller/'
let MPath1_controller_session = MPath1_controller + 'session'
let MPath1_controller_stream = MPath1_controller + 'stream'
let MPath1_controller_messages = MPath1_controller + 'messages'
module.exports.mpath1 = {
    nodepath: nodepath,
    config: MPath1_config,
    sessionController: MPath1_controller_session,
    streamController: MPath1_controller_stream,
    messagesController: MPath1_controller_messages
}
