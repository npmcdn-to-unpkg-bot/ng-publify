var package = require('./package.json');

console.log('\n ngp:' +
            '\n -- ng-publify ' + package.version + 
            '\n   -- express ' + package.dependencies.express + 
            '\n   -- node ' + process.version +
            '\n');

// Start server
require('./server/ngp.js');