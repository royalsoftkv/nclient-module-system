const NodeClient = require('nclient-lib')

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


