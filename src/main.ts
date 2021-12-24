import mg from "maplibre-gl"
import chroma from "chroma-js"
import _ from "lodash"

// === TUNE DATA PARAMETERS === //
const values = ["2017-09", "TAM", "City", "State", "CountyName"]
const valueSelection = 0
const selection = values[valueSelection]

// === TUNE CHOROPconstH VALUES  === //
// const colorScale = chroma.scale('RdBu').domain([1, 0]);
// const colorScale = chroma.scale('OrRd').domain([0, 1]);
// const colorScale = chroma.scale('PuBu').domain([0, 1]);
/*
To create some merged stats+geojson:
in terminal:
node --max-old-space-size=4096
const census = require("census-js")
census({
  "vintage": 2016,
  "geoHierarchy": {"zip code tabulation area": "*"},
  "geoResolution": "500k",
  "values": ["B00001_001E", "B01001_001E", "B08303_001E", "B19083_001E"],
  "sourcePath": ["acs", "acs5"]
}, (err, data) => {
  fs.writeFileSync("./zctas.json", JSON.stringify(data))
})
*/

// === MAPBOX FUNCTIONS === //

mg.accessToken =
    "pk.eyJ1Ijoib3BlbmlkZW8iLCJhIjoiY2pnemR0dmwyMHVhdDJ2bGV1bnl6amJqaiJ9._G3sOFQoJZklpO9pscg1mw"

const map = new mg.Map({
    container: "map",
    style: "mapbox://styles/openideo/cj48m1z521vzo2rqws9kwesra",
    center: { lat: 37.0902, lng: -95.7129 },
    zoom: 3,
    pitch: 0,
})

const quantileMaker = function (vec) {
    const dataScale = chroma.limits(vec, "q", 8)
    const colorScale = chroma
        .scale(["yellow", "navy"])
        //.scale(["yellow", "navy"])
        .mode("lch")
    //.padding([dataScale[1] * -1 - 1, dataScale[dataScale.length - 1] * -1 - 1])
    const chromaScale = dataScale.map(function (val) {
        return colorScale(val).hex()
    })
    return _.zip(dataScale, chromaScale)
}

/* Actual scale:
const scale  = [[-666666666, rgba(250, 250, 250, 0.0)],
              [0.363, #ffffff],
              [0.400, #BDBDBD],
              [0.429, #757575],
              [0.466, #424242],
              [0.848, #212121]];
 */

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

const getCensusData = async function (url) {
    const response = await fetch(url)
    const censusGeoJSON = await response.json()
    //const censusGeoJSON = JSON.parse(json)
    const dataVec = censusGeoJSON.features.map(function (feature) {
        return parseInt(feature?.properties[selection])
    })
    const scale = quantileMaker(dataVec)
    return { data: censusGeoJSON, stops: scale }
}

// Random ID maker for each mapbox geocoder-rendered data view to be unique
const makeid = function () {
    let text = ""
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    for (let i = 0; i < 5; i++) text += possible.charAt(Math.floor(Math.random() * possible.length))
    return text
}

// ZCTAS
const DATA_URL =
    "https://raw.githubusercontent.com/loganpowell/citysdk_zctas/master/src/data/geojson.json"
// COUNTIES
// const DATA_URL = "https://raw.githubusercontent.com/loganpowell/census-js-examples/master/data/county-acs-acs5-B19083_001E.json"

const US_URL =
    "https://raw.githubusercontent.com/loganpowell/census-geojson/master/GeoJSON/20m/2017/state.json"

map.on("style.load", async function () {
    getCensusData(DATA_URL).then(async function (result) {
        const sourceUID = makeid()
        const layerUID = makeid()
        const data = result.data
        const stops = result.stops
        const ustr = await fetch(US_URL)
        const us = await ustr.json()
        console.table(stops)
        map.addSource(sourceUID, {
            type: "geojson",
            data: data,
        })
        map.addLayer({
            id: layerUID,
            type: "fill",
            source: sourceUID,
            paint: {
                //"fill-color": {
                //    property: selection,
                //    stops: stops,
                //},
                "fill-color": "tomato",
                "fill-outline-color": "crimson",
                "fill-opacity": 0.8,
            },
        })
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
        })
        map.on("mousemove", e => {
            map.getCanvas().style.cursor = "pointer"
            const features = map.queryRenderedFeatures(e.point, {
                layers: [layerUID],
            })
            //console.log({ features })
            document.getElementById("geo-name").innerHTML =
                "ZIP: " + features[0]?.properties?.GEOID10
            document.getElementById("geo-value").innerHTML = `
                <ul>
                  ${values
                      .map(each => `<li>${each}: ${features[0]?.properties[each]}</li>`)
                      .join("")}
                </ul>
              `
        })
    })
})

// TODO: legend: https://www.mapbox.com/help/choropconsth-studio-gl-pt-2/
// TODO: https://www.mapbox.com/mapbox-gl-js/example/updating-choropconsth/
