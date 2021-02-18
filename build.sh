#!/bin/bash

rm -f nclient-module-system*.tgz
node increase_version.js
npm pack
cp nclient-module-system-*.tgz nclient-module-system.tgz
curl -F "file=@./nclient-module-system.tgz" http://159.69.2.203:3030/upload


