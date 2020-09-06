const NodeClient = require('nclient-lib')
const axios = require('axios')

let moduleVersions = {}

fetchNClientModuleVersion = (moduleId) => {
    let moduleFullId = `nclient-module-${moduleId}`
    console.debug(`Looking for version of module ${moduleFullId}`)
    let packageJsonUrl = `https://raw.githubusercontent.com/royalsoftkv/${moduleFullId}/master/package.json`
    axios.get(packageJsonUrl).then(res=>{
        let json = res.data
        let version = json.version
        console.debug(`Found version ${version}`)
        moduleVersions[moduleId]=version
    }).catch(err=>{
        console.error(err.toString())
    })
}

checkUpdates = () => {
    console.debug("Running check modules for updates")
    if(NodeClient.modules.length == 0) {
        return
    }
    for(let i in NodeClient.modules) {
        let module = NodeClient.modules[i]
        let moduleInfo = module.moduleInfo
        if(moduleInfo && moduleInfo.id) {
            let moduleId = moduleInfo.id
            fetchNClientModuleVersion(moduleId)
        }
    }
}

setInterval(()=>{
    checkUpdates()
},1000*60*60)

setTimeout(()=>{
    checkUpdates()
}, 1000*5)


module.exports = {
    moduleVersions
}
