import { parseDocument, DomUtils } from "htmlparser2";
import type { searchItemType } from "./utils/schema.js";
import type { BandcampSearchResult, BandcampSearchResults } from "./types/parsed-types.js";
import validate from "./utils/schema.js";
import strings from "./utils/strings.js";
import parse from "./utils/parse.js";
import type { BandcampConfig } from "./types/gloabl-types.js";


export class Bandcamp {
    cookie: string;
    userAgent: string;
    strict: boolean;
    constructor(config: BandcampConfig) {
        this.cookie = config.cookie;
        this.userAgent = config.userAgent;
        this.strict = true;
    }
    /**
     * Query the bandcamp search page
     * @param query Query to lookup on bandcamp
     * @param page Page number of the search to use
     * @param type Type of search to run
     * @returns BandcampSearchResults
     */
    async search(query: string, page = 1, type?: searchItemType): Promise<BandcampSearchResults> {
        const url = new URL("https://bandcamp.com/search")
        url.searchParams.append('q', query)
        if (page > 1) url.searchParams.append('page', String(page))
        if (type) url.searchParams.append('item_type', type)
        const html = await this.htmlFetch(url.toString());
        if (!html) throw new Error(strings.errors.htmlParsingFailed.generic);
        return parse.searchHTML(html);
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