const path = require('path')
const nodepath  = path.join(__dirname,"../")
console.log(nodepath)

let MPath1_config = nodepath + 'config/'
let MPath1_config_globalconfigs = MPath1_config + "GlobalConfigs"
let MPath1_config_mongodb = MPath1_config + "MongoDB"
let MPath1_config_redis = MPath1_config + "Redis"

let MPath1_controller = nodepath + 'controller/'
let MPath1_controller_toolscontroller = MPath1_controller + 'toolsController'
let MPath1_controller_UsersController = MPath1_controller + 'UsersController'
let MPath1_controller_WorldController = MPath1_controller + 'WorldController'
let MPath1_controller_CameraController = MPath1_controller + 'CameraController'
let MPath1_controller_GlobalMemory = MPath1_controller + 'GlobalMemory'
let MPath1_controller_RemoteDesktopOBJController = MPath1_controller + 'RemoteDesktopOBJController'

let MPath1_clouddrive = nodepath + 'clouddrive/'
module.exports.mpath1= {
                nodepath: nodepath,
                config: MPath1_config,
                globalconfigs: MPath1_config_globalconfigs,
                mongodb: MPath1_config_mongodb,
                toolsController : MPath1_controller_toolscontroller,
                redis: MPath1_config_redis,
                clouddrive: MPath1_clouddrive,
                userscontroller: MPath1_controller_UsersController,
                cameraController: MPath1_controller_CameraController,
                worldController: MPath1_controller_WorldController,
                globalmemoryController: MPath1_controller_GlobalMemory,
                remotedesktopobjController: MPath1_controller_RemoteDesktopOBJController

}

module.exports.connections = {
    redisconnection: false,
    mongoconnection: false
}