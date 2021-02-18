const NodeClient = require('nclient-lib')

module.exports = {
    moduleInfo: NodeClient.readModuleInfo(require('./package.json'))
};

NodeClient.registerNodeMethod('listDeviceMethods', (params, cb) => {
    cb( {
        commonHandler: Object.keys(NodeClient.commonHandler),
        handler: NodeClient.handler ? Object.keys(NodeClient.handler) : [],
        methods: Object.keys(NodeClient.methods),
        globals: Object.keys(global)
    })
})

NodeClient.registerNodeMethod('updateModules', async (params)=>{
    let res = await NodeClient.commonHandler.execCmd('npm update')
    if(res.stderr) {
        console.log("Can not execute npm udate")
        res = await NodeClient.commonHandler.execCmd('export PATH="$PATH:$(pwd)" && npm update')
        return res
    } else {
        return res
    }
})

function hook_stdout(callback) {
    var old_write = process.stdout.write

    process.stdout.write = (function(write) {
        return function(string, encoding, fd) {
            write.apply(process.stdout, arguments)
            callback(string, encoding, fd)
        }
    })(process.stdout.write)

    return function() {
        process.stdout.write = old_write
    }
}

NodeClient.registerNodeStream('viewNodeLog', (stream, params) => {
    var unhook = hook_stdout(function(string, encoding, fd) {
        stream.push(string);
    });
    stream.on('unpipe',function(){
        unhook();
    });

}, (stream)=> {
    stream.unpipe()
})

