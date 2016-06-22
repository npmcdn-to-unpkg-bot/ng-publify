module.exports = class Usergroup {
    constructor(name) {
        this.name = name;
        this._conditions = [];
    }
    addCondition(condition) {
        this._conditions.push(condition);
        return this;
    }
};