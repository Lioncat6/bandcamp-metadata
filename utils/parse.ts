import { Document, Element, NodeWithChildren, type ChildNode } from "domhandler"
import * as CSSselect from "css-select";
import * as he from 'he';
import type { BandcampSearchResult, BandcampSearchResults, ArtistSearchResult, AlbumSearchResult, TrackSearchResult, LabelSearchResult, FanSearchResult, BandcampBandPage, BandcampMiniRelease, BandcampMiniArtist } from "../types/parsed-types.js";
import validate from "./schema.js";
import strings from "./strings.js";
import image from "./image.js";
import { DomUtils } from "htmlparser2";

function getAttr(element: Element, attr: string): string {
    const attribute = element.attribs[attr];
    if (!attribute) throw new Error(strings.errors.htmlParsingFailed.expectedAttribute(attr));
    return attribute;
}

function innerText(element: Element): string {
    const inner = element.firstChild;
    if (inner?.type != "text") throw new Error(strings.errors.htmlParsingFailed.textChild);
    return inner.data;
}

function innerTextOpt(element: Element | null): string | null {
    if (!element) return null;
    return innerText(element)
}

function expectElement(element: Element | undefined | null): Element {
    if (!element) throw new Error(strings.errors.htmlParsingFailed.expected);
    return element;
}


function expectJSON<T>(data: T | undefined | null): T {
    if (!data) throw new Error(strings.errors.jsonParsingFailed.generic);
    return data;
}

function expectValue<T>(data: T | undefined | null, value?: string): T {
    if (!data) throw new Error(value ? strings.errors.expectedValue(value) : strings.errors.expected);
    return data;
}

function expectNumber(data: any, value?: string): number {
    const number = Number(data);
    if (isNaN(number)) throw new Error(value ? strings.errors.expectedNumberValue(value) : strings.errors.expectedNumber)
    return number;
}

function selectAll(query: string, elements: NodeWithChildren | NodeWithChildren[]) {
    return CSSselect.selectAll<NodeWithChildren, Element>(query, elements)
}

function selectOne(query: string, elements: NodeWithChildren | NodeWithChildren[]) {
    return CSSselect.selectOne<NodeWithChildren, Element>(query, elements)
}

function expectOne(query: string, elements: NodeWithChildren | NodeWithChildren[]): Element {
    const element = selectOne(query, elements)
    if (!element) throw new Error(strings.errors.htmlParsingFailed.expectedWithQuery(query))
    return element;
}

function expectAtLeastOne(query: string, elements: NodeWithChildren | NodeWithChildren[]) {
    const element = selectAll(query, elements)
    if (element.length == 0) throw new Error(strings.errors.htmlParsingFailed.expectedWithQuery(query))
    return element;
}

