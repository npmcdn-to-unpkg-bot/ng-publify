var package = require('./package.json');
var Publify = require('./app/ng-publify-core/core.js');

//var ngp_module_module_01 = require('./node_modules/');

console.log('\n ngp:' +
            '\n -- ng-publify ' + package.version + 
            '\n   -- express ' + package.dependencies.express + 
            '\n   -- node ' + process.version +
            '\n');

// Start server
var ngp_config = {};
ngp = new Publify(ngp_config);
ngp.init();