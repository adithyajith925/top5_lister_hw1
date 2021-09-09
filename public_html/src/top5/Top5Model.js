import jsTPS from "../common/jsTPS.js"
import Top5List from "./Top5List.js";
import ChangeItem_Transaction from "./transactions/ChangeItem_Transaction.js"
import ChangeList_Transaction from "./transactions/ChangeList_Transaction.js"

/**
 * Top5Model.js
 * 
 * This class provides access to all the data, meaning all of the lists. 
 * 
 * This class provides methods for changing data as well as access
 * to all the lists data.
 * 
 * Note that we are employing a Model-View-Controller (MVC) design strategy
 * here so that when data in this class changes it is immediately reflected
 * inside the view of the page.
 * 
 * @author McKilla Gorilla
 * @author ?
 */
export default class Top5Model {
    constructor() {
        // THIS WILL STORE ALL OF OUR LISTS
        this.top5Lists = [];

        // THIS IS THE LIST CURRENTLY BEING EDITED
        this.currentList = null;

        // THIS WILL MANAGE OUR TRANSACTIONS
        this.tps = new jsTPS();

        // WE'LL USE THIS TO ASSIGN ID NUMBERS TO EVERY LIST
        this.nextListId = 0;
    }

    getList(index) {
        return this.top5Lists[index];
    }

    getListIndex(id) {
        for (let i = 0; i < this.top5Lists.length; i++) {
            let list = this.top5Lists[i];
            if (list.id === id) {
                return i;
            }
        }
        return -1;
    }

    setView(initView) {
        this.view = initView;
    }

    deleteList(id) {
        this.nextListId--;
        this.top5Lists.splice(id, 1);
        for (let i = 0; i < this.top5Lists.length; i++) {
            this.top5Lists[i].setId(i);
        }
        if (this.hasCurrentList() && this.currentList.getId() === id) {
            this.unselectAll();
        }
        this.sortLists();
        this.saveLists();
        this.view.refreshLists(this.top5Lists);
    }

    addNewList(initName, initItems) {
        let newList = new Top5List(this.nextListId++);
        if (initName)
            newList.setName(initName);
        if (initItems)
            newList.setItems(initItems);
        this.top5Lists.push(newList);
        this.sortLists();
        this.view.refreshLists(this.top5Lists);
        this.view.updateToolbarButtons(this);
        return newList;
    }

    sortLists() {
        this.top5Lists.sort((listA, listB) => {
            if (listA.getName().toLowerCase() < listB.getName().toLowerCase()) {
                return -1;
            }
            else if (listA.getName().toLowerCase() === listB.getName().toLowerCase()) {
                return 0;
            }
            else {
                let temp = listA.id;
                listA.setId(listB.getId());
                listB.setId(temp);
                return 1;
            }
        });
        this.view.refreshLists(this.top5Lists);
    }

    hasCurrentList() {
        return this.currentList !== null;
    }

    unselectAll() {
        this.currentList = null;
        for (let i = 0; i < this.top5Lists.length; i++) {
            let list = this.top5Lists[i];
            this.view.unhighlightList(i);
        }
        this.view.clearWorkspace();
    }

    mouseEntered(id) {
        this.view.hoverList(id, this.currentList);
    }

    mouseExited(id) {
        this.view.unhoverList(id, this.currentList);
    }

    loadList(id) {
        let list = null;
        let found = false;
        let i = 0;
        while ((i < this.top5Lists.length) && !found) {
            list = this.top5Lists[i];
            if (list.id === id) {
                // THIS IS THE LIST TO LOAD
                this.currentList = list;
                this.view.update(this.currentList);
                this.view.highlightList(i);
                found = true;
            }
            i++;
        }
        // this.tps.clearAllTransactions();
        this.view.updateToolbarButtons(this);
    }

    loadLists() {
        // CHECK TO SEE IF THERE IS DATA IN LOCAL STORAGE FOR THIS APP
        let recentLists = localStorage.getItem("recent_work");
        if (!recentLists) {
            return false;
        }
        else {
            let listsJSON = JSON.parse(recentLists);
            this.top5Lists = [];
            for (let i = 0; i < listsJSON.length; i++) {
                let listData = listsJSON[i];
                let items = [];
                for (let j = 0; j < listData.items.length; j++) {
                    items[j] = listData.items[j];
                }
                this.addNewList(listData.name, items);
            }
            this.sortLists();   
            this.view.refreshLists(this.top5Lists);
            return true;
        }        
    }

    saveLists() {
        let top5ListsString = JSON.stringify(this.top5Lists);
        localStorage.setItem("recent_work", top5ListsString);
    }

    restoreList() {
        this.view.update(this.currentList);
    }

    addChangeItemTransaction = (id, newText) => {
        // GET THE CURRENT TEXT
        let oldText = this.currentList.items[id];
        let transaction = new ChangeItem_Transaction(this, id, oldText, newText);
        this.tps.addTransaction(transaction);
        this.view.updateToolbarButtons(this);
    }

    addChangeListTransaction = (name, newText) => {
        let oldText = this.currentList.getName();
        let transaction = new ChangeList_Transaction(this, name, oldText, newText);
        this.tps.addTransaction(transaction);
        this.view.updateToolbarButtons(this);
    }

    changeItem(id, text) {
        this.currentList.items[id] = text;
        this.view.update(this.currentList);
        this.saveLists();
    }

    changeList(id, text) {
        let uniq = 0;
        this.top5Lists.forEach(element => {
            if (element.getUniq() === id) {
                uniq = element.getUniq();
                element.setName(text);
            }
        });
        // this.view.update(this.currentList);
        this.sortLists();
        this.saveLists();
        this.top5Lists.forEach(element => {
            if (element.getUniq() === uniq) {
                this.loadList(element.getId());
            }
        });
        // this.view.refreshLists(this.top5Lists);
    }

    // SIMPLE UNDO/REDO FUNCTIONS
    undo() {
        if (this.tps.hasTransactionToUndo()) {
            this.tps.undoTransaction();
            this.view.updateToolbarButtons(this);
        }
    }

    redo() {
        if (this.tps.hasTransactionTo()) {
            this.tps.doTransaction();
            this.view.updateToolbarButtons(this);
        }
    }
}