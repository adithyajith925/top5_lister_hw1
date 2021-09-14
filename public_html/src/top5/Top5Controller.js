/**
 * Top5ListController.js
 * 
 * This file provides responses for all user interface interactions.
 * 
 * @author McKilla Gorilla
 * @author ?
 */
export default class Top5Controller {
    constructor() {

    }

    setModel(initModel) {
        this.model = initModel;
        this.initHandlers();
    }

    initHandlers() {
        // SETUP THE TOOLBAR BUTTON HANDLERS
        document.getElementById("add-list-button").onclick = (event) => {
            let newList = this.model.addNewList("Untitled", ["?","?","?","?","?"]);    
            let id = newList.id;
            let item = document.getElementById("top5-list-" + id);
            this.model.loadList(id);
            let uniq = this.model.currentList.getUniq();
            item.innerHTML = "";
            
            let textInput = document.createElement("input");
            textInput.setAttribute("type", "text");
            textInput.setAttribute("id", "list-text-input-");
            textInput.setAttribute("value", this.model.currentList.getName());
            item.appendChild(textInput);

            textInput.focus();

            textInput.ondblclick = (event) => {
                this.ignoreParentClick(event);
            }
            textInput.onkeydown = (event) => {
                if (event.key === 'Enter') {
                    this.model.addChangeListTransaction(uniq, event.target.value);
                }
            }
            textInput.onblur = (event) => {
                this.model.addChangeListTransaction(uniq, event.target.value);
                // item.removeChild(textInput);
                this.model.restoreList();
            }
            // this.model.sortLists();        
            // this.model.loadList(newList.id);
            this.model.saveLists();
        }
        document.getElementById("undo-button").onmousedown = (event) => {
            this.model.undo();
        }

        document.getElementById("redo-button").onmousedown = (event) => {
            this.model.redo();
        }

        document.getElementById("close-button").onmousedown = (event) => {
            this.model.unselectAll();
        }

        // SETUP THE ITEM HANDLERS
        for (let i = 1; i <= 5; i++) {
            let item = document.getElementById("item-" + i);

            // AND FOR TEXT EDITING

            item.ondrop = (ev) => {
                ev.preventDefault();
                let oldId = parseInt(ev.dataTransfer.getData("text"));
                this.model.addSwapItemTransaction(oldId, i-1);
                this.model.restoreList();
            }
            item.ondragover = (ev) => {
                ev.preventDefault();
            }
            item.ondragstart = (ev) => {
                ev.dataTransfer.setData("text", i-1)
            }
            item.ondblclick = (ev) => {
                if (this.model.hasCurrentList()) {
                    // CLEAR THE TEXT
                    item.innerHTML = "";

                    // ADD A TEXT FIELD
                    let textInput = document.createElement("input");
                    textInput.setAttribute("type", "text");
                    textInput.setAttribute("id", "item-text-input-" + i);
                    textInput.setAttribute("value", this.model.currentList.getItemAt(i-1));

                    item.appendChild(textInput);

                    textInput.focus();

                    textInput.ondblclick = (event) => {
                        this.ignoreParentClick(event);
                    }
                    textInput.onkeydown = (event) => {
                        if (event.key === 'Enter') {
                            if (event.target.value === "") {
                                event.target.value = "?"
                            }
                            this.model.addChangeItemTransaction(i-1, event.target.value);       
                        }
                    }
                    textInput.onblur = (event) => {
                        this.model.restoreList();
                    }
                }
            }
        }
    }

    registerListSelectHandlers(id) {
        document.getElementById("top5-list-" + id).onmouseenter = (event) => {
            this.model.mouseEntered(id);
        }
    
        document.getElementById("top5-list-" + id).onmouseleave = (event) => {
            this.model.mouseExited(id);
        }
        // FOR SELECTING THE LIST
        document.getElementById("top5-list-" + id).onmousedown = (event) => {
            this.model.unselectAll();

            // GET THE SELECTED LIST
            this.model.loadList(id);
            // let status = document.getElementById("top5-statusbar");
            
            // let textSpan = document.createElement("span");
            // status.innerHTML = "Top 5 " + this.model.currentList.getName();
            // status.classList.add("top5-selected");
            

            // status.appendChild(textSpan);

        }
        
            
        let item = document.getElementById("top5-list-" + id);
        item.ondblclick = (ev) => {
            
            this.model.unselectAll();

            // GET THE SELECTED LIST
            this.model.loadList(id);
            let uniq = this.model.currentList.getUniq();
            item.innerHTML = "";
            
            let textInput = document.createElement("input");
            textInput.setAttribute("type", "text");
            textInput.setAttribute("id", "list-text-input-");
            textInput.setAttribute("value", this.model.currentList.getName());
            item.appendChild(textInput);

            textInput.focus();

            textInput.ondblclick = (event) => {
                this.ignoreParentClick(event);
            }
            textInput.onkeydown = (event) => {
                if (event.key === 'Enter') {
                    if (event.target.value === "") {
                        event.target.value = "Untitled";
                    }
                    this.model.addChangeListTransaction(uniq, event.target.value);
                }
            }
            textInput.onblur = (event) => {
                if (event.target.value === "") {
                    event.target.value = "Untitled";
                }
                this.model.addChangeListTransaction(uniq, event.target.value);
                // item.removeChild(textInput);
                this.model.restoreList();
            }
        }
        // EDITING LIST
        // FOR DELETING THE LIST
        document.getElementById("delete-list-" + id).onmousedown = (event) => {
            this.ignoreParentClick(event);
            // VERIFY THAT THE USER REALLY WANTS TO DELETE THE LIST
            let modal = document.getElementById("delete-modal");
            this.listToDeleteIndex = id;
            let listName = this.model.getList(id).getName();
            let deleteSpan = document.getElementById("delete-list-span");
            deleteSpan.innerHTML = "";
            deleteSpan.appendChild(document.createTextNode(listName));
            modal.classList.add("is-visible");
            let cancel = document.getElementById("dialog-cancel-button");
            cancel.onclick = (event) => {
                modal.classList.remove("is-visible");
            }

            let confirm = document.getElementById("dialog-confirm-button");
            confirm.onclick = (event) => {
                this.model.deleteList(id);
                if (this.model.hasCurrentList()) {
                    this.model.loadList(this.model.currentList.getId());
                }
                modal.classList.remove("is-visible");
            }
        }
    }

    ignoreParentClick(event) {
        event.cancelBubble = true;
        if (event.stopPropagation) event.stopPropagation();
    }
}