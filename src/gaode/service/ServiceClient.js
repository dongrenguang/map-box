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
            AMap.service(["AMap.Driving", "AMap.Autocomplete", "AMap.Geocoder"], () => {
                const options = {
                    city: "南京"
                };
                this.driving = new AMap.Driving();
                this.autocomplete = new AMap.Autocomplete(options);
                this.geocoder = new AMap.Geocoder({
                    radius: 1000,
                    extensions: "all"
                });
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
                    if (status === "complete" && result.info.toLowerCase() === "ok")
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

    searchPoiAutocomplete(keyword)
    {
        return new Promise((resolve, reject) => {
            this.autocomplete.search(keyword, (status, result) => {
                if (status === "complete" && result.info.toLowerCase() === "ok")
                {
                    const tips = result.tips.map(tip => {
                        return {
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

    searchGeocoder(location)
    {
        return new Promise((resolve, reject) => {
            this.geocoder.getAddress(new AMap.LngLat(location.lng, location.lat), (status, result) => {
                if(status === "error")
                {
                    reject({
                        successful: false,
                        message: "服务请求出错啦！"
                    });
                }
                else if(status === "no_data")
                {
                    reject({
                        successful: false,
                        message: "无数据返回，请换个关键字试试～～"
                    });
                }
                else
                {
                    resolve(result.regeocode);
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
