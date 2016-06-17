
export default ng.core.Directive({
    selector: '[editable]',
    host: {
        '(input)': 'emit($event)',
        '(focus)': 'emitStart($event)'
    },
    inputs: ['counterValue:init']
}).Class({
    constructor: function() {
        this.emitter = new ng.core.EventEmitter();

    },
    ngAfterViewInit: function() {
        console.log(this);
    },
    emitStart: function($event) {
        var container = (function getContainer(el) {
            if(el.parentElement) {
                if(el.parentElement.getAttribute('container')) {
                    return el.parentElement;
                } else {
                    return getContainer(el.parentElement);
                }
            } else return document.body;
        })($event.srcElement);

        app.webSocket.send('EDITSTART', {
            containerId: container.getAttribute('container'),
            editableId: $event.srcElement.getAttribute('editable')
        });
    },
    emit: function($event) {
        var container = (function getContainer(el) {
            if(el.parentElement) {
                if(el.parentElement.getAttribute('container')) {
                    return el.parentElement;
                } else {
                    return getContainer(el.parentElement);
                }
            } else return document.body;
        })($event.srcElement);

        app.webSocket.send('EDIT',
            $event.srcElement.innerHTML
        );

        $event.srcElement;

        this.emitter.emit('This is some value from children');
    }
});