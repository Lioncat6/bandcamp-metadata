const strings = {
    errors: {
        htmlParsingFailed: {
            generic: "HTML parsing failed",
            expected: "Expected element to be present",
            expectedWithQuery: (query: string) => `Expected element to be present with query ${query}`,
            expectedAttribute: (attr: string) => `Expected element to have attribute ${attr}`,
            textChild: "Expected element to have a text child"
        },
        jsonParsingFailed: {
            generic: "JSON validation failed",
            withError: (message: string, position: string | number) => `JSON validation failed at index ${position}: ${message}`
        },
        expected: "Expected value to be defined",
        expectedValue: (value: string) => `Expected ${value} to be defined`,
        expectedNumber: "Expected value to be a valid number",
        expectedNumberValue: (value: string) => `Expected ${value} to be a valid number`,
        expectedResponse: "Bandcamp returned a 404 when we were expecting a response"
    }
}

export default strings;