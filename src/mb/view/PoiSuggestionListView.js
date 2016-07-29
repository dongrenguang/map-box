import View from "sap/a/view/BaseListView";

export default class PoiSuggestionListView extends View
{
    metadata = {
        events: {
            selectedPoiChanged: { parameters: { selectedPoi: "object" } }
        }
    };
    afterInit()
    {
        super.afterInit();
        this.addStyleClass("mb-poi-suggestion-list-view");
        this.attachItemClick(this._itemclick.bind(this));
    }

    _itemclick(e)
    {
        const selectedItem = e.getParameter("item");
        const selectedPoi = { name: selectedItem.name, location: selectedItem.location };
        this.fireSelectedPoiChanged({ selectedPoi });
    }


}
