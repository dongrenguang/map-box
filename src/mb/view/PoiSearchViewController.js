import ViewController from "sap/a/view/ViewController";

import PoiSearchView from "./PoiSearchView";
import ServiceClient from "../../gaode/service/ServiceClient";

export default class PoiSearchViewController extends ViewController
{
    afterInit()
    {
        super.afterInit();
    }

    createView(options)
    {
        const opt = $.extend({
            selectedPoi: "{/selectedPoi}",
            tipPoi: "{/tipPoi}"
        }, options);
        return new PoiSearchView("poi-search-view", opt);
    }

    initView()
    {
        super.initView();
        this.view.attachInput(this._poiSearchView_oninput.bind(this));
        this.view.attachSearch(this._poiSearchView_onsearch.bind(this));
    }




    _poiSearchView_oninput(e)
    {
        const keyword = e.getParameter("keyword");
        ServiceClient.getInstance().searchPoiAutocomplete(keyword).then(tips => {
            // TODO
            // this.view.setPoiTips(tips);
        });
    }

    _poiSearchView_onsearch(e)
    {
        const keyword = e.getParameter("keyword");
        ServiceClient.getInstance().searchPoiAutocomplete(keyword).then(tips => {
            const topPoi = { name: tips[0].name, location: L.latLng(tips[0].location) };
            this.getModel().setProperty("/selectedPoi", topPoi);
        }, error => console.error(error));
    }
}
