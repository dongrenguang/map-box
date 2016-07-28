import AdaptiveApplicationController from "sap/a/app/ApplicationController";

import Application from "./Application";
import MapViewController from "../map/MapViewController";
import Model from "../model/Model";
import PoiSearchViewController from "../view/PoiSearchViewController";

export default class ApplicationController extends AdaptiveApplicationController
{
    afterInit()
    {
        super.afterInit();
        this._initModel();
        this._initMapViewController();
        this._initPoiSearchViewController();
    }

    _initModel()
    {
        const model = new Model();
        sap.ui.getCore().setModel(model);
        this.setModel(model);
    }

    _initMapViewController()
    {
        this.mapViewController = new MapViewController({
            viewOptions: {
                defaultZoom: 10
            }
        });
        this.addChildViewController(this.mapViewController);
        this.mapView = this.mapViewController.view;
    }

    _initPoiSearchViewController()
    {
        this.poiSearchViewController = new PoiSearchViewController();
        this.addChildViewController(this.poiSearchViewController);
        this.poiSearchView = this.poiSearchViewController.view;
    }

    createView(options)
    {
        return new Application("application", options);
    }

    run()
    {

    }
}
