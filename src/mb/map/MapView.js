import AdaptiveMapView from "sap/a/map/MapView";
import TileLayer from "sap/a/map/layer/TileLayer";

import ServiceClient from "gaode/service/ServiceClient";

import NaviLayer from "./layer/NaviLayer";

export default class MapView extends AdaptiveMapView
{
    afterInit()
    {
        super.afterInit();
        this.addStyleClass("mb-map-view");
    }

    initLayers()
    {
        this.tileLayer = new TileLayer({
            url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png"
        });
        this.addLayer(this.tileLayer);

        this.naviLayer = new NaviLayer();
        this.addLayer(this.naviLayer);
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
}
