import Layer from "sap/a/map/layer/Layer";

export default class SelectionPoiLayer extends Layer
{
    metadata = {
        properties: {
            startLocation: { type: "any" },
            endLocation: { type: "any" }
        }
    };

    init()
    {
        super.init();
        this.poiMarkerGroup = L.featureGroup();
        this.container.addLayer(this.poiMarkerGroup);
    }

    updateSelectedPoiMarker(location)
    {
        this.poiMarkerGroup.clearLayers();
        const poiMarker = L.circleMarker(location);
        poiMarker.setStyle({
            color: "green",
            opacity: 0.8,
            fill: "green",
            fillOpacity: 0.8
        });
        this.poiMarkerGroup.addLayer(poiMarker);
    }
}
