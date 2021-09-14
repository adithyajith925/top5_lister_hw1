import jsTPS_Transaction from "../../common/jsTPS.js"

/**
 * ChangeItem_Transaction
 * 
 * This class represents a transaction that updates the text
 * for a given item. It will be managed by the transaction stack.
 * 
 * @author McKilla Gorilla
 * @author adithyajith925
 */
export default class SwapItem_Transaction extends jsTPS_Transaction {
    constructor(initModel, initOldId, initNewId) {
        super();
        this.model = initModel;
        this.oldId = initOldId;
        this.newId = initNewId;
    }

    doTransaction() {
        this.model.swapItems(this.oldId, this.newId);
    }
    
    undoTransaction() {
        this.model.swapItems(this.newId, this.oldId);
    }
}