import ViewController from "sap/a/view/ViewController";

import ServiceClient from "../../gaode/service/ServiceClient";

import MapView from "./MapView";

export default class MapViewController extends ViewController
{
    afterInit()
    {
        super.afterInit();
        this.naviLayer = this.view.naviLayer;
        this.view.attachSearchRoute(this._onsearchroute.bind(this));
    }

    createView(options)
    {
        const opts = $.extend({
            originPoi: "{/originPoi}",
            destinationPoi: "{/destinationPoi}"
        }, options);
        return new MapView("map-view", opts);
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




    _onsearchroute(e)
    {
        const originPoi = e.getParameter("originPoi");
        const destinationPoi = e.getParameter("destinationPoi");
        const startLocation = originPoi.location;
        const endLocation = destinationPoi.location;
        this.searchRoute(startLocation, endLocation);
    }
}
