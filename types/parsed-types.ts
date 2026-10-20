import type { bandClientItems, bandData, searchItemDisplayType } from "./bandcamp/html-types.js"

// Contains typing of data formatted on our side; After parsing, so should be "clean" data
export interface BandcampSearchResults {
    results: BandcampSearchResult[]
    count: number
    hasNext: boolean
    totalPages: number
}

interface SearchResultBase {
    type: searchItemDisplayType
    name: string
    url: string
    id: number
}

export interface ArtistSearchResult extends SearchResultBase {
    type: "artist"
    genre: string
    tags: string[]
    location: string
    imageUrl: string
}

export interface AlbumSearchResult extends SearchResultBase {
    type: "album"
    tags: string[]
    artist: string
    trackCount: number
    duration: number
    releaseDate: string
    imageUrl: string
}

export interface TrackSearchResult extends SearchResultBase {
    type: "track"
    tags: string[]
    artist: string
    album?: string | undefined
    releaseDate: string
    imageUrl: string
}

export interface LabelSearchResult extends SearchResultBase {
    type: "label"
    imageUrl: string
    location: string
}

export interface FanSearchResult extends SearchResultBase {
    type: "fan"
    genre?: string
    imageUrl?: string | undefined
}

export type BandcampSearchResult =
    AlbumSearchResult |
    ArtistSearchResult |
    TrackSearchResult |
    LabelSearchResult |
    FanSearchResult;


export interface BandcampImage {
    id: number
    url: string
    bestUrl: string
}

export type bandPageTypes = "artist" | "label"

export interface BandcampMiniRelease {
    image: BandcampImage
    artist: string
    bandId: number
    id: number
    url: string
    title: string
    type: "album" | "track"
}

interface BandcampPageRoot {
    type: bandPageTypes
    id: number
    url: string
    subdomain: string
    /**
     * Raw JSON from bandcamp HTML, subject to change when bandcamp feels like it
     */
    raw: {
        data: bandData
        /**
         * Not present on all artist pages... for some reason.
         * Will fall back to parsing HTML to populate releases.
         */
        items: bandClientItems | null
    }
    releases: BandcampMiniRelease[]
    images: {
        artist: BandcampImage
        banner: BandcampImage | null
        background: BandcampImage | null
    }
}

interface BandcampLabelPage extends BandcampPageRoot {
    type: "label"
    artists: any
}

export type BandcampBandPage = BandcampPageRoot | BandcampLabelPage