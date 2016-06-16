(function(app) {
    class ContentFetcher {
        constructor(height, width) {
            this.cache = new Set();
        }
        
        _get(path, values, callback) {
            var valuesAsString;
            for(var key in values) valuesAsString += values[key];
            
            if(this.cache.get(path) && this.cache.get(path).get(valuesAsString)) {
                callback(this.cache.get(path).get(valuesAsString));
            } else {
                if(app.contentCacheEnabled) {
                    if(app.preferWebSocket && app.webSocket && app.webSocket.ws.readyState === 1) {
                        app.webSocket.get(path, callback);
                    } else {
                        app.http.get(path, callback);
                    }
                } else {
                    
                }
            }
        }
        
        getChildrenOfPage(page, callback) {
            _get('/content/getPage/:pageId', page.id, callback)
        }
    }
    app.content = new ContentFetcher();
})(window.app || (window.app = {}));