function searchHTMLParser(html: Document): BandcampSearchResults {
    let searchResults: BandcampSearchResult[] = []
    const results = selectAll('.result-items li', html)
    results.forEach((result) => {
        const searchData = expectJSON(validate.searchData(getAttr(result, 'data-search')));
        // Required
        const itemtype = expectValue(innerText(expectOne('.itemtype', result)).match(/([^\s]+)/)?.[1], "type")
        const safeType = expectValue(validate.searchType(JSON.stringify({ type: itemtype.toLowerCase() })), "type");
        const name = innerText(expectOne('.heading a', result)).trim();
        const itemurl = getAttr(expectOne('.itemurl a', result), 'href')
        const cleanURL = itemurl.match(/^[^?#]+/)?.[0] ?? itemurl;
        // Optional
        const arturl = selectOne('.art img', result)?.attribs['src']; //Not required for fans
        const subhead = innerTextOpt(selectOne('.subhead', result))
        const genre = innerTextOpt(selectOne('.genre', result))
        const tags = innerTextOpt(selectOne('.tags', result))
        const length = innerTextOpt(selectOne('.length', result))
        const releasedText = innerTextOpt(selectOne('.released', result))

        function cleanTags(tags: string | null, require = true): string[] {
            let tagsMatch = tags?.match(/tags:([\s\S]+)/)?.[1];
            if (require) tagsMatch = expectValue(tagsMatch, 'tags')
            return tagsMatch?.split(",").map((tag) => tag.trim()) ?? [];
        }

        switch (safeType.type) {
            case "artist":
                const artistResult: ArtistSearchResult = {
                    type: "artist",
                    id: searchData.id,
                    name: name,
                    imageUrl: expectValue(arturl, "arturl"),
                    url: cleanURL,
                    genre: expectValue(genre?.match(/genre: ([^\n+]+)/)?.[1], 'genre'),
                    tags: cleanTags(tags),
                    location: expectValue(subhead).trim()
                }
                searchResults.push(artistResult);
                break;
            case "album":
                const albumResult: AlbumSearchResult = {
                    type: "album",
                    id: searchData.id,
                    name: name,
                    imageUrl: expectValue(arturl, "arturl"),
                    url: cleanURL,
                    tags: cleanTags(tags, false),
                    artist: expectValue(subhead?.match(/^\s+by ([^\n]+)/m)?.[1], 'artist'),
                    releaseDate: expectValue(releasedText?.match(/released ([^\n]+)/)?.[1], 'release date'),
                    trackCount: expectNumber(length?.match(/(\d+) (tracks|track)/)?.[1], 'track count'),
                    duration: expectNumber(length?.match(/(\d+) (minute|minutes)/)?.[1], 'duration'),
                }
                searchResults.push(albumResult);
                break;
            case "track":
                const trackResult: TrackSearchResult = {
                    type: "track",
                    id: searchData.id,
                    name: name,
                    imageUrl: expectValue(arturl, "arturl"),
                    url: cleanURL,
                    tags: cleanTags(tags, false),
                    artist: expectValue(subhead?.match(/^\s+by ([^\n]+)/m)?.[1], 'artist'),
                    releaseDate: expectValue(releasedText?.match(/released ([^\n]+)/)?.[1], 'release date'),
                    album: subhead?.match(/^\s+from ([^\n]+)/m)?.[1]
                }
                searchResults.push(trackResult);
                break;
            case "label":
                const labelResult: LabelSearchResult = {
                    type: "label",
                    id: searchData.id,
                    name: name,
                    imageUrl: expectValue(arturl, "arturl"),
                    url: cleanURL,
                    location: expectValue(subhead).trim()
                }
                searchResults.push(labelResult);
                break;
            case "fan":
                const fanResult: FanSearchResult = {
                    type: "fan",
                    id: searchData.id,
                    name: name,
                    imageUrl: arturl,
                    url: cleanURL,
                }
                searchResults.push(fanResult);
                break;
        }
    })
    const pager = selectOne('.pager', html)
    const hasNext = pager ? !!selectOne('.nextprev.next', pager) : false;
    const lastCount = pager ? selectOne('.pagelist li:last-child a', pager) : undefined;
    const pageCount = lastCount ? innerText(lastCount) : 1
    const resultData: BandcampSearchResults = {
        results: searchResults,
        count: searchResults.length,
        hasNext,
        totalPages: Number(pageCount)
    }
    return resultData
}

function bandHTMLParser(html: Document): BandcampBandPage {
    const dataScript = selectOne('script[data-band]', html);
    if (!dataScript) {
        throw new Error('Not implemented')
    }
    const bandData = expectJSON(validate.bandData(getAttr(dataScript, 'data-band')))
    const itemsScript = selectOne('ol[data-client-items]', html)
    // Whenever this is present, it's just HTML encoded for some stupid reason.
    const itemsData = itemsScript ? validate.clientItems(he.decode(getAttr(itemsScript, 'data-client-items'))) : null
    let parsedItems: BandcampMiniRelease[] = [];
    if (itemsData) {
        parsedItems = itemsData.map((item) => {
            const cleanURL = expectValue(item.page_url.match(/([^?#]+)/)?.[1], 'release url')
            return {
                type: item.type,
                image: image.getImage({ idOrUrl: item.art_id, isId: true, a: true }),
                title: item.title,
                artist: item.artist ?? bandData.name,
                id: item.id,
                bandId: item.band_id,
                url: cleanURL,
            }
        })
    } else {
        const items = selectAll('li.music-grid-item', html);
        items.forEach((item) => {
            const idMatch = getAttr(item, 'data-item-id').match(/(album|track)-(\d+)/);
            const id = expectNumber(expectValue(idMatch?.[2], 'release id'), 'release id')
            const type = expectValue(idMatch?.[1], 'release type') == "album" ? 'album' : 'track'
            const bandId = expectNumber(getAttr(item, 'data-band-id'), 'band id')
            const rawUrl = getAttr(expectOne('a[href]', item), 'href');
            const partialMatch = rawUrl.match(/^\/(album|track)\/([^?#\/]+)/);
            const fullMatch = rawUrl.match(/(https?:\/\/[^\/]+\/(?:album|track)\/[^#?\/]+)/);
            const url = expectValue(partialMatch ? `${bandData.local_url}${rawUrl}` : fullMatch?.[1], 'release url')
            const imageUrl = getAttr(expectOne('.art img', item), 'src');
            const title = innerText(expectOne('.title', item)).trim();
            const artist = innerTextOpt(selectOne('.title .artist-override', item))?.trim() ?? bandData.name;
            const release: BandcampMiniRelease = {
                type,
                image: image.getImage({ idOrUrl: imageUrl, isId: false, a: true }),
                title,
                artist,
                id,
                bandId,
                url
            }
            parsedItems.push(release);
        })
    }
    const bandType = bandData.is_label ? "label" : "artist"
    const artistImage = selectOne('.band-photo', html);
    const imageUrl = artistImage ? getAttr(artistImage, 'src') : null;
    const bannerImageId = bandData.header_desktop?.image_id;
    const backgroundImageId = bandData.design.bg_image_id;
    let bandPage: BandcampBandPage = {
        type: bandType,
        id: bandData.id,
        name: bandData.name,
        url: bandData.url,
        subdomain: bandData.subdomain,
        raw: {
            data: bandData,
            items: itemsData
        },
        images: {
            artist: imageUrl ? image.getImage({ idOrUrl: imageUrl, isId: false }) : null,
            banner: bannerImageId ? image.getImage({ idOrUrl: bannerImageId, isId: true }) : null,
            background: backgroundImageId ? image.getImage({ idOrUrl: backgroundImageId, isId: true }) : null,
        },
        releases: parsedItems
    }
    if (bandPage.type == "label") {
        const artistsSelectorPanel = selectOne('.label-band-selector-container[data-label-band-selector]', html);
        const artists = artistsSelectorPanel ? validate.artistsSelectorPanel(getAttr(artistsSelectorPanel, 'data-label-band-selector')) : null;
        const miniArtists: BandcampMiniArtist[] | null = artists ? artists.member_bands.map((band) => {
            return {
                id: band.id,
                name: band.name,
                image: image.getImage({ idOrUrl: band.photo, isId: true })
            }
        }) : null
        return {
            ...bandPage,
            artists: miniArtists,
            raw: {
                ...bandPage.raw,
                artists
            }
        }
    } else {
        return bandPage;
    }
}

const parse = {
    searchHTML: searchHTMLParser,
    bandHTML: bandHTMLParser
}

export default parse;