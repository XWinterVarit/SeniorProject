const path = require('path')
const term = require('terminal-kit').terminal

const nodepath = path.join(__dirname, "../")
console.log(nodepath)

const MPath1_config = nodepath + 'config/'
const MPath1_controller = nodepath + 'controller/'
const MPath1_controller_session = MPath1_controller + 'session'
const MPath1_controller_stream = MPath1_controller + 'stream'
const MPath1_controller_messages = MPath1_controller + 'messages'
const MPath1_controller_tools = MPath1_controller + 'tools'
const serverIP = "127.0.0.1"
const serverPort = "80"

let clientIP = "docker.for.mac.localhost"
let clientPORT = "50000"

let currentUser_name = "cheevarit"
let currentUser_password = "1234"
let currentUser_persistedID = ""


const user_messages_serverpath = "userGateway/"

module.exports.mpath1 = {
    nodepath: nodepath,
    config: MPath1_config,
    sessionController: MPath1_controller_session,
    streamController: MPath1_controller_stream,
    messagesController: MPath1_controller_messages,
    toolsController: MPath1_controller_tools
}

module.exports.ServerInfo = {
    serverIP: serverIP,
    serverPort:serverPort
}

module.exports.ClientInfo = {
    clientIP: clientIP,
    clientPORT: clientPORT,
    currentUser_name: currentUser_name,
    currentUser_persistedID: currentUser_persistedID
}

module.exports.specificServerPath = {
    user_messages_serverpath : user_messages_serverpath
}