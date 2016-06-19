var package = require('./package.json');
var Publify = require('./ng-publify-core/nodejs/ngp.js');

var express = require('express');
var expressWs = require('express-ws');

const Usergroup = require('./ng-publify-core/nodejs/classes/Usergroup.class.js');

//var ngp_module_module_01 = require('./node_modules/');

console.log('\n ngp:' +
            '\n -- ng-publify ' + package.version + 
            '\n   -- express ' + package.dependencies.express + 
            '\n   -- node ' + process.version +
            '\n');

// Start server
var ngp_config = {
    express: express,
    expressWs: expressWs
};
ngp = new Publify(ngp_config);
ngp.init();

new Usergroup('admin')
    .addCondition(user => user.loggedIn)
    .addCondition(user => user.username === 'JakeCake');
new Usergroup('default');