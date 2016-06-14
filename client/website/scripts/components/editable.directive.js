(function(app) {
    if(!app.components) app.components = {};
    
    app.components.ngpEditable = ng.core.Directive({
        selector: '[editable]',
        host: {
            '(input)': 'emit($event)',
        },
        inputs: ['counterValue:init']
    }).Class({
        constructor: function() {
            this.emitter = new ng.core.EventEmitter();
            
        },
        ngAfterViewInit: function() {
            console.log(this);
        },
        emit: function($event) {
            var container = (function getContainer(el) {
                if(el.parentElement) {
                    if(el.parentElement.getAttribute('container')) {
                        return el.parentElement;
                    } else {
                        return getContainer(el.parentElement);
                    }
                } else return null;
            })($event.srcElement);
            
            if(container) {
                console.log(container.getAttribute('container') + '.' + $event.srcElement.getAttribute('editable') + ': ' + $event.srcElement.innerHTML);
                // Send package to server and other editors!
                
            }
            
            $event.srcElement;

            this.emitValue.emit('This is some value from children');
        }

    });
})(window.app || (window.app = {}));