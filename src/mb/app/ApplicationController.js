import AdaptiveApplicationController from "sap/a/app/ApplicationController";

import Application from "./Application";
import MapViewController from "../map/MapViewController";
import Model from "../model/Model";
import ODSearchViewController from "../view/ODSearchViewController";

export default class ApplicationController extends AdaptiveApplicationController
{
    afterInit()
    {
        super.afterInit();
        this._initModel();
        this._initMapViewController();
        this._initODSearchViewController();
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

    _initODSearchViewController()
    {
        this.odSearchViewController = new ODSearchViewController();
        this.addChildViewController(this.odSearchViewController);
    }

    createView(options)
    {
        return new Application("application", options);
    }

    run()
    {

    }
}
