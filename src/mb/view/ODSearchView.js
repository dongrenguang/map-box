import View from "sap/a/view/View";

export default class ODSearchView extends View
{
    metadata = {
        events: {
            switch: {},
            search: {}
        }
    };

    afterInit()
    {
        super.afterInit();
        this.addStyleClass("mb-od-search-view");
        this._initLayout();
    }

    _initLayout()
    {
        const $lineSearch = $(`
            <div class="line-search">
                <div class="search-views" />
                <span class="icon iconfont icon-switch switch-button" />
            </div>
        `);
        const $searchButtonWrapper = $(`
            <div class="search-button-wrapper">
                <div class="search-button">
                    <span class="text">查询路线</span>
                </div>
            </div>
        `);
        this.$element.append($lineSearch);
        this.$element.append($searchButtonWrapper);
        this.$container = $lineSearch.children(".search-views");

        const $switchButton = $lineSearch.children(".switch-button");
        $switchButton.on("click", () => {
            this.fireSwitch();
        });

        const $searchButton = $searchButtonWrapper.children(".search-button");
        $searchButton.on("click", () => {
            this.fireSearch();
        });
    }
}
