export default class ContentService {
    constructor() {
        this.API_PATH = 'localhost:3000';
    }
    
    getId() {
        return this.API_PATH;
    };
}