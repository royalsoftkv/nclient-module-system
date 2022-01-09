const NodeClient = require('nclient-lib')
const si = require('systeminformation')

module.exports = {
    moduleInfo: NodeClient.readModuleInfo(require('./package.json'))
};

NodeClient.registerNodeMethod('listDeviceMethods', (params, cb) => {
    cb( {
        remoteHandler: Object.keys(NodeClient.remoteHandler),
        methods: Object.keys(NodeClient.methods),
        globals: Object.keys(global)
    })
})

NodeClient.registerNodeMethod('updateModules', async (params)=>{
    let res = await NodeClient.commonHandler.execCmd('npm update')
    if(res.stderr && res.stderr.includes('npm: not found')) {
        console.log("Can not execute npm update: " + res.stderr)
        res = await NodeClient.commonHandler.execCmd('export PATH="$PATH:$(pwd)" && npm update')
        return res
    } else {
        console.log(res)
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

NodeClient.registerNodeMethod('getSystemInfo', (params, cb) => {
    let info = {}
    si.mem(res => {
        info.mem = res
        si.currentLoad(res=> {
            info.currentLoad = res
            si.fsSize(res => {
                info.fsSize = res
                cb(info)
            })
        })
    })
})
