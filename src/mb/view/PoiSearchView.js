import View from "sap/a/view/View";

export default class PoiSearchView extends View
{
    metadata = {
        properties: {
            selectedPoi: { type: "object", bindable: true },
            tipPoi: { type: "object", bindable: true },
        },
        events: {
            input: { parameters: { keyword: "string" } },
            search: { parameters: { keyword: "string" } }
        }
    };

    afterInit()
    {
        super.afterInit();
        this.addStyleClass("mb-poi-search-view");
        this._initLayout();
    }

    _initLayout()
    {
        this._initSearchInput();
    }

    _initSearchInput()
    {
        this.$searchInput = $(`<input type="search" placeholder="搜索" />`)
        this.$element.append(this.$searchInput);

        let inputTimeout = null;
        this.$searchInput.on("input", () => {
            if (inputTimeout)
            {
                clearTimeout(inputTimeout);
                inputTimeout = null;
            }
            inputTimeout = setTimeout(() => {
                this.fireInput({ keyword: this.$searchInput.val() });
            }, 500);
        });

        this.$searchInput.on("keydown", this._onkeydown.bind(this))
    }

    setSelectedPoi(selectedPoi)
    {
        this.setProperty("selectedPoi", selectedPoi);
        if (selectedPoi && selectedPoi.name)
        {
            this.$searchInput.val(selectedPoi.name);
        }
        else
        {
            this.$searchInput.val("");
        }
    }

    setTipPoi(tipPoi)
    {
        this.setProperty("tipPoi", tipPoi);
        if (tipPoi && tipPoi.name)
        {
            this.$searchInput.val(tipPoi.name);
        }
    }




    _onkeydown(e)
    {
        if (e.keyCode === 13)
        {
            // Enter key
            this._onsearch(this.$searchInput.val());
        }
    }

    _onsearch(keyword)
    {
        this.fireSearch({ keyword });
    }
}
