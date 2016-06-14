var express = require('express');

var GET_MODULE_ON = {
    NEVER: 0,
    PAGE_LOAD_STATIC: 1,
    PAGE_LOAD_ASYNC: 2,
    MODULE_IN_VIEW: 3
    
};

(function() {
    server = new express();
    
    server.use(function (req, res, next) {

        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:59834');

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

        // Pass to next layer of middleware
        next();
    });
    
    server.get('/', function (req, res) {
      res.send('Hello World!');
    });
    
    server.get('/p/:page', function (req, res) {
        res.send(JSON.stringify({
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
        }));
    });
    
    server.get('/p/:page/m/:module', function (req, res) {
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

    server.listen(3000, function () {
      console.log('We are listening on localhost:3000');
    });
})();