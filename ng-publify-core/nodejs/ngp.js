var path = require("path");

var GET_MODULE_ON = {
    NEVER: 0,
    PAGE_LOAD_STATIC: 1,
    PAGE_LOAD_ASYNC: 2,
    MODULE_IN_VIEW: 3
};

var dir = {
    root: __dirname.replace('/ng-publify-core/nodejs', ''),
    website: __dirname.replace('/ng-publify-core/nodejs', '/demosite')
};

var rootdata = {
    //id: '4212-4674-7843-2054-98',
    containers: {
        main: {
            containers: {

            },
            editables: {
                error_text: 'Error text from server'
            },
            modules: {
                'm_5499-0094-5301-24': {
                    getOn: GET_MODULE_ON.PAGE_LOAD_STATIC,
                    data: {

                    }
                },
                'm_8492-1823-8973-01': {
                    getOn: GET_MODULE_ON.PAGE_LOAD_ASYNC
                }
            }
        }
    }
};

module.exports = class ngp {
    constructor(config) {
        this.express = config.express;
        this.expressWs = config.expressWs;
    }
    
    init() {
        console.log('ngp: initializing');

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
            res.send('Login please');
        });

        this.app.get('/get', function (req, res) {
            console.log('ngp: received HTTP [get] request');

            res.send(JSON.stringify(rootdata));

            console.log('ngp: responded to HTTP [get] request');
        });

        this.app.ws('/', function (webSocket, req) {
            console.log('ngp: websocket connection started, total connection: ' + aWss.clients.length);

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
                console.log('ngp: websocket connection closed, total connection: ' + aWss.clients.length);
            });

            webSocket.on('message', function (msg) {
                console.log('ngp:', decodeURIComponent(msg));
                var msgSplit = msg.split(':');
                if(msgSplit.length === 0) return;
                var cmd = msgSplit[0];
                
                var params = (msgSplit.length >= 2) ? JSON.parse(decodeURIComponent(msgSplit[1])) : undefined;
                var data = (msgSplit.length >= 3) ? JSON.parse(decodeURIComponent(msgSplit[2])) : undefined;
                
                switch(cmd) {
                    case 'GET':
                        // Return content
                        webSocket.send('GETRESPONSE:' +  encodeURIComponent(JSON.stringify(params)) + ':' + encodeURIComponent(JSON.stringify(rootdata)));
                        
                        break;

                    case 'PAGELOAD':
                        user.relativePath = data.relativePath;
                        break;

                    case 'NAVIGATE':
                        user.relativePath = data;
                        break;

                    case 'EDITSTART':
                        user.scope.containerId = params.containerId;
                        user.scope.editableId = params.editableId;
                        break;

                    case 'EDIT':
                        rootdata.containers.main.editables.error_text = data;
                        aWss.clients.filter(x => x !== webSocket && x.user.relativePath === user.relativePath).forEach(function(ws) {
//                            ws.send('hmm');
                        });
                        break;
                }
            });
        });
        var aWss = this.appWs.getWss('/');

        this.app.listen(3000, function () {
            console.log('ngp: listening on localhost:3000');
        });
    }
};