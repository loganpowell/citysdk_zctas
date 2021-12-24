import { __awaiter } from "tslib";
import mg from "maplibre-gl";
import chroma from "chroma-js";
import _ from "lodash";
const values = ["2017-09", "TAM", "City", "State", "CountyName"];
const valueSelection = 0;
const selection = values[valueSelection];
mg.accessToken =
    "pk.eyJ1Ijoib3BlbmlkZW8iLCJhIjoiY2pnemR0dmwyMHVhdDJ2bGV1bnl6amJqaiJ9._G3sOFQoJZklpO9pscg1mw";
const map = new mg.Map({
    container: "map",
    style: "mapbox://styles/openideo/cj48m1z521vzo2rqws9kwesra",
    center: { lat: 37.0902, lng: -95.7129 },
    zoom: 3,
    pitch: 0,
});
const quantileMaker = function (vec) {
    const dataScale = chroma.limits(vec, "q", 8);
    const colorScale = chroma
        .scale(["yellow", "navy"])
        .mode("lch");
    const chromaScale = dataScale.map(function (val) {
        return colorScale(val).hex();
    });
    return _.zip(dataScale, chromaScale);
};
function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
const getCensusData = function (url) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(url);
        const censusGeoJSON = yield response.json();
        const dataVec = censusGeoJSON.features.map(function (feature) {
            return parseInt(feature === null || feature === void 0 ? void 0 : feature.properties[selection]);
        });
        const scale = quantileMaker(dataVec);
        return { data: censusGeoJSON, stops: scale };
    });
};
const makeid = function () {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
};
const DATA_URL = "https://raw.githubusercontent.com/loganpowell/citysdk_zctas/master/src/data/geojson.json";
const US_URL = "https://raw.githubusercontent.com/loganpowell/census-geojson/master/GeoJSON/20m/2017/state.json";
map.on("style.load", function () {
    return __awaiter(this, void 0, void 0, function* () {
        getCensusData(DATA_URL).then(function (result) {
            return __awaiter(this, void 0, void 0, function* () {
                const sourceUID = makeid();
                const layerUID = makeid();
                const data = result.data;
                const stops = result.stops;
                const ustr = yield fetch(US_URL);
                const us = yield ustr.json();
                console.table(stops);
                map.addSource(sourceUID, {
                    type: "geojson",
                    data: data,
                });
                map.addLayer({
                    id: layerUID,
                    type: "fill",
                    source: sourceUID,
                    paint: {
                        "fill-color": "tomato",
                        "fill-outline-color": "crimson",
                        "fill-opacity": 0.8,
                    },
                });
                map.addLayer({
                    id: "us",
                    type: "line",
                    source: {
                        type: "geojson",
                        data: us,
                    },
                    layout: {
                        "line-join": "round",
                        "line-cap": "round",
                    },
                    paint: {
                        "line-color": "#ffffff",
                        "line-width": 1,
                    },
                });
                map.on("mousemove", e => {
                    var _a, _b;
                    map.getCanvas().style.cursor = "pointer";
                    const features = map.queryRenderedFeatures(e.point, {
                        layers: [layerUID],
                    });
                    document.getElementById("geo-name").innerHTML =
                        "ZIP: " + ((_b = (_a = features[0]) === null || _a === void 0 ? void 0 : _a.properties) === null || _b === void 0 ? void 0 : _b.GEOID10);
                    document.getElementById("geo-value").innerHTML = `
                <ul>
                  ${values
                        .map(each => { var _a; return `<li>${each}: ${(_a = features[0]) === null || _a === void 0 ? void 0 : _a.properties[each]}</li>`; })
                        .join("")}
                </ul>
              `;
                });
            });
        });
    });
});
