// Contains typing of data formatted on bandcamp's side
// All JSON data obtained via scraping the site

export type searchItemType = bandType | albumType | trackType | fanType

/**
 * A band or label
 */
type bandType = "b"
/**
 * An album
 */
type albumType = "a"
/**
 * A track
 */
type trackType = "t"
/**
 * A fan
 */
type fanType = "f"

export type searchItemDisplayType = "label" | "artist" | "album" | "track" | "fan"

export interface searchData {
    type: searchItemType
    id: number
}

export interface tralbumData {
    url: string
}

export interface emptyBandData {
    id: number,
    name: string
}

/**
 * Found with selector script[data-band]
 * It's a monotype because I said so.
 * Should be regenerated using something like https://transform.tools/json-to-typescript if bandcamp changes something.
 * `any` should be replaced with x | null or unknown.
 * ?: should be replaced with x | null, unless it actually can be undefined.
 * You should realistically use a better typescript generator, but I like this one.
 */
export interface bandData {
    id: number
    create_date: string
    disabled_date: string | null
    name: string
    subdomain: string
    url: string
    https_url: string
    local_url: string
    https_local_url: string
    url_hints: {
        subdomain: string
        custom_domain: string | null
        custom_domain_verified: number | null
    }
    header_desktop: {
        url: string | null
        image_id: number
        width: number
        height: number
        image: {
            image_id: number
            url: string
            https_url: string
            format: number
            width: number
            height: number
        }
        paypal_image: {
            image_id: number
            url: string
            https_url: string
            format: number
            width: number
            height: number
        }
        using_map: number | null
        area_tags: Array<{
            shape: string
            coords: string
            href: string
            alt: string
            target: string | null
            title: string
        }> | null
    } | null
    header_phone: {
        image_id: number
        width: number
        height: number
        image: {
            image_id: number
            url: string
            https_url: string
            format: number
            width: number
            height: number
        }
    } | null
    design: {
        bg_color: string
        text_color: string
        secondary_text_color: string
        link_color: string
        body_color: string
        hd_ft_color: string
        navbar_bg_color: string
        invert_iconography: number | null
        tile_bg: number | null
        bg_halign: string | null
        bg_image_id: number | null
        bg_file_name: string | null
        defaultbg: boolean
        bg_fixed: number | null
        bg_behavior: string | null
    }
    currency: string
    fan_email: string | null
    thanks_enabled: number
    reviews_enabled: number
    is_label: boolean
    has_label: boolean
    paypal_matching_label_id: number | null
    merch_enabled: boolean
    google_analytics_id: string | null
    has_recommendations: boolean
    has_tralbums: boolean
    has_public_tralbums: boolean
    has_public_merch: boolean
    has_any_downloads: boolean
    has_discounts: boolean
    has_download_codes: boolean
    has_policies: boolean
    sites: Array<{
        url: string
        title: string
        nav_type: string | null
    }>
    navbar_items: Array<{
        url: string
        title: string
        nav_type: string
    }>
    navbar_hide: boolean
    navbar_hide_community: boolean
    has_items_for_sale: boolean
    public_video_ct: number | null
    private_video_ct: number | null
    playback_limits: {
        streaming_limits_enabled: boolean
        streaming_limit: number
    }
    genre_id: number | null
    meets_buy_full_discography_criteria: boolean
    buy_full_discography_banner_dismissed: number | null
    is_dsa_trader: boolean
}

/**
 * Found with selector ol[data-client-items]
 * Must be HTML decoded first
 */
export type bandClientItems = bandClientItem[]

export interface bandClientItem {
    art_id: number
    artist?: string
    band_id: number
    id: number
    page_url: string
    title: string
    type: "album" | "track"
}

/**
 * Artist selector panel data. Not very useful, but contains name, ID, & photo ID
 * .label-band-selector-container[data-label-band-selector]
 */

export interface labelArtistsSelectorPanelData {
    member_bands: Array<{
        id: number
        name: string
        photo: number
    }>
    label_band: {
        id: number
        name: string
    }
    label_has_own_items: boolean
}

/**
 * Release page interfaces
 * found with script[data-tralbum]
 */

type releasePageTypes = "album" | "track";

export interface ReleasePageDataRoot {
    item_type: releasePageTypes;
    "for the curious": string;
    preorder_count: null;
    hasAudio: boolean;
    art_id: number;
    packages: Package[] | null;
    defaultPrice: number;
    freeDownloadPage: null | string;
    FREE: number;
    PAID: number;
    artist: string;
    id: number;
    last_subscription_item: null;
    has_discounts: boolean;
    is_bonus: boolean | null;
    play_cap_data: PlayCapData | null;
    is_purchased: boolean;
    items_purchased: ItemsPurchased;
    is_private_stream: null;
    is_band_member: null;
    licensed_version_ids: number[] | null;
    package_associated_license_id: null;
    has_video: boolean | null;
    tralbum_subscriber_only: boolean;
    album_is_preorder: boolean;
    album_release_date: string;
    playing_from: string;
    url: string;
    trackinfo: Trackinfo[];
}

export interface AlbumReleasePageData extends ReleasePageDataRoot {
    item_type: "album";
    featured_track_id: number;
    initial_track_num: null;
    is_preorder: boolean;
    playing_from: "album page";
    use_expando_lyrics: boolean;
    current: CurrentAlbum;
}

export interface TrackReleasePageData extends ReleasePageDataRoot {
    item_type: "track";
    album_url: null | string;
    album_upsell_url: null | string;
    playing_from: "track page";
    current: CurrentTrack;
}

