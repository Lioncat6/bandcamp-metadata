    // Bandcamp-Metadata - A library to fetch bandcamp pages to extract metadata
    // Copyright (C) 2026 Lioncat6

    // This program is free software: you can redistribute it and/or modify
    // it under the terms of the GNU Affero General Public License as published
    // by the Free Software Foundation, either version 3 of the License, or
    // (at your option) any later version.

    // This program is distributed in the hope that it will be useful,
    // but WITHOUT ANY WARRANTY; without even the implied warranty of
    // MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    // GNU Affero General Public License for more details.

    // You should have received a copy of the GNU Affero General Public License
    // along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { parseDocument, DomUtils } from "htmlparser2";
import type { BandcampBandPage, BandcampReleasePage, BandcampSearchResult, BandcampSearchResults } from "./types/parsed-types.js";
import validate from "./utils/schema.js";
import strings from "./utils/strings.js";
import parse from "./utils/parse.js";
import type { BandcampConfig } from "./types/global-types.js";
import type { BandcampReleaseType, searchItemType } from "./types/bandcamp/html-types.js";


export class Bandcamp {
    config: BandcampConfig
    strict: boolean;
    /**
     * Bandcamp API methods
     */
    api: API;
    constructor(config: BandcampConfig) {
        this.config = config;
        this.api = new API(config)
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
    /**
     * Fetch a label or artist page
     * @param url The band's url.
     * @returns BandcampBandPage
     */
    async getBand(url: string): Promise<BandcampBandPage> {
        let urlObj = new URL(url);
        urlObj.pathname = '/music'
        const html = await this.htmlFetch(urlObj.toString());
        if (!html) throw new Error(strings.errors.htmlParsingFailed.generic);
        return parse.bandHTML(html);
    }
    async getRelease(url: string): Promise<BandcampReleasePage> {
        let urlObj = new URL(url);
        const html = await this.htmlFetch(urlObj.toString(), 'GET', false);
        if (!html) throw new Error(strings.errors.htmlParsingFailed.generic);
        return parse.releaseHTML(html);
    }

    private async htmlFetch(url: string, method: string = "GET", useCookie = true, body?: BodyInit) {
        let options: RequestInit = {
            method: method,
            headers: {
                'User-Agent': this.config.userAgent
            }
        }
        if (useCookie) {
            options.headers = {
                'Cookie': this.config.cookie,
                'User-Agent': this.config.userAgent
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
class API {
    config: BandcampConfig
    constructor(config: BandcampConfig) {
        this.config = config;
    }
    async search() {

    }
    async getBand(id: number | string) {
        const urlObj = new URL(`https://bandcamp.com/api/mobile/26/band_details`);
        urlObj.searchParams.append('band_id', String(id));
        const response = await this.bcFetch(urlObj.toString(), 'GET', false);
        if (!response) return null;
        return parse.bandPageJSON(response);
    }
    async getRelease(id: number | string, type: BandcampReleaseType) {
        const urlObj = new URL(`https://bandcamp.com/api/mobile/26/tralbum_details`);
        urlObj.searchParams.append('band_id', '1'); // Requested band ID doesn't actually matter
        urlObj.searchParams.append('tralbum_type', type);
        urlObj.searchParams.append('tralbum_id', String(id));
        const response = await this.bcFetch(urlObj.toString(), 'GET', false);
        if (!response) return null;
        return parse.tralbumJSON(response);
    }

    private async bcFetch(url: string, method = "GET", useCookie = true, body?: BodyInit) {
        let options: RequestInit = {
            method: method,
            headers: {
                'User-Agent': this.config.userAgent
            }
        }
        if (useCookie) {
            options.headers = {
                'Cookie': this.config.cookie,
                'User-Agent': this.config.userAgent
            }
        }
        const response = await fetch(url, options).catch((error) => {
            throw new Error(`Fetch failed: ${error}`)
        })
        if (response.ok) {
            const textReponse = await response.text();
            const apiError = parse.errorJSON(textReponse);
            if (apiError) {
                throw new Error(`Recieved error from Bandcamp: ${apiError.error_message}`);
            }
            return textReponse;
        } else if (response.status == 404) {
            return null;
        } else {
            throw new Error(`Fetch failed with status: ${response.status}`)
        }
    }
}


