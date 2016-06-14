(function(app) {
    app.serverUrl = "http://localhost:3000";
    
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
                }
            };
            xhttp.open("GET", app.serverUrl + '/p/' + ~~(1000000*Math.random()), true);
            xhttp.send();
        }
    });

    document.addEventListener('DOMContentLoaded', function() {
        ng.platformBrowserDynamic.bootstrap(app.AppComponent);
    });
    
})(window.app || (window.app = {}));