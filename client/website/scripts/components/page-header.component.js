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
        templateUrl: '/client/website/templates/partials/page-header.html'
    }).Class({
        constructor: function() {},
        ngOnInit: function() {
            // app.root will, if not already cached, fetch the root element from the server.
            // root.children will fetch all children of the element from the server, if not already cached.
            app.root.children.filter(x => x.pageType === 'article').forEach(function(page) {
                console.log(page);
            });
        }
    });

    
    
})(window.app || (window.app = {}));