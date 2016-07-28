import AdaptiveApplicationController from "sap/a/app/ApplicationController";

import Application from "./Application";
import MapViewController from "../map/MapViewController";
import Model from "../model/Model";
import PoiSearchViewController from "../view/PoiSearchViewController";

export default class ApplicationController extends AdaptiveApplicationController
{
    init()
    {
        super.init();
        this._initModel();
    }

    afterInit()
    {
        super.afterInit();
        this._initMapViewController();
        this._initPoiSearchViewController();
    }

    _initModel()
    {
        const model = new Model();
        sap.ui.getCore().setModel(model);

        const bindingSelectedPoi = model.bindProperty("/selectedPoi");
        bindingSelectedPoi.attachChange(this._onSelectedPoiChanged.bind(this));

        const bindingQueryPoi = model.bindProperty("/queryPoi");
        bindingQueryPoi.attachChange(this._onQueryPoiChanged.bind(this));
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




    _onSelectedPoiChanged()
    {
        const selectedPoi = sap.ui.getCore().getModel().getProperty("/selectedPoi");
        if (selectedPoi && selectedPoi.location)
        {
            this.mapView.setCenterLocation(selectedPoi.location);
            this.mapViewController.updateSelectedPoiMarker(selectedPoi.location);
            this.mapView.setZoom(13);
        }
    }

    _onQueryPoiChanged()
    {
        const queryPoi  = sap.ui.getCore().getModel().getProperty("/queryPoi");
        if (queryPoi)
        {
            this.poiSearchView.setQueryPoi(queryPoi);
        }
    }
}
