import { __awaiter, __rest } from "tslib"
import citysdk from "citysdk"
import dotenv from "dotenv"
import { google } from "googleapis"
dotenv.config()
const auth = process.env.GAPI_KEY
const spreadsheetId = process.env.SHEET_ID
const sheets = google.sheets({
    version: "v4",
    auth,
})
function get_sheet(limit = 14744) {
    var _a
    return __awaiter(this, void 0, void 0, function* () {
        const request = {
            spreadsheetId,
            range: `Zip_MedianValuePerSqft_AllHomes!A1:H${limit}`,
        }
        try {
            const response = (yield sheets.spreadsheets.values.get(request)).data
            let keys
            const objectified =
                (_a = response === null || response === void 0 ? void 0 : response.values) ===
                    null || _a === void 0
                    ? void 0
                    : _a.reduce((a, c, i) => {
                          if (i === 0) return (keys = c), a
                          const [, zip] = c
                          a[zip] = c.reduce((a, c, i) => {
                              a[keys[i]] = c
                              return a
                          }, {})
                          return a
                      }, {})
            return objectified
        } catch (err) {
            console.error(err)
        }
    })
}
const example_feature = {
    properties: {
        B19083_001E: -666666666,
        "zip-code-tabulation-area": "13441",
        ZCTA5CE10: "13441",
        AFFGEOID10: "8600000US13441",
        GEOID10: "13441",
        ALAND10: 9305982,
        AWATER10: 0,
    },
    type: "Feature",
    geometry: {
        type: "Polygon",
        coordinates: [[[-75.43007, 43.245464]]],
    },
}
const merge = (geojson, for_merge) => {
    const { type, features } = geojson,
        rest = __rest(geojson, ["type", "features"])
    const f = features.reduce((a, c, i, d) => {
        const _a = c.properties,
            { GEOID10 } = _a,
            props = __rest(_a, ["GEOID10"]),
            rest = __rest(c, ["properties"])
        const match = for_merge[GEOID10]
        a.push({
            properties: Object.assign(Object.assign({ GEOID10 }, match), props),
        })
        return a
    }, [])
    const result = Object.assign({ type, features: f }, rest)
    return result
}
const mergeData = (limit = 14744) =>
    __awaiter(void 0, void 0, void 0, function* () {
        const zillow = yield get_sheet(limit)
        const geojson = yield new Promise((resolve, reject) => {
            citysdk(
                {
                    vintage: "2017",
                    geoHierarchy: {
                        "zip-code-tabulation-area": "*",
                    },
                    sourcePath: ["acs", "acs5"],
                    values: ["B19083_001E", "STATE", "PLACE", "TRACT"],
                    geoResolution: "500k",
                },
                (err, result) => {
                    if (err) reject(err)
                    resolve(result)
                }
            )
        })
        return merge(geojson, zillow)
    })
mergeData().then(r => JSON.stringify(r, null, 2)) //?
