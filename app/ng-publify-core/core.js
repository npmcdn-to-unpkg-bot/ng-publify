var path    = require("path");
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

var rootdata = JSON.stringify({
    //id: '4212-4674-7843-2054-98',
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
});

module.exports = class ngp {
    constructor(config) {
        
    }
    
    init() {
        console.log('ngp: initializing');

        app.use(function (req, res, next) {
            // Website you wish to allow to connect
            res.setHeader('Access-Control-Allow-Origin', '*');

            // Request methods you wish to allow
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

            // Request headers you wish to allow
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

            // Pass to next layer of middleware
            next();
        });
        
        app.use('/', express.static(path.join(__dirname, '../')));

        app.get('/', function (req, res) {
            res.sendFile(path.join(__dirname, '../website/boot.html'));
        });

        app.get('/get', function (req, res) {
            console.log('ngp: received HTTP [get] request');

            res.send(rootdata);

            console.log('ngp: responded to HTTP [get] request');
        });

        app.ws('/', function (webSocket, req) {
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
                switch(cmd) {
                    case 'GET':
                        // Get content
                            var msgSplit = msg.split(':');
                            var cmd = msgSplit[0];
                            var params = msgSplit[1];
                            var data = JSON.parse(decodeURIComponent(msgSplit[2]));
                        
                            webSocket.send(rootdata);
                            
                        break;

                    case 'PAGELOAD':
                        user.relativePath = data.relativePath;
                        break;

                    case 'NAVIGATE':
                        user.relativePath = data;
                        break;

                    case 'EDITSTART':
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
            console.log('ngp: listening on localhost:3000');
        });
    }
};