import { Document, Element, NodeWithChildren, type ChildNode } from "domhandler"
import * as CSSselect from "css-select";
import type { BandcampSearchResult, BandcampSearchResults } from "../types/parsed-types.js";
import validate from "./schema.js";
import strings from "./strings.js";

function getAttr(element: Element, attr: string): string {
    const attribute = element.attribs[attr];
    if (!attribute) throw new Error(strings.errors.htmlParsingFailed.expectedAttribute(attr));
    return attribute;
}

function innerText(element: Element): string
function innerText(element: null): null
function innerText(element: Element | null): string | null {
    if (!element) return null;
    const inner = element.firstChild;
    if (inner?.type != "text") throw new Error(strings.errors.htmlParsingFailed.textChild);
    return inner.data;
}


function expectElement(element: Element | undefined | null): Element {
    if (!element) throw new Error(strings.errors.htmlParsingFailed.expected);
    return element;
}

function expectJSON<T>(data: T | undefined | null): T {
    if (!data) throw new Error(strings.errors.jsonParsingFailed);
    return data;
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

function searchHTMLParser(html: Document): BandcampSearchResults {
    let searchResults: BandcampSearchResult[] = []
    const results = selectAll('.result-items li', html)
    results.forEach((result) => {
        const searchData = expectJSON(validate.searchData(getAttr(result, 'data-search')));
        // Required
        const itemtype = innerText(expectOne('.itemtype', result))
        const name = innerText(expectOne('.heading a', result))
        const itemurl = getAttr(expectOne('.itemurl a', result), 'href')
        const cleanURL = itemurl.match(/^[^?#]+/)?.[0] ?? itemurl;
        // Optional
        const arturl = selectOne('.art img', result)?.attribs['src']; //Not required for fans
        const subhead = innerText(selectOne('.subhead', result))
    })
}






const parse = {
    searchHTML
}

export default parse;