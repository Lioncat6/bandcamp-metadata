// Contains typing of data formatted on bandcamp's side
// All JSON data obtained via the APIs

import type { BandcampReleaseType, BandcampReleaseTypeFull } from "./html-types.js";

// API response error
export interface BandcampAPIError {
    /**
     * Always true
     */
    error: boolean
    error_message: string
}

// tralbum details
// https://bandcamp.com/api/mobile/26/tralbum_details

export interface BandcampTralbumRoot {
    id: number;
    type: "t" | "a";
    title: string;
    bandcamp_url: string;
    art_id: number;
    band: TralbumBand;
    tralbum_artist: string;
    package_art: number[];
    featured_track_id: number;
    tracks: TralbumTrack[];
    credits: null | string;
    about: null | string;
    album_id: number | null;
    album_title: null | string;
    release_date: number;
    is_purchasable: boolean;
    free_download?: boolean;
    is_preorder: boolean;
    tags: TralbumTag[];
    currency?: string;
    is_set_price?: boolean;
    price?: number;
    require_email?: boolean;
    label?: null | string;
    label_id?: number | null;
    package_details_lite?: { [key: string]: TralbumPackageDetailsLite };
    has_digital_download?: boolean;
    num_downloadable_tracks?: number;
    merch_sold_out?: boolean | null;
    streaming_limit: number;
}

export interface TralbumBand {
    band_id: number;
    name: string;
    image_id: number;
    bio: null | string;
    location: null | string;
}

export interface TralbumPackageDetailsLite {
    title: string;
    image_ids: number[];
}

export interface TralbumTag {
    name: string;
    norm_name: string;
    url: string;
    isloc: boolean;
    loc_id: number | null;
    geoname: TralbumGeoname | null;
}

export interface TralbumGeoname {
    id: number;
    name: string;
    fullname: string;
}

export interface TralbumTrack {
    track_id: number;
    /**
     * Always null in testing
     */
    track_license_id: null | number;
    title: string;
    track_num: number | null;
    streaming_url: TralbumStreamingurl;
    duration: number;
    encodings_id: number;
    /**
     * Always null in testing
     */
    album_title: string | null;
    band_name: string;
    art_id: number | null;
    album_id: number | null;
    is_streamable: boolean;
    has_lyrics: boolean;
    is_set_price: boolean;
    price: number;
    has_digital_download: boolean;
    /**
     * Always null in testing
     */
    merch_ids: number | null;
    /**
     * Always null in testing
     */
    merch_sold_out: boolean | null;
    currency: string;
    require_email: boolean;
    is_purchasable: boolean;
    band_id: number;
    label: null | string;
    label_id: number | null;
    track_url: null | string;
}

export interface TralbumStreamingurl {
    "mp3-128": string;
}

export type TralbumApiResponse = BandcampTralbumRoot;


// Band details
// https://bandcamp.com/api/mobile/26/band_details

export interface BandPageRoot {
    id: number;
    name: string;
    bio_image_id: number;
    bio_image_width: number;
    bio_image_height: number;
    bio: string;
    bandcamp_url: string;
    sites: BandPageSite[];
    discography: BandPageDiscography[];
    location: string;
    /**
     * Always null in testing
     */
    header_image_id: number | null;
    shows: BandPageShow[];
    navbar_titles: BandPageNavbarTitles;
    merch: BandPageMerch[];
    /**
     * Only has artists on label pages
     */
    artists: BandPageArtist[];
}

export interface BandPageArtist {
    id: number;
    name: string;
    image_id: number;
    featured_date: number;
    location: string;
}

export interface BandPageDiscography {
    item_id: number;
    item_type: BandcampReleaseTypeFull;
    artist_name: null | string;
    band_name: string;
    title: string;
    art_id: number;
    release_date: string;
    is_purchasable: boolean;
    band_id: number;
}

export interface BandPageMerch {
    id: number;
    type_id: number;
    /**
     * Known Types (Non-exhastive):
     * "Vinyl LP" | "2 x Vinyl LP" | "Compact Disc (CD)" | "Vinyl Box Set" | "Other Vinyl" | "Bag" | "Hat" | "T-Shirt/Shirt" | "Other" | "T-Shirt/Apparel" | "Poster/Print"
     */
    type_name: string;
    title: string;
    grid_index: number;
    /**
     * Always null in testing
     */
    subscriber_only: boolean | null;
    arts: BandPageMerchArt[];
    /**
     * Always null in testing
     */
    album_art: string | null;
    download_type: BandcampReleaseType | null;
    download_id: number;
    download_title: null | string;
    download_has_audio: boolean;
    band_id: number;
    artist_name: null | string;
    in_stock: boolean;
    is_live_ticket: boolean;
}

export interface BandPageMerchArt {
    id: number;
    file_name: string;
    index: number;
    image_id: number;
    width: number;
    height: number;
    crc: number;
}

export interface BandPageNavbarTitles {
    m: string;
    p: string;
    l: string;
    a: string;
    v: string;
    u: string;
    s: string;
    c: string;
}

export interface BandPageShow {
    loc: string;
    date: string;
    uri: string;
    venue: string;
    utc_date: number;
    event_date: string;
}

export interface BandPageSite {
    url: string;
    title: string;
}

export type BandPageApiResponse = BandPageRoot;