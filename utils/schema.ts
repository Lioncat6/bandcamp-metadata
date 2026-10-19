import Ajv, { type JTDDataType, type JTDParser } from "ajv/dist/jtd.js"
import type { JTDSchemaType } from "ajv/dist/core.js"
import type { BandcampSearchResult } from "../types/parsed-types.js"
import strings from "./strings.js"
import type { searchItemDisplayType, searchItemType } from "../types/bandcamp-types.js"
const ajv = new Ajv.Ajv({
    int32range: false
})

export interface searchItemTypeInterface {
    type: searchItemDisplayType
}

export interface searchData {
    type: searchItemType
    id: number
}

const searchDataSchema: JTDSchemaType<searchData> = {
    properties: {
        type: { enum: ["b", "a", "t", "f"] },
        id: { type: "uint32" }
    }
}

const searchDataParser = ajv.compileParser(searchDataSchema)

/**
 * Unused for now
 */
const searchResultSchema: JTDSchemaType<BandcampSearchResult> = {
    discriminator: "type",
    mapping: {
        'album': {
            properties: {
                id: { type: "int32" },
                name: { type: "string" },
                url: { type: "string" },
                imageUrl: { type: "string" },
                tags: { elements: { type: "string" } },
                releaseDate: { type: "string" },
                trackCount: { type: "int32" },
                duration: { type: "int32" },
                artist: { type: "string" }
            }
        },
        'artist': {
            properties: {
                id: { type: "int32" },
                name: { type: "string" },
                url: { type: "string" },
                imageUrl: { type: "string" },
                tags: { elements: { type: "string" } },
                genre: { type: "string" },
                location: { type: "string" }
            }
        },
        'label': {
            properties: {
                id: { type: "int32" },
                name: { type: "string" },
                url: { type: "string" },
                imageUrl: { type: "string" },
                location: { type: "string" }
            }
        },
        'track': {
            properties: {
                id: { type: "int32" },
                name: { type: "string" },
                url: { type: "string" },
                imageUrl: { type: "string" },
                tags: { elements: { type: "string" } },
                releaseDate: { type: "string" },
                artist: { type: "string" }
            },
            optionalProperties: {
                album: { type: "string" }
            }
        },
        'fan': {
            properties: {
                id: { type: "int32" },
                name: { type: "string" },
                url: { type: "string" },
            },
            optionalProperties: {
                imageUrl: { type: "string" },
                genre: { type: "string" }
            }
        }
    },
}

/**
 * Unused for now
 */
const searchResultParser = ajv.compileParser(searchResultSchema)

const searchTypeSchema: JTDSchemaType<searchItemTypeInterface> = {
    properties: {
        type: {enum: ["label", "artist", "album", "track", "fan"]}
    }
}

const searchTypeParser = ajv.compileParser(searchTypeSchema)

type validationTypes = string

function validateJSON<T>(json: validationTypes, parser: JTDParser<T>): T {
    const data = parser(json);
    if (data === undefined) {
        throw new Error(strings.errors.jsonParsingFailed.withError(parser.message ?? "unknown error", parser.position ?? "unknown position"))
    }
    return data;
}

const validate = {
    searchData: (json: validationTypes) => validateJSON(json, searchDataParser),
    searchResult: searchResultParser,
    searchType: (json: validationTypes) => validateJSON(json, searchTypeParser)
}

export default validate;