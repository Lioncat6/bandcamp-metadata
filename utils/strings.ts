const strings = {
    errors: {
        htmlParsingFailed: {
            generic: "HTML parsing failed",
            expected: "Expected element to be present",
            expectedWithQuery: (query: string) => `Expected element to be present with query ${query}`,
            expectedAttribute: (attr: string) => `Expected element to have attribute ${attr}`,
            textChild: "Expected element to have a text child"
        },
        jsonParsingFailed: "JSON validation failed",
        expectedResponse: "Bandcamp returned a 404 when we were expecting a response"
    }
}

export default strings;