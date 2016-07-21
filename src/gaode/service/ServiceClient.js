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
            AMap.service(["AMap.Driving"], () => {
                this.driving = new AMap.Driving();
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
                            return step.path.map(location => gcj02ToWgs84(L.latLng(location)));
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




// var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
// var PI = 3.1415926535897932384626;
// var a = 6378245.0;
// var ee = 0.00669342162296594323;
// /**
//  * GCJ02 转换为 WGS84
//  * @param location // format: { lat, lng }
//  * @returns {[lat, lng]}
//  */
// function gcj02ToWgs84(location) {
//     var lng = location.lng;
//     var lat = location.lat;
//     if (out_of_china(lng, lat)) {
//         return [lng, lat]
//     }
//     else {
//         var dlat = transformlat(lng - 105.0, lat - 35.0);
//         var dlng = transformlng(lng - 105.0, lat - 35.0);
//         var radlat = lat / 180.0 * PI;
//         var magic = Math.sin(radlat);
//         magic = 1 - ee * magic * magic;
//         var sqrtmagic = Math.sqrt(magic);
//         dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
//         dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
//         var mglat = lat + dlat;
//         var mglng = lng + dlng;
//         return [lat * 2 - mglat, lng * 2 - mglng]
//     }
// }
//
// function transformlat(lng, lat) {
//     var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
//     ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
//     ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
//     ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
//     return ret
// }
//
// function transformlng(lng, lat) {
//     var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
//     ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
//     ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
//     ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
//     return ret
// }
//
// /**
//  * 判断是否在国内，不在国内则不做偏移
//  * @param lng
//  * @param lat
//  * @returns {boolean}
//  */
// function out_of_china(lng, lat) {
//     return (lng < 72.004 || lng > 137.8347) || ((lat < 0.8293 || lat > 55.8271) || false);
// }
