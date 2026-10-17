export interface BandcampSearchResults {
    results: BandcampSearchResult[]
    count: number
    hasNext: boolean
    totalPages: number
}

interface SearchResultBase {
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
    releaseDate?: string
    imageUrl: string
}

export interface TrackSearchResult extends SearchResultBase {
    type: "track"
    tags: string[]
    artist: string
    album?: string
    releaseDate?: string
    imageUrl: string
}

export interface LabelSearchResult extends SearchResultBase {
    type: "track"
    imageUrl: string
}

export interface FanSearchResult extends SearchResultBase {
    type: "fan"
    genre?: string
    imageUrl?: string
}

export type BandcampSearchResult =
    | ArtistSearchResult
    | AlbumSearchResult
    | TrackSearchResult
    | LabelSearchResult;

