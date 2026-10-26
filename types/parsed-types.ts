import type { bandClientItems, bandData, labelArtistsSelectorPanelData, searchItemDisplayType } from "./bandcamp/html-types.js"

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

export type bandPageTypes = "artist" | "label" | "stub"

export interface BandcampMiniRelease {
    image: BandcampImage
    artist: string
    bandId: number
    id: number
    url: string
    title: string
    type: "album" | "track"
}

interface BandcampPageRaw {
    data: bandData
    /**
     * Not present on all artist pages... for some reason.
     * Will fall back to parsing HTML to populate releases.
     */
    items: bandClientItems | null
}

interface BandcampBasePage {
    type: bandPageTypes
    id: number
    name: string
    images: {
        artist: BandcampImage | null
    }
    location: string | null
    bio: string | null
}

interface BandcampStubPage extends BandcampBasePage {
    type: "stub"
}

interface BandcampFullPageRoot extends BandcampBasePage {
    type: "artist" | "label"
    url: string
    subdomain: string
    /**
     * Raw JSON from bandcamp HTML, subject to change when bandcamp feels like it
     */
    raw: BandcampPageRaw
    releases: BandcampMiniRelease[]
    images: {
        artist: BandcampImage | null
        banner: BandcampImage | null
        background: BandcampImage | null
    }
}

export interface BandcampArtistPage extends BandcampFullPageRoot {
    type: "artist"
    shows: BandcampShow[] | null
}

interface BandcampLabelPageRaw extends BandcampPageRaw {
    /**
     * It seems labels can disable the artist selector on the discography tab, which removes this
     */
    artists: labelArtistsSelectorPanelData | null
}

interface BandcampLabelPage extends BandcampFullPageRoot {
    type: "label"
    /**
     * It seems labels can disable the artist selector on the discography tab, which removes this 
     */
    artists: BandcampMiniArtists | null
    raw: BandcampLabelPageRaw
}

export type BandcampBandPage = BandcampArtistPage | BandcampLabelPage | BandcampStubPage

export type BandcampMiniArtists = BandcampMiniArtist[]

export interface BandcampMiniArtist {
    id: number
    name: string
    image: BandcampImage
}

export interface BandcampShow {
    date: string
    venue: string
    url: string
    location: string
}

export interface BandcampReleasePageRoot {
    name: string
    id: number
    image: BandcampImage
    artist: string
    releaseDate: string
    publishDate: string
    modifyDate: string
    raw: {
        tralbum: null
    }
}