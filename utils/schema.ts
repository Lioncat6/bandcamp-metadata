import Ajv, { type JTDDataType } from "ajv/dist/jtd.js"
import type { JTDSchemaType } from "ajv/dist/core.js"
const ajv = new Ajv.Ajv()
export type searchItemType = "band" | "album" | "track" | "fan"
export type searchItemLetterType = "b" | "a" | "t" | "f"

export interface searchData {
    type: searchItemLetterType
    id: number
}

const searchDataSchema: JTDSchemaType<searchData> = {
    properties: {
        type: { enum: ["b", "a", "t", "f"] },
        id: { type: "int32" }
    }
}

const searchDataParser = ajv.compileParser(searchDataSchema)

const validate = {
    searchData: searchDataParser
}

export default validate;