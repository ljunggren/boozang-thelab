#!/bin/bash

find src/. -type f -exec sed -i -e 's/localhost\:9000/api.boozang.com/g' {} \;

npm install && npm run build
