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