import AdaptiveMapView from "sap/a/map/MapView";
import TileLayer from "sap/a/map/layer/TileLayer";

import NaviLayer from "./layer/NaviLayer";
import SelectionPoiLayer from "./layer/SelectionPoiLayer";

export default class MapView extends AdaptiveMapView
{
    metadata = {
        properties: {
            selectedPoi: { type: "object", bindable: true },
            originPoi: { type: "object", bindable: true },
            destinationPoi: {type: "object", bindable: true }
        },
        events: {
            searchRoute: { parameters: { originPoi: "object", destinationPoi: "object" } }
        }
    };

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

        this.selectionPoiLayer = new SelectionPoiLayer();
        this.addLayer(this.selectionPoiLayer);
    }

    setSelectedPoi(selectedPoi)
    {
        this.setProperty("selectedPoi", selectedPoi);
        if (selectedPoi && selectedPoi.location && !isNaN(selectedPoi.location[0]) && !isNaN(selectedPoi.location[1]))
        {
            this.setCenterLocation(selectedPoi.location, 16);
            this._updateSelectedPoiMarker();
        }
    }

    setOriginPoi(originPoi)
    {
        this.setProperty("originPoi", originPoi);
        const destinationPoi = this.getDestinationPoi();
        if (originPoi && destinationPoi)
        {
            this.fireSearchRoute({
                originPoi,
                destinationPoi
            });
        }
    }

    setDestinationPoi(destinationPoi)
    {
        this.setProperty("destinationPoi", destinationPoi);
        const originPoi = this.getOriginPoi();
        if (originPoi && destinationPoi)
        {
            this.fireSearchRoute({
                originPoi,
                destinationPoi
            });
        }
    }




    _updateSelectedPoiMarker()
    {
        this.selectionPoiLayer.updateSelectedPoiMarker(this.getSelectedPoi().location);
    }
}
