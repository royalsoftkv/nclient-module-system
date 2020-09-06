const NodeClient = require('nclient-lib')
const Updater = require('./updater')

module.exports = {
    moduleInfo: NodeClient.readModuleInfo(require('./package.json'))
};

NodeClient.registerDeviceMethod('listDeviceMethods', () => {
    return {
        commonHandler: Object.keys(NodeClient.commonHandler),
        handler: NodeClient.handler ? Object.keys(NodeClient.handler) : [],
        methods: Object.keys(NodeClient.methods),
        globals: Object.keys(global)
    }
})

NodeClient.registerDeviceMethod('checkModuleVersions', () => {
    return Updater.moduleVersions
})

NodeClient.registerDeviceMethod('updateModules', async ()=>{
    let res = await NodeClient.commonHandler.execCmd('npm update')
    return res
})
