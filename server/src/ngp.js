var express = require('express');

(function() {
    server = new express();

    server.get('/', function (req, res) {
      res.send('Hello World!');
    });
    
    server.get('/add/:x/:y', function (req, res) {
        res.send('total: ' + (parseInt(req.params.x) + parseInt(req.params.y)));
    });

    server.listen(3000, function () {
      console.log('We are listening on localhost:3000');
    });
})();