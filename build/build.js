(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _toolboxComponent = require('./components/toolbox.component.js');

var _toolboxComponent2 = _interopRequireDefault(_toolboxComponent);

var _editableDirective = require('./components/editable.directive.js');

var _editableDirective2 = _interopRequireDefault(_editableDirective);

var _pageClass = require('./classes/page.class.js');

var _pageClass2 = _interopRequireDefault(_pageClass);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function (app) {
    app.serverUrl = "localhost:3000";

    app.NONE = 0;app.HTTP_ONLY = 1;app.WEBSOCKET_PREFER = 2;app.WEBSOCKET_ONLY = 3;

    app.useSecureConnecion = false;
    app.dataConnectionErrorMessage = "Dataserver error";

    app.webSocket = {
        ws: new WebSocket('ws://' + app.serverUrl + '/'),
        send: function send(cmd, data) {
            app.webSocket.ws.send(cmd + ':' + JSON.stringify(data));
        },
        get: function get(path, callback) {
            app.webSocket.ws.send('CONTENT:' + path);
            app.webSocket.ws.onmessage = function (event) {
                callback(event.data);
            };
        }
    };

    app.http = {
        get: function get(path, callback) {
            callback({ data: 123 });
        }
    };

    app.AppComponent = ng.core.Component({
        selector: 'my-app',
        templateUrl: 'templates/pagetypes/frontpage.html',
        directives: [_toolboxComponent2.default, _editableDirective2.default]
    }).Class({
        constructor: function constructor() {
            // These settings should be fetched from the user's usergroup on load, editors will normally use WebSockets while endusers will use HTTP.
            app.editorConnectionMode = app.HTTP_ONLY; // Users will setup a WebSocket connection to the data-server instead of using HTTP requests if possible.

            app.contentCacheEnabled = true; // This defaults to true. False means we will not cache data we fetch, should rarely be disabled.
            app.contentCacheLocalStorageMs = 1000 * 60 * 60 * 24 * 3; // [-1] Store cache over browser sessions?
        },
        ngOnInit: function ngOnInit() {
            // Initial population           
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (xhttp.readyState == 4 && xhttp.status == 200) {
                    app.page = JSON.parse(xhttp.responseText);
                    //app.page.prototype = Page.prototype;
                    //app.page.Populate();

                    (function populateData(data, el) {
                        for (var editableId in data.editables) {
                            el.querySelector('[editable="' + editableId + '"]').innerHTML = data.editables[editableId];
                        }

                        for (var moduleId in data.modules) {}

                        for (var containerId in data.containers) {
                            var containerEl = el.querySelector('[container="' + containerId + '"]');
                            if (containerEl) {
                                populateData(data.containers[containerId], containerEl);
                            }
                        }
                    })(app.page, document.documentElement);
                } else if (xhttp.readyState == 4) {
                    console.error(xhttp);
                    document.clear();
                    document.write(app.dataConnectionErrorMessage);
                }
            };
            xhttp.open("GET", 'http' + (app.useSecureConnecion ? 's' : '') + '://' + app.serverUrl + '/content/getPage/' + ~ ~(1000000 * Math.random()), true);
            xhttp.send();
        }
    });

    document.addEventListener('DOMContentLoaded', function () {
        ng.platformBrowserDynamic.bootstrap(app.AppComponent);
    });

    // Move to own file:
    document.addEventListener('DOMContentLoaded', function () {
        app.activeElement = null;

        app.startEdit = function () {
            document.body.classList.add('publify--is-editing');
            Array.prototype.forEach.call(document.querySelectorAll('[editable]'), function (el) {
                el.contentEditable = true;
                el.addEventListener('focus', function (e) {
                    app.activeElement = e.target;
                });
                el.addEventListener('blur', function (e) {
                    e.preventDefault();
                });
            });

            document.body.classList.add('publify-editing');
        };
        app.endEdit = function () {
            document.body.classList.remove('publify--is-editing');
            Array.prototype.forEach.call(document.querySelectorAll('[editable]'), function (el) {
                el.contentEditable = false;
            });
            document.body.classList.remove('publify-editing');
        };

        //publify.startEdit();
    });
})(window.app || (window.app = {}));

},{"./classes/page.class.js":2,"./components/editable.directive.js":3,"./components/toolbox.component.js":4}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Page = exports.Page = function () {
    function Page(id) {
        _classCallCheck(this, Page);

        this.id = id;
    }

    _createClass(Page, [{
        key: "children",
        value: function children(callback) {
            app.content.getChildrenOfPage(this);
        }
    }]);

    return Page;
}();

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = ng.core.Directive({
    selector: '[editable]',
    host: {
        '(input)': 'emit($event)',
        '(focus)': 'emitStart($event)'
    },
    inputs: ['counterValue:init']
}).Class({
    constructor: function constructor() {
        this.emitter = new ng.core.EventEmitter();
    },
    ngAfterViewInit: function ngAfterViewInit() {
        console.log(this);
    },
    emitStart: function emitStart($event) {
        var container = function getContainer(el) {
            if (el.parentElement) {
                if (el.parentElement.getAttribute('container')) {
                    return el.parentElement;
                } else {
                    return getContainer(el.parentElement);
                }
            } else return document.body;
        }($event.srcElement);

        app.webSocket.send('EDIT_START', {
            containerId: container.getAttribute('container'),
            editableId: $event.srcElement.getAttribute('editable')
        });
    },
    emit: function emit($event) {
        var container = function getContainer(el) {
            if (el.parentElement) {
                if (el.parentElement.getAttribute('container')) {
                    return el.parentElement;
                } else {
                    return getContainer(el.parentElement);
                }
            } else return document.body;
        }($event.srcElement);

        app.webSocket.send('EDIT', $event.srcElement.innerHTML);

        $event.srcElement;

        this.emitter.emit('This is some value from children');
    }
});

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
// Keep checking
function updateTools() {
    if (document.getSelection().rangeCount) {
        // Font color
        document.querySelector('.tool--font-color').style.borderBottomColor = document.defaultView.getComputedStyle(document.getSelection().getRangeAt(0).commonAncestorContainer.parentNode, null).getPropertyValue('color');

        // Font bold
        if (document.defaultView.getComputedStyle(document.getSelection().getRangeAt(0).commonAncestorContainer.parentNode, null).getPropertyValue('font-weight') === 'bold') {
            document.querySelector('.tool--font-bold').classList.add('active');
        } else {
            document.querySelector('.tool--font-bold').classList.remove('active');
        }
    }
}

window.addEventListener('click', updateTools);
window.addEventListener('keyup', updateTools);

exports.default = ng.core.Component({
    selector: 'ngp-toolbox',
    templateUrl: '/client/ng-publify/templates/toolbox.html'
}).Class({
    constructor: function constructor() {}
});

},{}]},{},[1])


//# sourceMappingURL=build.js.map
