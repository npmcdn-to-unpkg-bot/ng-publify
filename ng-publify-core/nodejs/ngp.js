var path = require("path");
var Db = require('./db.js');

var GET_MODULE_ON = {
    NEVER: 0,
    PAGE_LOAD_STATIC: 1,
    PAGE_LOAD_ASYNC: 2,
    MODULE_IN_VIEW: 3
};

var dir = {};
    dir.root = __dirname.split('ng-publify-core')[0];
console.log(dir.root);
    dir.website = dir.root + '/demosite';
    dir.mongodb = "mongodb://localhost:27017/ng_publify";

module.exports = class ngp {
    constructor(config) {
        this.express = config.express;
        this.expressWs = config.expressWs;
    }
    
    init() {
        var ngp = this;
        this.db = new Db(this, dir.mongodb);
        
        console.log('Initializing express webserver');
        var self = this;
        this.app = new this.express();
        this.appWs = this.expressWs(this.app);
        
        this.app.use(function (req, res, next) {
            // Website you wish to allow to connect
            res.setHeader('Access-Control-Allow-Origin', '*');

            // Request methods you wish to allow
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

            // Request headers you wish to allow
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

            // Pass to next layer of middleware
            next();
        });
        
        this.app.use('/', this.express.static(dir.root));

        this.app.get('/', function (req, res) {
            res.sendFile(path.join(dir.website, '/boot.html'));
        });
        
        this.app.get('/publify', function (req, res) {
            res.sendFile(path.join(dir.root, 'ng-publify-core/templates/pagetypes/ngp-login.html'));
        });
        
        this.app.get('/get', function (req, res) {
            console.log('Received HTTP [get] request');
            
            self.db.get({_id: '1234-5678-9012-00'}, function(data) {
                console.log(JSON.stringify(data));
                res.send(JSON.stringify(data));
            });

            console.log('Responded to HTTP [get] request');
        });
        
        this.app.ws('/', function (webSocket, req) {
            console.log('Websocket connection started, total connection: ' + aWss.clients.length);

            var user = { 
                webSocket: webSocket, 
                relativePath: '',
                scope: {
                    containerId: null,
                    editableId: null
                }
            };
            
            webSocket.user = user;

            webSocket.on('close', function() {
                console.log('Websocket connection closed, total connection: ' + aWss.clients.length);
            });

            webSocket.on('message', function (msg) {
                console.log('Recieved ws-msg:', decodeURIComponent(msg));
                var msgSplit = msg.split(':');
                if(msgSplit.length === 0) return;
                var cmd = msgSplit[0];
                
                var params = (msgSplit.length >= 2) ? JSON.parse(decodeURIComponent(msgSplit[1])) : undefined;
                var data = (msgSplit.length >= 3) ? JSON.parse(decodeURIComponent(msgSplit[2])) : undefined;
                
                switch(cmd) {
                    case 'GET':
                        // Return content
                        webSocket.send('GETRESPONSE:' +  
                                       encodeURIComponent(JSON.stringify(params)) + ':' + 
                                       encodeURIComponent(JSON.stringify(ngp.db.get({_id: data})))
                                      );
                        
                        break;

                    case 'PAGELOAD':
                        user.relativePath = data.relativePath;
                        break;

                    case 'NAVIGATE':
                        user.scope.pageId = data;
                        break;

                    case 'EDITSTART':
                        user.scope.pageId = params.pageId;
                        user.scope.containerId = params.containerId;
                        user.scope.editableId = params.editableId;
                        break;

                    case 'EDIT':
                        ngp.db.set({ _id: user.scope.containerId}, {
                            _id: '1234-5678-9012-00',
                            containers: {
                                main: {
                                    containers: {

                                    },
                                    editables: {
                                        error_text: data
                                    },
                                    modules: {
                                        '5499-0094-5301-24': {
                                            getOn: GET_MODULE_ON.PAGE_LOAD_STATIC,
                                            data: {

                                            }
                                        },
                                        '8492-1823-8973-01': {
                                            getOn: GET_MODULE_ON.PAGE_LOAD_ASYNC
                                        }
                                    }
                                }
                            }
                        }, function(result) {
                            
                        });
//                        rootdata.containers.main.editables.error_text = data;
                        aWss.clients.filter(x => x !== webSocket && x.user.relativePath === user.relativePath).forEach(function(ws) {
//                            ws.send('hmm');
                        });
                        break;
                }
            });
        });
        var aWss = this.appWs.getWss('/');

        this.app.listen(3000, function () {
            console.log('Express listening on localhost:3000');
        });
    }
};