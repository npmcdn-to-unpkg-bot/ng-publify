var express = require('express');
    app = new express();
var expressWs = require('express-ws')(app);

var GET_MODULE_ON = {
    NEVER: 0,
    PAGE_LOAD_STATIC: 1,
    PAGE_LOAD_ASYNC: 2,
    MODULE_IN_VIEW: 3
};

var errtext = 'Error text from server';

(function() {
    
    app.use(function (req, res, next) {
        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:59834');

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

        // Pass to next layer of middleware
        next();
    });
    
    app.get('/', function (req, res) {
      res.send('Hello World!');
    });
    
    app.get('/p/:page', function (req, res) {
        res.send(JSON.stringify({
            containers: {
                main: {
                    containers: {
                        
                    },
                    editables: {
                        error_text: errtext
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
        }));
    });
    
    app.get('/p/:page/m/:module', function (req, res) {
        res.send(JSON.stringify({
            containers: {
                main: {
                    containers: {
                        
                    },
                    editables: {
                        error_text: 'Error text from server'
                    }
                }
            },
            editables: {
                
            }
        }));
    });
    
    // Editor WebSocket stuff
    app.ws('/', function (webSocket, req) {
        console.log('Editor connected with WebSocket');
        
        var user = { 
            webSocket: webSocket, 
            relativePath: '',
            scope: {
                containerId: null,
                editableId: null
            }
        };
        webSocket.user = user;
        
        webSocket.on('message', function (msg) {
            var cmd = msg.substr(0, msg.indexOf(':'));
            var data = JSON.parse(msg.substr(msg.indexOf(':') + 1));
            console.log(cmd, data);
            
            switch(cmd) {
                case 'PAGE_LOAD':
                    user.relativePath = data.relativePath;
                    break;
                    
                case 'NAVIGATE':
                    user.relativePath = data;
                    break;
                    
                case 'EDIT_START':
                    user.scope.containerId = data.containerId;
                    user.scope.editableId = data.editableId;
                    break;
                    
                case 'EDIT':
                    errtext = data;
                    aWss.clients.filter(x => x !== webSocket && x.user.relativePath === user.relativePath).forEach(function(ws) {
                        ws.send('yoyo');
                    });
                    break;
            }
        });
    });
    var aWss = expressWs.getWss('/');
    
    app.listen(3000, function () {
      console.log('ng-publify started successfully');
    });
    
})();