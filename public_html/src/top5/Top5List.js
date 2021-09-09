/**
 * Top5List.js
 * 
 * This class represents a list with all the items in our Top5 list.
 * 
 * @author McKilla Gorilla
 * @author ?
 */
export default class Top5List {
    constructor(initId) {
        this.id = initId;
        this.uniq = initId;
    }

    getName() {
        return this.name;
    }

    getId() {
        return this.id;
    }

    setId(initId) {
        this.id = initId;
    }

    setName(initName) {
        this.name = initName;
    }

    getUniq() {
        return this.uniq;
    }

    getItemAt(index) {
        return this.items[index];
    }

    setItemAt(index, item) {
        this.items[index] = item;
    }

    setItems(initItems) {
        this.items = initItems;
    }

    moveItem(oldIndex, newIndex) {
        this.items.splice(newIndex, 0, this.items.splice(oldIndex, 1)[0]);
    }
}