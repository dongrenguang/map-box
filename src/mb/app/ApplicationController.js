import AdaptiveApplicationController from "sap/a/app/ApplicationController";

import Application from "./Application";

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
        this._initApplication();
    }

    _initModel()
    {
        const model = new sap.ui.model.json.JSONModel({
            selectedPoi: null,
            queryPoi: null
        });
        sap.ui.getCore().setModel(model);

        const bindingSelectedPoi = model.bindProperty("/selectedPoi");
        bindingSelectedPoi.attachChange(this._onSelectedPoiChanged.bind(this));

        const bindingQueryPoi = model.bindProperty("/queryPoi");
        bindingQueryPoi.attachChange(this._onQueryPoiChanged.bind(this));
    }

    _initApplication()
    {
        this.mapView = this.view.mapViewController.view;
        this.poiSearchView = this.view.poiSearchViewController.view;
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
            this.mapView.updateSelectedPoiMarker(selectedPoi.location);
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
