import citysdk from "citysdk"
import fetch from "node-fetch"
import dotenv from "dotenv"
import { google } from "googleapis"
import fs from "fs"

dotenv.config()

const auth = process.env.GAPI_KEY
const spreadsheetId = process.env.SHEET_ID
const sheets = google.sheets({
    version: "v4",
    auth,
})

async function get_sheet(limit = 14744) {
    const request = {
        // The ID of the spreadsheet to retrieve data from.
        spreadsheetId,

        // The A1 notation of the values to retrieve.
        // Data from Zillow hosted on data.world
        range: `Zip_MedianValuePerSqft_AllHomes!A1:H${limit}`, // TODO: for `get`
        //ranges: [
        //    "Zip_MedianValuePerSqft_AllHomes!A1:G14744",
        //    "Zip_MedianValuePerSqft_AllHomes!JE1:JE14744",
        //], // TODO: for `batchGet`

        // How values should be represented in the output.
        // The default render option is ValueRenderOption.FORMATTED_VALUE.
        //valueRenderOption: "", // TODO: Update placeholder value.

        // How dates, times, and durations should be represented in the output.
        // This is ignored if value_render_option is
        // FORMATTED_VALUE.
        // The default dateTime render option is [DateTimeRenderOption.SERIAL_NUMBER].
        //dateTimeRenderOption: "", // TODO: Update placeholder value.

        //  auth:
    }

    try {
        //const response = (await sheets.spreadsheets.values.batchGet(request)).data
        const response = (await sheets.spreadsheets.values.get(request)).data
        // TODO: Change code below to process the `response` object:
        //console.log(JSON.stringify(response, null, 2))

        let keys
        const objectified = response?.values?.reduce((a, c, i) => {
            if (i === 0) return (keys = c), a
            const [, zip] = c
            //console.log({ a1: a })
            a[zip] = c.reduce((a, c, i) => {
                a[keys[i]] = c
                //console.log({ a2: a })
                return a
            }, {})
            return a
        }, {})
        //console.log(JSON.stringify(objectified, null, 2))
        return objectified
    } catch (err) {
        console.error(err)
    }
}

//get_sheet() //?
//get_sheet().then(r => console.log(JSON.stringify(r, null, 2))) //?

//citysdk({
//    vintage: "2017",
//    geoHierarchy: {
//        "zip-code-tabulation-area": "*",
//    },
//    sourcePath: ["acs", "acs5"],
//    values: ["B19083_001E", "STATE", "PLACE", "TRACT"], // GINI index
//    statsKey: "<your key here>",
//    geoResolution: "500k",
//    /**
//     mergeWith: {
//         13441:
//     }
//     **/
//})

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
        coordinates: [
            [
                [-75.43007, 43.245464],
                //...
            ],
        ],
    },
}

/**
 * Current stats:
 * 5 in 35209: 38.8% SSR | 188 PPSF | 24257003 SMt | 9.4 ml2 | Homewood (post device)
 * 2 in 35213: 76.7% SSR | 209 PPSF | 16437179 SMt | 6.3 ml2 | Mountain Brook (pre device)
 *
 * assuming this penetration, we extrapolate that if it was 100% SSR, above the 180 PPSF
 * threshold, we would get 5/.388 = 12.88 units in 35209, or 12.88 / 9.4 ml2 = 1.37 units/ml2
 * thus, the calculation for the total addressable market in an area:
 * 1.37 * SSR% * ml2
 *
 * to convert square meters to square miles:
 * square meters / 2589988
 */
//const xform_csv_data =
const merge = (geojson, for_merge, threshold = { "2017-09": "180" }) => {
    const { type, features, ...rest } = geojson
    let total_addressable_market = 0

    const f = features.reduce((a, c, i, d) => {
        const {
            properties: { GEOID10, DP04_0007PE, ALAND10, ...props },
            ...rest
        } = c
        /**
         * sig:
         * <zcta>: {
         *      prop1: val,
         *      prop2: val
         * }
         */
        const match = for_merge[GEOID10]
        const [thrsh, val] = Object.entries(threshold)[0]
        const gt = parseInt(match && match[thrsh])
        const lt = parseInt(val)
        //console.log({ gt, lt, q: gt > lt })
        //console.log({ thrsh, val, match_thrsh: (match && match[thrsh]) || null })
        if (match && gt > lt) {
            //console.log("made it through:", match[thrsh] > val, {
            //    thrsh,
            //    gt,
            //    lt,
            //})
            const TAM = 1.37 * (DP04_0007PE / 100) * (ALAND10 / 2589988)
            total_addressable_market += TAM

            a.push({
                properties: {
                    GEOID10,
                    DP04_0007PE,
                    ALAND10,
                    TAM,
                    ...match,
                    ...props,
                },
                ...rest,
            })
        }
        return a
    }, [])
    const result = { total_addressable_market, type, features: f, ...rest }
    console.log({ total_addressable_market })
    return result
}

const mergeData = async (limit = 14744) => {
    const zillow = await get_sheet(limit)
    const geojson = await new Promise((resolve, reject) => {
        citysdk(
            {
                vintage: "2017",
                geoHierarchy: {
                    "zip-code-tabulation-area": "*",
                },
                sourcePath: ["acs", "acs5", "profile"],
                values: ["DP04_0007PE"], // GINI index
                //statsKey: "<your key here>",
                geoResolution: "500k",
            },
            (err, result) => {
                if (err) reject(err)
                resolve(result)
            }
        )
    })
    return merge(geojson, zillow)
}

mergeData()
    .then(r => JSON.stringify(r, null, 2))
    .then(j => fs.writeFileSync("./src/data/geojson.json", j))
