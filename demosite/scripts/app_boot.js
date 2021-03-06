import ngpToolbox from './components/toolbox.component.js';
import ngpEditable from './components/editable.directive.js';
import Page from './classes/page.class.js';

(function(app) {
    app.serverUrl = "localhost:3000";
    
    app.NONE = 0; app.HTTP_ONLY = 1; app.WEBSOCKET_PREFER = 2; app.WEBSOCKET_ONLY = 3;
    
    app.useSecureConnecion = false;
    app.dataConnectionErrorMessage = "Dataserver error";
    
    app.webSocket = {
        ws: new WebSocket('ws://' + app.serverUrl + '/'),
        pendingGetRequests: [],
        getUniqueRequestId: function() {
            var guid = 0;
            while(app.webSocket.pendingGetRequests.filter(x => x.guid === guid).length) {
                guid = ~~(Math.random() * 9e3);
            }
            return guid;
        },
        send: function(cmd, params, data) {
            app.webSocket.ws.send(cmd + ':' + encodeURIComponent(JSON.stringify(params || '')) + ':' + encodeURIComponent(JSON.stringify(data || '')));
        },
        get: function(id, callback) {
            var _guid = app.webSocket.getUniqueRequestId();
            var preq = app.webSocket.pendingGetRequests.push({ 
                guid: _guid, 
                callback: callback
            });
            app.webSocket.ws.send('GET:' + 
                                  encodeURIComponent(JSON.stringify({guid: _guid})) + ':' + 
                                  JSON.stringify(id)
                                 );
        }
    };
    
    app.webSocket.ws.addEventListener('message', function(event) {
        console.log(event.data);
        
        var msgSplit = event.data.split(':');
        if(msgSplit.length === 0) return;
        var cmd = msgSplit[0];
        var params = (msgSplit.length >= 2) ? JSON.parse(decodeURIComponent(msgSplit[1])) : undefined;
        var data = (msgSplit.length >= 3) ? JSON.parse(decodeURIComponent(msgSplit[2])) : undefined;
        
        app.webSocket.pendingGetRequests.filter(x => x.guid === params.guid).forEach(function(pgr) {
           pgr.callback(data);
        });
        
    });

    app.http = {
        send: function(cmd, params) {
            
        },
        get: function(id, callback) {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (xhttp.readyState == 4 && xhttp.status == 200) {
                    callback(JSON.parse(xhttp.responseText));
                } else if(xhttp.readyState == 4) {
                    console.error(xhttp);
                    callback(null);
                }
            };
            xhttp.open("GET", 'http' + (app.useSecureConnecion ? 's' : '') + '://' + app.serverUrl + '/get/?id=' + id, true);
            xhttp.send();
        }
    };
    
    app.get = function(id, callback) {
        switch(app.editorConnectionMode) {
            case app.WEBSOCKET_ONLY: 
                if(app.webSocket.ws.readyState === 1) {
                    app.webSocket.get(id, callback);
                } else {
                    app.webSocket.ws.addEventListener('open', function() {
                        app.webSocket.get(id, callback);
                    });
                }
                break;
                
            case app.WEBSOCKET_PREFER:
                if(app.webSocket.ws.readyState === 1) {
                    app.webSocket.get(id, callback);
                } else {
                    app.http.get(id, callback);
                }
                break;
                
            case app.HTTP_ONLY:
                app.http.get(id, callback);
                break;
        }
    };
    
    app.AppComponent = ng.core.Component({
        selector: 'my-app',
        templateUrl: '/demosite/templates/pagetypes/frontpage.html',
        directives: [ngpToolbox, ngpEditable]
    }).Class({
        constructor: function() {
            // These settings should be fetched from the user's usergroup on load, editors will normally use WebSockets while endusers will use HTTP.
            app.editorConnectionMode = app.HTTP_ONLY; // Users will setup a WebSocket connection to the data-server instead of using HTTP requests if possible.
            
            app.contentCacheEnabled = true; // This defaults to true. False means we will not cache data we fetch, should rarely be disabled.
            app.contentCacheLocalStorageMs = 1000 * 60 * 60 * 24 * 3;   // [-1] Store cache over browser sessions?
        }, 
        ngOnInit: function() {
            // Initial population
            app.get('1234-5678', function(data)  {
                app.page = data;
                
                (function populateData(data, el) {
                    for(var editableId in data.editables) {
                        el.querySelector('[editable="' + editableId + '"]').innerHTML = data.editables[editableId];
                    }

                    for(var moduleId in data.modules) {

                    }

                    for(var containerId in data.containers) {
                        var containerEl = el.querySelector('[container="' + containerId + '"]');
                        if(containerEl) {
                            populateData(data.containers[containerId], containerEl);
                        }
                    }
                })(app.page, document.documentElement);
            });
        }
    });

    document.addEventListener('DOMContentLoaded', function() {
        ng.platformBrowserDynamic.bootstrap(app.AppComponent);
    });
    

    // Move to own file:
    document.addEventListener('DOMContentLoaded', function() {
        app.activeElement = null;

        app.startEdit = function() {
            document.body.classList.add('publify--is-editing');
            Array.prototype.forEach.call(document.querySelectorAll('[editable]'), function(el) {
                el.contentEditable = true;
                el.addEventListener('focus', function(e) {
                   app.activeElement = e.target;
                });
                el.addEventListener('blur', function(e) {
                    e.preventDefault();
                });
            });

            document.body.classList.add('publify-editing');
            //document.querySelector('.doc').style.width = 1024/0.75 + "px";
        };
        app.endEdit = function() {
            document.body.classList.remove('publify--is-editing');   
            Array.prototype.forEach.call(document.querySelectorAll('[editable]'), function(el) {
                el.contentEditable = false;
            });
            
            document.body.classList.remove('publify-editing');
            
            document.querySelector('.doc').style.width = "";
        };
        
        document.addEventListener('wheel', function() {
            event.preventDefault();
        }
        
        //publify.startEdit();
    });

})(window.app || (window.app = {}));