import ViewController from "sap/a/view/ViewController";

import ODSearchView from "./ODSearchView";
import PoiSearchViewController from "./PoiSearchViewController";

export default class ODSearchViewController extends ViewController
{
    afterInit()
    {
        super.afterInit();
        this.view.attachSwitch(this._onswitch.bind(this));
        this.view.attachSearch(this._onsearch.bind(this));
        this._initControllers();
    }

    createView(options)
    {
        return new ODSearchView("od-search-view", options);
    }

    _initControllers()
    {
        this._initOriginPoiSearchViewController();
        this._initDestinationPoiSearchViewController();
    }

    _initOriginPoiSearchViewController()
    {
        this.originPoiSearchViewController = new PoiSearchViewController({
            viewOptions: {
                id: "originPoiSearchViewController",
                placeholder: "请输入起点",
                selectedPoi: "{/originPoi}"
            }
        });
        this.addChildViewController(this.originPoiSearchViewController);
        this.originPoiSearchViewController.attachSelect(this._originPoiSearchView_onselect.bind(this));
    }

    _initDestinationPoiSearchViewController()
    {
        this.destinationPoiSearchViewController = new PoiSearchViewController({
            viewOptions: {
                id: "destinationPoiSearchViewController",
                placeholder: "请输入终点",
                selectedPoi: "{/destinationPoi}"
            }
        });
        this.addChildViewController(this.destinationPoiSearchViewController);
        this.destinationPoiSearchViewController.attachSelect(this._destinationPoiSearchView_onselect.bind(this));
    }




    _onswitch(e)
    {
        let originPoi = this.originPoiSearchViewController.view.getSelectedPoi();
        let destinationPoi = this.destinationPoiSearchViewController.view.getSelectedPoi();
        if (originPoi && destinationPoi)
        {
            originPoi = JSON.parse(JSON.stringify(originPoi));
            destinationPoi = JSON.parse(JSON.stringify(destinationPoi));
            this.getModel().forceSetProperty("/originPoi", destinationPoi);
            this.getModel().forceSetProperty("/destinationPoi", originPoi);
        }
    }

    _onsearch(e)
    {
        // TODO
    }

    _originPoiSearchView_onselect(e)
    {
        const selectedPoi = e.getParameter("selectedPoi");
        this.getModel().forceSetProperty("/originPoi", selectedPoi);
    }

    _destinationPoiSearchView_onselect(e)
    {
        const selectedPoi = e.getParameter("selectedPoi");
        this.getModel().forceSetProperty("/destinationPoi", selectedPoi);
    }
}
