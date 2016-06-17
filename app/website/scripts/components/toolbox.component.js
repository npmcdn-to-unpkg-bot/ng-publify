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

export default ng.core.Component({
    selector: 'ngp-toolbox',
    templateUrl: '/ng-publify-core/templates/toolbox.html'
}).Class({
    constructor: function() {
        
    }
});
