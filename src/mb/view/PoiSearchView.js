import View from "sap/a/view/View";

export default class PoiSearchView extends View
{
    metadata = {
        properties: {
            poi: { type: "object" },
            poiTips: { type: "object" }, // Array
            queryPoi: { type: "object" }
        },
        events: {
            input: { parameters: { keyword: "string" } },
            poiChanged: {}
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

    setPoi(poi)
    {
        this.setProperty("poi", poi);
        this.firePoiChanged();
        if (poi && poi.name)
        {
            this.$searchInput.val(poi.name);
        }
    }

    setQueryPoi(queryPoi)
    {
        this.setProperty("queryPoi", queryPoi);
        if (queryPoi && queryPoi.name)
        {
            this.$searchInput.val(queryPoi.name);
        }
    }




    _onkeydown(e)
    {
        const poiTips = this.getPoiTips();
        if (e.keyCode === 13 && poiTips && poiTips.length > 0)
        {
            const firstTip = poiTips[0];
            this.setPoi({ name: firstTip.name, location: firstTip.location });
        }
    }
}
