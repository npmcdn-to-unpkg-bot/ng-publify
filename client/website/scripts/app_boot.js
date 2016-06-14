(function(app) {
    app.serverUrl = "localhost:3000";
    app.useSecureConnecion = false;
    app.dataConnectionErrorUrl = "/404.html";
    
    app.AppComponent = ng.core.Component({
        selector: 'my-app',
        templateUrl: 'templates/pagetypes/frontpage.html',
        directives: [app.components.ngpToolbox, app.components.ngpEditable]
    }).Class({
        constructor: function() {

        },
        ngOnInit: function() {
            // Initial population
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (xhttp.readyState == 4 && xhttp.status == 200) {
                    app.page = JSON.parse(xhttp.responseText);

                    (function populateData(data, el) {
                        for(editableId in data.editables) {
                            el.querySelector('[editable="' + editableId + '"]').innerHTML = data.editables[editableId];
                        }

                        for(moduleId in data.modules) {
                            
                        }

                        for(containerId in data.containers) {
                            var containerEl = el.querySelector('[container="' + containerId + '"]');
                            if(containerEl) {
                                populateData(data.containers[containerId], containerEl);
                            }
                        }
                    })(app.page, document.documentElement);
                } else if(xhttp.readyState == 4) {
                    window.location = app.dataConnectionErrorUrl;
                }
            };
            xhttp.open("GET", 'http' + (app.useSecureConnecion ? 's' : '') + '://' + app.serverUrl + '/p/' + ~~(1000000*Math.random()), true);
            xhttp.send();
            
            app.webSocket = { 
                ws: new WebSocket('ws://' + app.serverUrl),
                send: function(cmd, data) {
                    app.webSocket.ws.send(cmd + ':' + JSON.stringify(data));
                }
            };
            
        }
    });

    document.addEventListener('DOMContentLoaded', function() {
        ng.platformBrowserDynamic.bootstrap(app.AppComponent);
    });
    
})(window.app || (window.app = {}));