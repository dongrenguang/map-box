import AdaptiveMapView from "sap/a/map/MapView";
import TileLayer from "sap/a/map/layer/TileLayer";

import NaviLayer from "./layer/NaviLayer";
import SelectionPoiLayer from "./layer/SelectionPoiLayer";

export default class MapView extends AdaptiveMapView
{
    metadata = {
        properties: {
            selectedPoi: { type: "object", bindable: true },
            tipPoi: { type: "object", bindable: true }
        },
        events: {
            click: { parameters: { location: "object" } }
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

    setSelectedPoi(selectedPoi)
    {
        this.setProperty("selectedPoi", selectedPoi);
        if (selectedPoi)
        {
            this.updateSelectedPoiMarker();
            this.setCenterLocation(selectedPoi.location, 16);
        }
    }

    setTipPoi(tipPoi)
    {
        this.setProperty("tipPoi", tipPoi);
    }

    updateSelectedPoiMarker()
    {
        this.selectionPoiLayer.updateSelectedPoiMarker(this.getSelectedPoi().location);
    }




    _onclick(e)
    {
        this.fireClick({ location: e.latlng });
    }
}
