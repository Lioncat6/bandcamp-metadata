import { parseDocument, DomUtils } from "htmlparser2";
import type { searchItemLetterType, searchItemType } from "./schema.ts";
import type { BandcampSearchResult, BandcampSearchResults } from "./types/parsed-types.js";
import validate from "./schema.ts";

const strings = {
    errors: {
        htmlParsingFailed: "HTML parsing failed",
        jsonParsingFailed: "JSON validation failed",
        expectedResponse: "Bandcamp returned a 404 when we were expecting a response"
    }
}

export class Bandcamp {
    cookie: string;
    userAgent: string;
    constructor(cookie: string, userAgent: string) {
        this.cookie = cookie;
        this.userAgent = userAgent;
    }
    async search(query: string, page = 1, type?: searchItemType): BandcampSearchResults {
        const types: Record<searchItemType, searchItemLetterType> = {
            "album": "a",
            "band": "b",
            "track": "t",
            "fan": "f"
        }
        const url = new URL("https://bandcamp.com/search")
        url.searchParams.append('query', query)
        if (page > 1) url.searchParams.append('page', String(page))
        if (type) url.searchParams.append('item_type', types[type])
        const html = await this.htmlFetch(url.toString());
        if (!html) throw new Error(strings.errors.expectedResponse)
        const results = DomUtils.getElementsByClassName('result-items', html)[0];
        if (!results) throw new Error(strings.errors.htmlParsingFailed)
        let parsedSearchResults: BandcampSearchResult[] = []
        DomUtils.getChildren(results).forEach((result) => {
            if (result.type == "tag" && result.tagName == "li") {
                const rawSearchData = result.attribs['data-search'];
                if (!rawSearchData) throw new Error(strings.errors.htmlParsingFailed);
                const searchData = validate.searchData(rawSearchData);
                if (!searchData) throw new Error(strings.errors.jsonParsingFailed);
                const imageElement = DomUtils.getElementsByClassName('art', result)[0]?.firstChild
                const imageUrl = imageElement?.type == "tag" ? result.attribs['src'] : undefined
                if (searchData.type == "a") {

                }
            }
        })
    }
    private async htmlFetch(url: string, method: string = "GET", body?: BodyInit){
        let options: RequestInit = {
            method: method,
            headers: {
                'Cookie': this.cookie,
                'User-Agent': this.userAgent
            }
        }
        const response = await fetch(url, options).catch((error) => {
            throw new Error(`Fetch failed: ${error}`)
        })
        if (response.ok) {
            const rawHTML = await response.text();
            return parseDocument(rawHTML);
        } else if (response.status == 404) {
            return null;
        } else {
            throw new Error(`Fetch failed with status: ${response.status}`)
        }
    }
}