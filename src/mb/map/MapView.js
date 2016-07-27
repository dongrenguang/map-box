import AdaptiveMapView from "sap/a/map/MapView";
import TileLayer from "sap/a/map/layer/TileLayer";

import ServiceClient from "gaode/service/ServiceClient";

import NaviLayer from "./layer/NaviLayer";
import SelectionPoiLayer from "./layer/SelectionPoiLayer";

export default class MapView extends AdaptiveMapView
{
    metadata = {
        events: {
            click: {}
        }
    };

    afterInit()
    {
        super.afterInit();
        this.addStyleClass("mb-map-view");
        this.map.on("click", this._onclick.bind(this));
    }

    initLayers()
    {
        this.tileLayer = new TileLayer({
            url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png"
        });
        this.addLayer(this.tileLayer);

        this.naviLayer = new NaviLayer();
        this.addLayer(this.naviLayer);

        this.selectionPoiLayer = new SelectionPoiLayer();
        this.addLayer(this.selectionPoiLayer);
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




    _onclick(e)
    {
        this.fireClick({ location: e.latlng });
    }
}
