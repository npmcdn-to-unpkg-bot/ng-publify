(function(app) {
    if(!app.components) app.components = {};
    
    app.components.ngpToolbox = ng.core.Component({
        selector: 'ngp-toolbox',
        templateUrl: '/client/ng-publify/templates/toolbox.html'
    }).Class({
        constructor: function() {}
    });

    // Keep checking
    function updateTools() {
        if(document.getSelection().rangeCount) {
            // Font color
            document.querySelector('.tool--font-color').style.borderBottomColor = document.defaultView.getComputedStyle(document.getSelection().getRangeAt(0).commonAncestorContainer.parentNode, null).getPropertyValue('color')

            // Font bold
            if(document.defaultView.getComputedStyle(document.getSelection().getRangeAt(0).commonAncestorContainer.parentNode, null).getPropertyValue('font-weight') === 'bold') {
                document.querySelector('.tool--font-bold').classList.add('active');
            } else {
                document.querySelector('.tool--font-bold').classList.remove('active');
            }
        }
    }

    window.addEventListener('click', updateTools);
    window.addEventListener('keyup', updateTools);

})(window.app || (window.app = {}));