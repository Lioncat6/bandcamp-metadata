import type { searchItemDisplayType } from "./bandcamp-types.js"

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


export type bandPageTypes = "artist" | "label"

export interface BandcampBandPage {
    type: bandPageTypes
    id: number
    url: string
    subdomain: string
    
}