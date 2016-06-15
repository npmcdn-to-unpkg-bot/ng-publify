class Page {
    constructor(id) {
        this.id = id;
    }
    children(callback) {
        app.content.getChildrenOfPage(this)
    }
}

(function(app) {
    
})(window.app || (window.app = {}));