/*******************************************************
 * 
 * 
 * 
 * 
 ******************************************************/

(function(app) {
    if(!app.components) app.components = {};
    
    app.components.ngpToolbox = ng.core.Component({
        selector: 'page-header',
        templateUrl: 'demosite/templates/partials/page-header.html'
    }).Class({
        constructor: function() {},
        ngOnInit: function() {
            // it will fetch all children of the element from the server, if not already cached.
            // Then call the callback functions que.
            
            var headeritems = [];
            (function populateHeaderItem(item, arr) {
                item.getChildren(function(children) {
                    children.forEach(function(child) {
                        var item = {
                            title: child.menuTitle || child.title || child.name,
                            children: []
                        };
                        if(child.children.length > 0) {
                            populateHeaderItem(child, item.children);
                        }
                        arr.push(item);
                    });
                });
            })($root, headeritems);
        }
    });
})(window.app || (window.app = {}));