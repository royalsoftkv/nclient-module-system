let pjson = require('./package.json')
const fs = require("fs")

let version = pjson.version
let parts = version.split(".")
let major = parts[0]
let minor = parts[1]
let patch = parseInt(parts[2])

patch++

let newVersion= [major, minor, patch].join(".")

console.log(version + "=>" + newVersion)

pjson.version = newVersion

fs.writeFileSync('./package.json', JSON.stringify(pjson, null, 4))
