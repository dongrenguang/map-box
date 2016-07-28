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
        const opt = $.extend({
            selectedPoi: "{/selectedPoi}",
            tipPoi: "{/tipPoi}"
        }, options);
        return new MapView("map-view", opt);
    }

    initView()
    {
        super.initView();
        this.view.attachClick(this._mapView_onclick.bind(this));
        this.naviLayer = this.view.naviLayer; // TODO delete
    }

    searchRoute(startLocation, endLocation)
    {
        // TODO
        this.naviLayer.applySettings({
            startLocation,
            endLocation
        });

        this.naviLayer.fitBounds();

        ServiceClient.getInstance().searchDrivingRoutes([startLocation, endLocation]).then(routes => {
            this.naviLayer.drawRoute(routes);
        });
    }




    _mapView_onclick(e)
    {
        const location = L.latLng(e.getParameter("location"));
        ServiceClient.getInstance().searchGeocoder(location).then(result => {
            const name = result.formattedAddress;
            this.getModel().setProperty("/tipPoi", { name, location });
        }, error => console.error(error));
    }
}
