import AdaptiveApplication from "sap/a/app/Application";

import MapViewController from "../map/MapViewController";
import PoiSearchViewController from "../view/PoiSearchViewController";

export default class Application extends AdaptiveApplication
{
    afterInit()
    {
        super.afterInit();
        this.addStyleClass("mb-app");
        this._initMapViewController();
        this._initPoiSearchViewController();
    }

    _initMapViewController()
    {
        this.mapViewController = new MapViewController({
            viewOptions: {
                defaultZoom: 10
            }
        });
        this.addSubview(this.mapViewController.view);
    }

    _initPoiSearchViewController()
    {
        this.poiSearchViewController = new PoiSearchViewController();
        this.addSubview(this.poiSearchViewController.view);
    }
}
