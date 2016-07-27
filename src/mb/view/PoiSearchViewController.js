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
        return new PoiSearchView("poi-search-view", options);
    }

    initView()
    {
        super.initView();
        this.view.attachInput(this._poiSearchView_oninput.bind(this));
        this.view.attachPoiChanged(this._poiSearchView_onpoichanged.bind(this));
    }




    _poiSearchView_oninput(e)
    {
        const keyword = e.getParameter("keyword");
        ServiceClient.getInstance().searchPoiAutocomplete(keyword).then(tips => {
            this.view.setPoiTips(tips);
        }, err => console.error(err));
    }

    _poiSearchView_onpoichanged(e)
    {
        sap.ui.getCore().getModel().setProperty("/selectedPoi", this.view.getPoi());
    }
}
