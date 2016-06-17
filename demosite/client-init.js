import contentService from "ContentService";

(function(app) {
  app.AppComponent =
    ng.core.Component({
      selector: 'my-app',
      templateUrl: 'templates/ngp-singleline.html'
    })
    .Class({
      constructor: function() {
        var content = new ContentService();
        this.module = { Id: content.getId() }
      }
    });
    
    document.addEventListener('DOMContentLoaded', function() {
        ng.platform.browser.bootstrap(app.AppComponent);
        window.getAll = n => n + n;
    });
})(window.app || (window.app = {}));