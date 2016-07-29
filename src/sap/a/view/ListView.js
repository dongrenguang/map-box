import View from "./View";

export default class ListView extends View
{
    metadata = {
        properties: {
            items: { type: "object", defaultValue: [] }, // Array
            selection: { type: "any", defaultValue: null },
            selectedId: { type: "any" }
        },
        events: {
            itemClicked: { parameters: { item: "object" }}
        }
    };

    afterInit() {
        super.afterInit();
        this.addStyleClass("sap-a-list-view");
        this._$itemTemplates = [];

        this.$container.on("mousedown", this.getItemElementTag(), this._onclick.bind(this));
    }

    getElementTag()
    {
        return "ul";
    }

    getItemElementTag()
    {
        return "li";
    }

    setItems(items)
    {
        this.setProperty("items", items);
        this.removeAllItems();
        this.addItems(items);
    }

    getSelectedId()
    {
        return this.getIdOfItem(this.getSelection());
    }

    getTypeOfItem(item)
    {
        return 0;
    }

    getIdOfItem(item)
    {
        if (item && item.id)
        {
            return item.id;
        }
        else
        {
            return null;
        }
    }

    removeAllItems()
    {
        this.setSeletion(null);
        if (this.getItems() !== null)
        {
            if (this.getItems().length > 0)
            {
                this.$container.children(this.getItemElementTag()).remove();
            }
        }
    }

    addItems(items)
    {
        if (items && items.length)
        {
            items.forEach(item => {
                this.addItem(item);
            });
        }
    }

    addItem(item)
    {
        const itemType = this.getTypeOfItem(item);
        const $item = this.$createItem(itemType);
        this.renderItem(item, $item);
        this.$container.append($item);
    }




    selectItem(item = null)
    {
        if (this.selection === item)
        {
            return;
        }

        if (this.selection !== null)
        {
            this.$getItem(this.selection).removeClass("selected");
            this._selection = null;
        }

        this._selection = item;

        if (item)
        {
            const $item = this.$getItem(item);
            $item.addClass("selected");
        }

        this.trigger("selectionchanged");
    }

    showSelection()
    {
        this.removeStyleClass("hide-selection");
    }

    hideSelection()
    {
        this.addStyleClass("hide-selection");
    }




    renderItem(item, $item)
    {
        $item.data("item", item);
        $item.attr("id", `i-${this.getIdOfItem(item)}`);
    }

    $createItem(itemType = 0)
    {
        if (!this._itemTemplates[itemType])
        {
            this._itemTemplates[itemType] = this.$createNewItem(itemType);
        }

        return this._itemTemplates[itemType].clone();
    }

    $createNewItem(itemType = 0)
    {
        return $(`<${this.getItemElementTag()} />`);
    }

    $getItem(item)
    {
        const id = this.getIdOfItem(item);
        return this.$container.children(`#i-${id}`);
    }




    _onclick(e)
    {
        const $item = $(e.currentTarget);
        const item = $item.data("item");
        this.selectItem(item);
        this.fireItemClicked();
    }
}
