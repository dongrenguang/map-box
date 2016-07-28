import ViewController from "sap/a/view/ViewController";

import ServiceClient from "../../gaode/service/ServiceClient";

import MapView from "./MapView";

export default class MapViewController extends ViewController
{
    afterInit()
    {
        super.afterInit();
    }

    createView(options)
    {
        return new MapView("map-view", options);
    }

    initView()
    {
        super.initView();
        this.view.attachClick(this._mapView_onclick.bind(this));

        this.tileLayer = this.view.tileLayer;
        this.selectionPoiLayer = this.view.selectionPoiLayer;
    }

    searchRoute(startLocation, endLocation)
    {
        this.naviLayer.applySettings({
            startLocation,
            endLocation
        });

        this.naviLayer.fitBounds();

        ServiceClient.getInstance().searchDrivingRoutes([startLocation, endLocation]).then(routes => {
            this.naviLayer.drawRoute(routes);
        });
    }

    updateSelectedPoiMarker(location)
    {
        this.selectionPoiLayer.updateSelectedPoiMarker(location);
    }




    _mapView_onclick(e)
    {
        const location = e.getParameter("location");
        ServiceClient.getInstance().searchGeocoder(location).then(result => {
            const name = result.formattedAddress;
            sap.ui.getCore().getModel().setProperty("/queryPoi", { name, location });
        }, error => console.error(error));
    }
}
