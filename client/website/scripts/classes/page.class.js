export class Page {
    constructor(id) {
        this.id = id;
    }
    children(callback) {
        app.content.getChildrenOfPage(this)
    }
}