export interface CurrentRoot {
    audit: number;
    title: string;
    new_date: string;
    mod_date: string;
    publish_date: string;
    private: null;
    killed: null;
    download_pref: number | null;
    require_email: number | null;
    is_set_price: number | null;
    set_price: number;
    minimum_price: number;
    minimum_price_nonzero: number | null;
    require_email_0: number | null;
    artist: null | string;
    about: null | string;
    credits: null | string;
    auto_repriced: null;
    new_desc_format: number;
    band_id: number;
    selling_band_id: number;
    art_id: number;
    download_desc_id: number | null;
    release_date: string;
    id: number;
    type: releasePageTypes;
}

export interface CurrentAlbum extends CurrentRoot {
    type: "album"
    upc: null | string;
    purchase_url: null;
    purchase_title: null;
    featured_track_id: number;
}

export interface CurrentTrack extends CurrentRoot {
    type: "track"
    track_number: number | null;
    file_name: null;
    lyrics: null | string;
    album_id: number | null;
    encodings_id: number;
    pending_encodings_id: number | null;
    license_type: number;
    isrc: null | string;
    preorder_download: number | null;
    streaming: number;
}

export interface ItemsPurchased {
    packages: Bundles;
    bundles: Bundles;
    crowdfunding_campaign: Bundles;
}

export interface Bundles {
}

export interface Package {
    id: number;
    url: string;
    url_for_app: string;
    type_id: number;
    type_name: string;
    title: string;
    description: string;
    desc_pt1: string;
    desc_pt2: null | string;
    new_desc_format: number;
    grid_index: number | null;
    private: null;
    subscriber_only: null;
    price: number;
    is_set_price: number | null;
    is_live_ticket: number | null;
    live_event_over: null;
    live_event_id: number | null;
    live_event_title: null | string;
    live_event_url: null | string;
    live_event_gcal_url: null | string;
    live_event_ical_url: null | string;
    live_event_replays_enabled: null;
    live_event_image_color_one: null | string;
    live_event_image_color_two: null | string;
    sku: string;
    upc: null | string;
    band_id: number;
    selling_band_id: number;
    label: null | string;
    currency: string; // Currency
    country: null;
    tax_rate: null;
    options_title: null | string;
    options: Option[] | null;
    origins: Origin[];
    arts: Art[];
    album_art: AlbumArt | null;
    album_art_id: number | null;
    shipping_exception_mode: null | string;
    download_type: "a" | null;
    download_id: number;
    download_is_preorder: number | null;
    download_release_date: null | string;
    download_title: string;
    download_url: null | string;
    download_has_audio: boolean;
    download_track_count: number | null;
    download_art_id: number | null;
    download_artist: null | string;
    fulfillment_days: number | null;
    release_date: null | string;
    new_date: string;
    edition_size: number | null;
    /**
     * Always null in testing
     */
    quantity_sold: number | null;
    quantity_available: number | null;
    quantity_limits: number | null;
    quantity_warning: boolean | null;
    album_id: number | null;
    album_title: null | string;
    album_artist: null | string;
    album_private: null;
    album_publish_date: null | string;
    album_release_date: null | string;
    subscriber_only_published: boolean;
    featured_date: null;
    certified_seller: number;
    limited_checkout: boolean;
    associated_license_id: null;
    live_event_scheduled_start_date: null | string;
    live_event_scheduled_end_date: null;
    live_event_start_date: null | string;
    /**
     * Always null in testing
     */
    live_event_end_date: string | null;
    live_event_timezone: number | null;
    live_event_type: null | string;
    listening_party_duration: number | null;
    is_cardable: boolean;
}

export interface AlbumArt {
    id: number;
    url: string;
    https_url: string;
}

export interface Art {
    id: number;
    file_name: string;
    index: number;
    image_id: number;
    width: number;
    height: number;
    crc: number;
}

// export type Currency = "CAD" | "USD" | "GBP" | "EUR" | "PLN";

export interface Option {
    id: number;
    index: number;
    title: string;
    sku: string;
    quantity: null;
    quantity_sold: null;
    quantity_available: number | null;
    origins: Origin[];
}

export interface Origin {
    id: number;
    /**
     * Always null in testing
     */
    quantity: number | null;
    /**
     * Always null in testing
     */
    quantity_sold: number | null;
    quantity_available: number | null;
    package_id: number;
    option_id: number;
}

export interface PlayCapData {
    streaming_limits_enabled: boolean;
    streaming_limit: number;
}

export interface Trackinfo {
    id: number | null;
    track_id: number;
    file: File | null;
    artist?: null;
    title: string;
    encodings_id?: number;
    license_type: number;
    private?: null;
    track_num: number | null;
    album_preorder: boolean;
    unreleased_track: boolean;
    title_link: null | string;
    has_lyrics: boolean | null;
    has_info: boolean;
    streaming: number | null;
    /**
     * Seemingly can only be true, 2, or null
     * When this is 2, (from my very small sample size) all the optional variables are set to undefined
     */
    is_downloadable: boolean | number | null;
    has_free_download: boolean | null;
    free_album_download?: boolean;
    duration: number;
    /**
     * Almost always null on album pages
     */
    lyrics: null | string;
    sizeof_lyrics: number;
    is_draft: boolean;
    video_source_type?: null | string;
    video_source_id?: null | string;
    video_mobile_url?: null | string;
    video_poster_url?: null | string;
    video_id?: number | null;
    video_caption?: null | string;
    video_featured?: number | null;
    alt_link?: null;
    encoding_error?: null;
    encoding_pending?: null;
    play_count: number | null;
    is_capped: boolean | null;
    track_license_id?: null;
}

export interface File {
    "mp3-128": string;
    "mp3-v0"?: string;
}


export type BandcampReleasePageData = TrackReleasePageData | AlbumReleasePageData;