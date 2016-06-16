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
        send: function(cmd, data) {
            app.webSocket.ws.send(cmd + ':' + JSON.stringify(data));
        },
        get: function(path, callback) {
            app.webSocket.ws.send('CONTENT:' + path);
            app.webSocket.ws.onmessage = function(event) {
                callback(event.data);
            }
        }
    }

    app.http = {
        get: function(path, callback) {
            callback({ data: 123 })
        }
    }
    
    app.AppComponent = ng.core.Component({
        selector: 'my-app',
        templateUrl: 'templates/pagetypes/frontpage.html',
        directives: [ngpToolbox, ngpEditable]
    }).Class({
        constructor: function() {
            // These settings should be fetched from the user's usergroup on load, editors will normally use WebSockets while endusers will use HTTP.
            app.editorConnectionMode = app.HTTP_ONLY;  // Users will setup a WebSocket connection to the data-server instead of using HTTP requests if possible.
            
            app.contentCacheEnabled = true; // This defaults to true. False means we will not cache data we fetch, should rarely be disabled.
            app.contentCacheLocalStorageMs = 1000 * 60 * 60 * 24 * 3;   // [-1] Store cache over browser sessions?
        },
        ngOnInit: function() {
            // Initial population            
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (xhttp.readyState == 4 && xhttp.status == 200) {
                    app.page = JSON.parse(xhttp.responseText);
                    //app.page.prototype = Page.prototype;
                    //app.page.Populate();
                    
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
                } else if(xhttp.readyState == 4) {
                    console.error(xhttp);
                    document.clear();
                    document.write(app.dataConnectionErrorMessage);
                }
            };
            xhttp.open("GET", 'http' + (app.useSecureConnecion ? 's' : '') + '://' + app.serverUrl + '/content/getPage/' + ~~(1000000*Math.random()), true);
            xhttp.send();
            
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
        };
        app.endEdit = function() {
            document.body.classList.remove('publify--is-editing');
            Array.prototype.forEach.call(document.querySelectorAll('[editable]'), function(el) {
                el.contentEditable = false;
            });
            document.body.classList.remove('publify-editing');
        };

        //publify.startEdit();
    });

})(window.app || (window.app = {}));