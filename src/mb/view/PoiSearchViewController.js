import ViewController from "sap/a/view/ViewController";

import PoiSearchView from "./PoiSearchView";
import ServiceClient from "../../gaode/service/ServiceClient";

export default class PoiSearchViewController extends ViewController
{
    metadata = {
        events: {
            select: { parameters: { selectedPoi: "object" } }
        }
    };

    afterInit()
    {
        super.afterInit();
        this.view.attachInput(this._poiSearchView_oninput.bind(this));

        this.poiSuggestionListView = this.view.poiSuggestionListView;
        this.poiSuggestionListView.attachSelectedPoiChanged((e) => {
            this.fireSelect({ selectedPoi: e.getParameter("selectedPoi") });
        });
    }

    createView(options)
    {
        const opt = $.extend({
            selectedPoi: "{/selectedPoi}",
            tipPoi: "{/tipPoi}"
        }, options);
        return new PoiSearchView(opt);
    }




    _poiSearchView_oninput(e)
    {
        const keyword = e.getParameter("keyword");
        if (keyword.trim() === "")
        {
            this.view.setPoiSuggestions([]);
        }
        else
        {
            ServiceClient.getInstance().searchPoiAutocomplete(keyword).then(tips => {
                this.view.setPoiSuggestions(tips);
            });
        }
    }
}
