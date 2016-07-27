import ManagedObject from "sap/ui/base/ManagedObject";

import gcj02ToWgs84 from "../util/gcj02ToWgs84";

export default class ServiceClient extends ManagedObject
{
    static _instance = null;

    static getInstance()
    {
        if (!gaode.service.ServiceClient._instance)
        {
            gaode.service.ServiceClient._instance = new gaode.service.ServiceClient();
        }

        return gaode.service.ServiceClient._instance;
    }

    metadata = {
        events: {
            ready: {}
        }
    };

    init()
    {
        this._initGaodeService().then(() => this.fireReady());
    }

    _initGaodeService()
    {
        return new Promise((resolve, reject) => {
            AMap.service(["AMap.Driving", "AMap.Autocomplete"], () => {
                const options = {
                    city: "南京"
                };
                this.driving = new AMap.Driving();
                this.autocomplete = new AMap.Autocomplete(options);
                resolve();
            });
        });
    }

    searchDrivingRoutes(locations)
    {
        return new Promise((resolve, reject) => {
            const locsOfLngLatFormat = locations.map(location => [L.latLng(location).lng, L.latLng(location).lat]);

            this.convertToGcj02(locsOfLngLatFormat).then(locations => {
                const locsOfGcj02 = locations.map(location => [location.lng, location.lat]);
                this.driving.search(locsOfGcj02[0], locsOfGcj02[1], (status, result) => {
                    if (status === "complete" && result.info === "OK")
                    {
                        // Convert Gaode's routes to that Leaflet can recognize, that is [[[lat, lng],[lat, lng], ...], [], ...].
                        let routes = result.routes[0];
                        routes = routes.steps.map(step => {
                            return step.path.map(location => gcj02ToWgs84(location));
                        });
                        resolve(routes);
                    }
                    else
                    {
                        reject({
                            successful: false,
                            message: result.info
                        });
                    }
                });
            }, reject);
        });
    }

    searchPoiAutocomplete(keyword) {
        return new Promise((resolve, reject) => {
            this.autocomplete.search(keyword, (status, result) => {
                if (status === "complete" && result.info === "OK") {
                    console.log(result.tips);
                    const tips = result.tips.map(tip => {
                        return {
                            // TODO
                            address: tip.address,
                            district: tip.district,
                            location: gcj02ToWgs84(tip.location),
                            name: tip.name
                        };
                    });
                    resolve(tips);
                }
                else {
                    reject({
                        successful: false,
                        message: result.info
                    });
                }
            });
        });
    }

    convertToGcj02(locations, from = "gps")
    {
        return new Promise((resolve, reject) => {
            AMap.convertFrom(locations, from, (status, result) => {
                if (status === "complete" && result.info === "ok")
                {
                    resolve(result.locations);
                }
                else
                {
                    reject({
                        successful: false,
                        message: result.info
                    });
                }
            });
        });
    }
}
