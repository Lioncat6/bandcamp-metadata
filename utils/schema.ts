import Ajv, { type JTDDataType, type JTDParser } from "ajv/dist/jtd.js"
import type { JTDSchemaType } from "ajv/dist/core.js"
import type { BandcampSearchResult } from "../types/parsed-types.js"
import strings from "./strings.js"
import type { AlbumReleasePageData, BandcampReleasePageData, bandClientItems, bandData, CurrentAlbum, CurrentRoot, CurrentTrack, emptyBandData, labelArtistsSelectorPanelData, Package, ReleasePageDataRoot, searchData, searchItemDisplayType, searchItemType, Trackinfo, TrackReleasePageData } from "../types/bandcamp/html-types.js"
import { trace } from "console"
import type { BandcampAPIError, BandPageApiResponse, BandPageArtist, BandPageDiscography, BandPageMerch, BandPageMerchArt, BandPageNavbarTitles, BandPageShow, BandPageSite, TralbumApiResponse, TralbumBand, TralbumGeoname, TralbumPackageDetailsLite, TralbumStreamingurl, TralbumTag, TralbumTrack } from "../types/bandcamp/api-types.js"
const ajv = new Ajv.Ajv({
    int32range: false
})

type NumberType = JTDSchemaType<{ num: number }>["properties"]["num"]["type"]
type StringType = JTDSchemaType<{ str: string }>["properties"]["str"]["type"]
const number: { type: NumberType } = { type: "uint32" };
const string: { type: StringType } = { type: "string" }

export interface searchItemTypeInterface {
    type: searchItemDisplayType
}

const searchDataSchema: JTDSchemaType<searchData> = {
    properties: {
        type: { enum: ["b", "a", "t", "f"] },
        id: { type: "uint32" }
    }
}

const searchDataParser = ajv.compileParser(searchDataSchema)

/**
 * Unused for now
 */
const searchResultSchema: JTDSchemaType<BandcampSearchResult> = {
    discriminator: "type",
    mapping: {
        'album': {
            properties: {
                id: { type: "uint32" },
                name: { type: "string" },
                url: { type: "string" },
                imageUrl: { type: "string" },
                tags: { elements: { type: "string" } },
                releaseDate: { type: "string" },
                trackCount: { type: "uint32" },
                duration: { type: "uint32" },
                artist: { type: "string" }
            }
        },
        'artist': {
            properties: {
                id: { type: "uint32" },
                name: { type: "string" },
                url: { type: "string" },
                imageUrl: { type: "string" },
                tags: { elements: { type: "string" } },
                genre: { type: "string" },
                location: { type: "string" }
            }
        },
        'label': {
            properties: {
                id: { type: "uint32" },
                name: { type: "string" },
                url: { type: "string" },
                imageUrl: { type: "string" },
                location: { type: "string" }
            }
        },
        'track': {
            properties: {
                id: { type: "uint32" },
                name: { type: "string" },
                url: { type: "string" },
                imageUrl: { type: "string" },
                tags: { elements: { type: "string" } },
                releaseDate: { type: "string" },
                artist: { type: "string" }
            },
            optionalProperties: {
                album: { type: "string" }
            }
        },
        'fan': {
            properties: {
                id: { type: "uint32" },
                name: { type: "string" },
                url: { type: "string" },
            },
            optionalProperties: {
                imageUrl: { type: "string" },
                genre: { type: "string" }
            }
        }
    },
}

/**
 * Unused for now
 */
const searchResultParser = ajv.compileParser(searchResultSchema)

const searchTypeSchema: JTDSchemaType<searchItemTypeInterface> = {
    properties: {
        type: { enum: ["label", "artist", "album", "track", "fan"] }
    }
}

const searchTypeParser = ajv.compileParser(searchTypeSchema)

const bandDataSchema: JTDSchemaType<bandData> = {
    properties: {
        id: { type: "uint32" },
        create_date: { type: "string" },
        disabled_date: { type: "string", nullable: true },
        name: { type: "string" },
        subdomain: { type: "string" },
        url: { type: "string" },
        https_url: { type: "string" },
        local_url: { type: "string" },
        https_local_url: { type: "string" },
        url_hints: {
            properties: {
                subdomain: { type: "string" },
                custom_domain: { type: "string", nullable: true },
                custom_domain_verified: { type: "uint32", nullable: true },
            }
        },
        header_desktop: {
            properties: {
                url: { type: "string", nullable: true },
                image_id: { type: "uint32" },
                width: { type: "uint32" },
                height: { type: "uint32" },
                image: {
                    properties: {
                        image_id: { type: "uint32" },
                        url: { type: "string" },
                        https_url: { type: "string" },
                        format: { type: "uint32" },
                        width: { type: "uint32" },
                        height: { type: "uint32" },
                    }
                },
                paypal_image: {
                    properties: {
                        image_id: { type: "uint32" },
                        url: { type: "string" },
                        https_url: { type: "string" },
                        format: { type: "uint32" },
                        width: { type: "uint32" },
                        height: { type: "uint32" },
                    }
                },
                using_map: { type: "uint32", nullable: true },
                area_tags: {
                    elements: {
                        properties: {
                            shape: { type: "string" },
                            coords: { type: "string" },
                            href: { type: "string" },
                            alt: { type: "string" },
                            target: { type: "string", nullable: true },
                            title: { type: "string" },
                        }
                    },
                    nullable: true
                }
            },
            nullable: true
        },
        header_phone: {
            properties: {
                image_id: { type: "uint32" },
                width: { type: "uint32" },
                height: { type: "uint32" },
                image: {
                    properties: {
                        image_id: { type: "uint32" },
                        url: { type: "string" },
                        https_url: { type: "string" },
                        format: { type: "uint32" },
                        width: { type: "uint32" },
                        height: { type: "uint32" },
                    }
                }
            },
            nullable: true
        },
        design: {
            properties: {
                bg_color: { type: "string" },
                text_color: { type: "string" },
                secondary_text_color: { type: "string" },
                link_color: { type: "string" },
                body_color: { type: "string" },
                hd_ft_color: { type: "string" },
                navbar_bg_color: { type: "string" },
                invert_iconography: { type: "uint32", nullable: true },
                tile_bg: { type: "uint32", nullable: true },
                bg_halign: { type: "string", nullable: true },
                bg_image_id: { type: "uint32", nullable: true },
                bg_file_name: { type: "string", nullable: true },
                defaultbg: { type: "boolean" },
                bg_fixed: { type: "uint32", nullable: true },
                bg_behavior: { type: "string", nullable: true },
            }
        },
        currency: { type: "string" },
        fan_email: { type: "string", nullable: true },
        thanks_enabled: { type: "uint32" },
        reviews_enabled: { type: "uint32" },
        is_label: { type: "boolean" },
        has_label: { type: "boolean" },
        paypal_matching_label_id: { type: "uint32", nullable: true },
        merch_enabled: { type: "boolean" },
        google_analytics_id: { type: "string", nullable: true },
        has_recommendations: { type: "boolean" },
        has_tralbums: { type: "boolean" },
        has_public_tralbums: { type: "boolean" },
        has_public_merch: { type: "boolean" },
        has_any_downloads: { type: "boolean" },
        has_discounts: { type: "boolean" },
        has_download_codes: { type: "boolean" },
        has_policies: { type: "boolean" },
        sites: {
            elements: {
                properties: {
                    url: { type: "string" },
                    title: { type: "string" },
                    nav_type: { type: "string", nullable: true },
                }
            }
        },
        navbar_items: {
            elements: {
                properties: {
                    url: { type: "string" },
                    title: { type: "string" },
                    nav_type: { type: "string" },
                }
            }
        },
        navbar_hide: { type: "boolean" },
        navbar_hide_community: { type: "boolean" },
        has_items_for_sale: { type: "boolean" },
        public_video_ct: { type: "uint32", nullable: true },
        private_video_ct: { type: "uint32", nullable: true },
        playback_limits: {
            properties: {
                streaming_limits_enabled: { type: "boolean" },
                streaming_limit: { type: "uint32" },
            }
        },
        genre_id: { type: "uint32", nullable: true },
        meets_buy_full_discography_criteria: { type: "boolean" },
        buy_full_discography_banner_dismissed: { type: "uint32", nullable: true },
        is_dsa_trader: { type: "boolean" },
    }
}

const bandDataParser = ajv.compileParser(bandDataSchema)

const clientItemsSchema: JTDSchemaType<bandClientItems> = {
    elements: {
        properties: {
            art_id: { type: "uint32" },
            band_id: { type: "uint32" },
            id: { type: "uint32" },
            page_url: { type: "string" },
            title: { type: "string" },
            type: {
                enum: ["album", "track"]
            }
        },
        optionalProperties: {
            artist: { type: "string" }
        }
    }
}

const clientItemsParser = ajv.compileParser(clientItemsSchema)

const labelArtistsSelectorPanelSchema: JTDSchemaType<labelArtistsSelectorPanelData> = {
    properties: {
        member_bands: {
            elements: {
                properties: {
                    id: { type: 'uint32' },
                    name: { type: 'string' },
                    photo: { type: 'uint32' }
                }
            }
        },
        label_band: {
            properties: {
                id: { type: 'uint32' },
                name: { type: 'string' }
            }
        },
        label_has_own_items: { type: 'boolean' }
    }
}

const labelArtistsSelectorPanelParser = ajv.compileParser(labelArtistsSelectorPanelSchema);

const emptyBandDataSchema: JTDSchemaType<emptyBandData> = {
    properties: {
        id: { type: 'uint32' },
        name: { type: 'string' }
    }
}

const emptyBandDataParser = ajv.compileParser(emptyBandDataSchema);

const releasePageDataCurrentRootSchema: JTDSchemaType<CurrentRoot> = {
    properties: {
        audit: { type: 'uint32' },
        title: { type: 'string' },
        new_date: { type: 'string' },
        mod_date: { type: 'string' },
        publish_date: { type: 'string' },
        private: { type: 'boolean', nullable: true },
        killed: { type: 'boolean', nullable: true },
        download_pref: { type: 'uint32', nullable: true },
        require_email: { type: 'uint32', nullable: true },
        is_set_price: { type: 'uint32', nullable: true },
        set_price: { type: 'float32' },
        minimum_price: { type: 'float32' },
        minimum_price_nonzero: { type: 'float32', nullable: true },
        require_email_0: { type: 'uint32', nullable: true },
        artist: { type: 'string', nullable: true },
        about: { type: 'string', nullable: true },
        credits: { type: 'string', nullable: true },
        auto_repriced: { type: 'boolean', nullable: true },
        new_desc_format: { type: 'uint32' },
        band_id: { type: 'uint32' },
        selling_band_id: { type: 'uint32' },
        art_id: { type: 'uint32' },
        download_desc_id: { type: 'uint32', nullable: true },
        release_date: { type: 'string' },
        id: { type: 'uint32' },
        type: { enum: ["album", "track"] }
    }
}

const releasePageCurrentAlbumSchema: JTDSchemaType<CurrentAlbum> = {
    properties: {
        ...releasePageDataCurrentRootSchema.properties,
        type: { enum: ["album"] },
        upc: { type: 'string', nullable: true },
        purchase_url: { type: 'string', nullable: true },
        purchase_title: { type: 'string', nullable: true },
        featured_track_id: { type: 'uint32' },
    }
}

const releasePageCurrentTrackSchema: JTDSchemaType<CurrentTrack> = {
    properties: {
        ...releasePageDataCurrentRootSchema.properties,
        type: { enum: ["track"] },
        track_number: { type: 'uint32', nullable: true },
        file_name: { type: 'string', nullable: true },
        lyrics: { type: 'string', nullable: true },
        album_id: { type: 'uint32', nullable: true },
        encodings_id: { type: 'uint32' },
        pending_encodings_id: { type: 'uint32', nullable: true },
        license_type: { type: 'uint32' },
        isrc: { type: 'string', nullable: true },
        preorder_download: { type: 'uint32', nullable: true },
        streaming: { type: 'uint32' },
    }
}

const releasePageDataCurrentSchema: JTDSchemaType<CurrentTrack | CurrentAlbum> = {
    discriminator: 'type',
    mapping: {
        'album': releasePageCurrentAlbumSchema,
        'track': releasePageCurrentTrackSchema
    }
}

const trackInfoSchema: JTDSchemaType<Trackinfo> = {
    properties: {
        id: { type: 'uint32', nullable: true },
        track_id: { type: 'uint32' },
        file: {
            properties: {
                "mp3-128": { type: 'string' }
            },
            optionalProperties: {
                "mp3-v0": { type: 'string' }
            },
            nullable: true
        },
        title: { type: 'string' },
        license_type: { type: 'uint32' },
        track_num: { type: 'uint32', nullable: true },
        album_preorder: { type: 'boolean' },
        unreleased_track: { type: 'boolean' },
        title_link: { type: 'string', nullable: true },
        has_lyrics: { type: 'boolean', nullable: true },
        has_info: { type: 'boolean' },
        streaming: { type: 'uint32', nullable: true },
        // Technically, this is representing the 'any' type because JTD is dumb
        // Should be `is_downloadable: boolean | number | null`, but you can't do that with JTD
        is_downloadable: {} as never,
        has_free_download: { type: 'boolean', nullable: true },
        duration: { type: 'float32' },
        lyrics: { type: 'string', nullable: true },
        sizeof_lyrics: { type: 'uint32' },
        is_draft: { type: 'boolean' },
        play_count: { type: 'uint32', nullable: true },
        is_capped: { type: 'boolean', nullable: true },
    },
    optionalProperties: {
        artist: { type: 'string', nullable: true },
        encodings_id: { type: 'uint32' },
        private: { type: 'boolean', nullable: true },
        free_album_download: { type: 'boolean' },
        video_source_type: { type: 'string', nullable: true },
        video_source_id: { type: 'string', nullable: true },
        video_mobile_url: { type: 'string', nullable: true },
        video_poster_url: { type: 'string', nullable: true },
        video_id: { type: 'uint32', nullable: true },
        video_caption: { type: 'string', nullable: true },
        video_featured: { type: 'uint32', nullable: true },
        alt_link: { type: 'string', nullable: true },
        encoding_error: { type: 'boolean', nullable: true },
        encoding_pending: { type: 'boolean', nullable: true },
        track_license_id: { type: 'uint32', nullable: true }
    }
}

const packageSchema: JTDSchemaType<Package> = {
    properties: {
        id: { type: 'uint32' },
        url: { type: 'string' },
        url_for_app: { type: 'string' },
        type_id: { type: 'uint32' },
        type_name: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        desc_pt1: { type: 'string' },
        desc_pt2: { type: 'string', nullable: true },
        new_desc_format: { type: 'uint32' },
        grid_index: { type: 'uint32', nullable: true },
        private: { type: 'boolean', nullable: true },
        subscriber_only: { type: 'boolean', nullable: true },
        price: { type: 'float32' },
        is_set_price: { type: 'uint32', nullable: true },
        is_live_ticket: { type: 'uint32', nullable: true },
        live_event_over: { type: 'boolean', nullable: true },
        live_event_id: { type: 'uint32', nullable: true },
        live_event_title: { type: 'string', nullable: true },
        live_event_url: { type: 'string', nullable: true },
        live_event_gcal_url: { type: 'string', nullable: true },
        live_event_ical_url: { type: 'string', nullable: true },
        live_event_replays_enabled: { type: 'boolean', nullable: true },
        live_event_image_color_one: { type: 'string', nullable: true },
        live_event_image_color_two: { type: 'string', nullable: true },
        sku: { type: 'string' },
        upc: { type: 'string', nullable: true },
        band_id: { type: 'uint32' },
        selling_band_id: { type: 'uint32' },
        label: { type: 'string', nullable: true },
        currency: { type: 'string' }, // Currency
        country: { type: 'string', nullable: true },
        tax_rate: { type: 'uint32', nullable: true },
        options_title: { type: 'string', nullable: true },
        options: {
            elements: {
                properties: {
                    id: { type: 'uint32' },
                    index: { type: 'uint32' },
                    title: { type: 'string' },
                    sku: { type: 'string' },
                    quantity: { type: 'uint32', nullable: true },
                    quantity_sold: { type: 'uint32', nullable: true },
                    quantity_available: { type: 'uint32', nullable: true },
                    origins: {
                        elements: {
                            properties: {
                                id: { type: 'uint32' },
                                quantity: { type: 'uint32', nullable: true },
                                quantity_sold: { type: 'uint32', nullable: true },
                                quantity_available: { type: 'uint32', nullable: true },
                                package_id: { type: 'uint32' },
                                option_id: { type: 'uint32' },
                            }
                        }
                    }
                }
            },
            nullable: true
        },
        origins: {
            elements: {
                properties: {
                    id: { type: 'uint32' },
                    quantity: { type: 'uint32', nullable: true },
                    quantity_sold: { type: 'uint32', nullable: true },
                    quantity_available: { type: 'uint32', nullable: true },
                    package_id: { type: 'uint32' },
                    option_id: { type: 'uint32' },
                }
            }
        },
        arts: {
            elements: {
                properties: {
                    id: { type: 'uint32' },
                    file_name: { type: 'string' },
                    index: { type: 'uint32' },
                    image_id: { type: 'uint32' },
                    width: { type: 'uint32' },
                    height: { type: 'uint32' },
                    crc: { type: 'uint32' },
                }
            }
        },
        album_art: {
            properties: {
                id: { type: 'uint32' },
                url: { type: 'string' },
                https_url: { type: 'string' },
            },
            nullable: true
        },
        album_art_id: { type: 'uint32', nullable: true },
        shipping_exception_mode: { type: 'string', nullable: true },
        download_type: { enum: ["a"], nullable: true },
        download_id: { type: 'uint32' },
        download_is_preorder: { type: 'uint32', nullable: true },
        download_release_date: { type: 'string', nullable: true },
        download_title: { type: 'string' },
        download_url: { type: 'string', nullable: true },
        download_has_audio: { type: 'boolean' },
        download_track_count: { type: 'uint32', nullable: true },
        download_art_id: { type: 'uint32', nullable: true },
        download_artist: { type: 'string', nullable: true },
        fulfillment_days: { type: 'uint32', nullable: true },
        release_date: { type: 'string', nullable: true },
        new_date: { type: 'string' },
        edition_size: { type: 'uint32', nullable: true },
        quantity_sold: { type: 'uint32', nullable: true },
        quantity_available: { type: 'uint32', nullable: true },
        quantity_limits: { type: 'uint32', nullable: true },
        quantity_warning: { type: 'boolean', nullable: true },
        album_id: { type: 'uint32', nullable: true },
        album_title: { type: 'string', nullable: true },
        album_artist: { type: 'string', nullable: true },
        album_private: { type: 'boolean', nullable: true },
        album_publish_date: { type: 'string', nullable: true },
        album_release_date: { type: 'string', nullable: true },
        subscriber_only_published: { type: 'boolean' },
        featured_date: { type: 'string', nullable: true },
        certified_seller: { type: 'uint32' },
        limited_checkout: { type: 'boolean' },
        associated_license_id: { type: 'uint32', nullable: true },
        live_event_scheduled_start_date: { type: 'string', nullable: true },
        live_event_scheduled_end_date: { type: 'string', nullable: true },
        live_event_start_date: { type: 'string', nullable: true },
        live_event_end_date: { type: 'string', nullable: true },
        live_event_timezone: { type: 'uint32', nullable: true },
        live_event_type: { type: 'string', nullable: true },
        listening_party_duration: { type: 'uint32', nullable: true },
        is_cardable: { type: 'boolean' }
    }
}

const releasePageDataRootSchema: JTDSchemaType<ReleasePageDataRoot> = {
    properties: {
        item_type: { enum: ["album", "track"] },
        "for the curious": { type: 'string' },
        preorder_count: { type: 'uint32', nullable: true },
        hasAudio: { type: 'boolean' },
        art_id: { type: 'uint32' },
        packages: {
            elements: packageSchema,
            nullable: true
        },
        defaultPrice: { type: 'float32' },
        freeDownloadPage: { type: 'string', nullable: true },
        FREE: { type: 'uint32' },
        PAID: { type: 'uint32' },
        artist: { type: 'string' },
        id: { type: 'uint32' },
        last_subscription_item: {
            optionalProperties: {

            },
            nullable: true
        },
        has_discounts: { type: 'boolean' },
        is_bonus: { type: 'boolean', nullable: true },
        play_cap_data: {
            properties: {
                streaming_limits_enabled: { type: 'boolean' },
                streaming_limit: { type: 'uint32' }
            },
            nullable: true
        },
        is_purchased: { type: 'boolean', nullable: true },
        items_purchased: {
            properties: {
                packages: {} as never,
                bundles: {} as never,
                crowdfunding_campaign: {} as never
            },
            nullable: true
        },
        is_private_stream: { type: 'boolean', nullable: true },
        is_band_member: { type: 'boolean', nullable: true },
        licensed_version_ids: {
            elements: {
                type: 'uint32'
            },
            nullable: true
        },
        package_associated_license_id: { type: 'uint32', nullable: true },
        has_video: { type: 'boolean', nullable: true },
        tralbum_subscriber_only: { type: 'boolean' },
        album_is_preorder: { type: 'boolean' },
        album_release_date: { type: 'string' },
        playing_from: { enum: ["album page", "track page"] },
        url: { type: 'string' },
        trackinfo: {
            elements: trackInfoSchema
        },
        current: releasePageDataCurrentSchema
    }
}

// Holy fuck the type errors are gone
// This was really painful
const releasePageDataSchema: JTDSchemaType<BandcampReleasePageData> = {
    discriminator: "item_type",
    mapping: {
        'album': {
            properties: {
                ...releasePageDataRootSchema.properties,
                featured_track_id: { type: 'uint32' },
                initial_track_num: { type: 'uint32', nullable: true },
                is_preorder: { type: 'boolean' },
                playing_from: { enum: ["album page"] },
                use_expando_lyrics: { type: 'boolean' },
                current: releasePageCurrentAlbumSchema
            }
        },
        'track': {
            properties: {
                ...releasePageDataRootSchema.properties,
                album_url: { type: 'string', nullable: true },
                album_upsell_url: { type: 'string', nullable: true },
                playing_from: { enum: ["track page"] },
                current: releasePageCurrentTrackSchema
            }
        }
    }
}

const releasePageDataParser = ajv.compileParser<BandcampReleasePageData>(releasePageDataSchema);

const tralbumApiResponseBandSchema: JTDSchemaType<TralbumBand> = {
    properties: {
        band_id: { type: "uint32" },
        name: { type: "string" },
        image_id: { type: "uint32" },
        bio: { type: "string", nullable: true },
        location: { type: "string", nullable: true }
    }
}

const tralbumApiResponseStreamingurlSchema: JTDSchemaType<TralbumStreamingurl> = {
    properties: {
        "mp3-128": { type: 'string' }
    }
}

const tralbumAPIResponseTrackSchema: JTDSchemaType<TralbumTrack> = {
    properties: {
        track_id: { type: "uint32" },
        // Always null in testing
        track_license_id: { type: "uint32", nullable: true },
        title: { type: "string" },
        track_num: { type: "uint32", nullable: true },
        streaming_url: tralbumApiResponseStreamingurlSchema,
        duration: { type: "float32" },
        encodings_id: { type: "uint32" },
        // Always null in testing
        album_title: { type: "string", nullable: true },
        band_name: { type: "string" },
        art_id: { type: "uint32", nullable: true },
        album_id: { type: "uint32", nullable: true },
        is_streamable: { type: "boolean" },
        has_lyrics: { type: "boolean" },
        is_set_price: { type: "boolean" },
        price: { type: "float32" },
        has_digital_download: { type: "boolean" },
        // Always null in testing
        merch_ids: { type: "uint32", nullable: true },
        // Always null in testing
        merch_sold_out: { type: "boolean", nullable: true },
        currency: { type: "string" },
        require_email: { type: "boolean" },
        is_purchasable: { type: "boolean" },
        band_id: { type: "uint32" },
        label: { type: "string", nullable: true },
        label_id: { type: "uint32", nullable: true },
        track_url: { type: "string", nullable: true }
    }
}

const tralbumApiResponseGeonameSchema: JTDSchemaType<TralbumGeoname> = {
    properties: {
        id: { type: "uint32" },
        name: { type: "string" },
        fullname: { type: "string" }
    }
}

const tralbumApiResponseTagSchema: JTDSchemaType<TralbumTag> = {
    properties: {
        name: { type: "string" },
        norm_name: { type: "string" },
        url: { type: "string" },
        isloc: { type: "boolean" },
        loc_id: { type: "uint32", nullable: true },
        geoname: { ...tralbumApiResponseGeonameSchema, nullable: true }
    }
}

const tralbumApiResponsePackageDetailsLiteSchema: JTDSchemaType<TralbumPackageDetailsLite> = {
    properties: {
        title: { type: 'string' },
        image_ids: { elements: { type: 'uint32' } }
    }
}

const tralbumApiResponseSchema: JTDSchemaType<TralbumApiResponse> = {
    properties: {
        id: { type: "uint32" },
        type: { enum: ["t", "a"] },
        title: { type: "string" },
        bandcamp_url: string,
        art_id: number,
        band: tralbumApiResponseBandSchema,
        tralbum_artist: string,
        package_art: { elements: { type: 'uint32' } },
        featured_track_id: number,
        tracks: { elements: tralbumAPIResponseTrackSchema },
        credits: { type: 'string', nullable: true },
        about: { type: 'string', nullable: true },
        album_id: { type: 'uint32', nullable: true },
        album_title: { type: 'string', nullable: true },
        release_date: { type: 'uint32' },
        is_purchasable: { type: 'boolean' },
        is_preorder: { type: 'boolean' },
        tags: { elements: tralbumApiResponseTagSchema },
        streaming_limit: { type: 'uint32' }
    },
    optionalProperties: {
        free_download: { type: 'boolean' },
        currency: { type: 'string' },
        is_set_price: { type: 'boolean' },
        price: { type: 'float32' },
        require_email: { type: 'boolean' },
        label: { type: 'string', nullable: true },
        label_id: { type: 'uint32', nullable: true },
        package_details_lite: { values: tralbumApiResponsePackageDetailsLiteSchema } as never,
        has_digital_download: { type: 'boolean' },
        num_downloadable_tracks: { type: 'uint32' },
        merch_sold_out: { type: 'boolean', nullable: true },
    }
}

const tralbumApiResponseParser = ajv.compileParser<TralbumApiResponse>(tralbumApiResponseSchema);

const bandPageSiteSchema: JTDSchemaType<BandPageSite> = {
    properties: {
        url: { type: 'string' },
        title: { type: 'string' }
    }
}

const bandPageDiscographySchema: JTDSchemaType<BandPageDiscography> = {
    properties: {
        item_id: { type: 'uint32' },
        item_type: { enum: ['album', 'track'] },
        artist_name: { type: 'string', nullable: true },
        band_name: { type: 'string' },
        title: { type: 'string' },
        art_id: { type: 'uint32' },
        release_date: { type: 'string' },
        is_purchasable: { type: 'boolean' },
        band_id: { type: 'uint32' },
    }
}

const bandPageShowSchema: JTDSchemaType<BandPageShow> = {
    properties:
    {
        loc: { type: 'string' },
        date: { type: 'string' },
        uri: { type: 'string' },
        venue: { type: 'string' },
        utc_date: { type: 'uint32' },
        event_date: { type: 'string' },
    }
}

const bandPageNavbarTitlesSchema: JTDSchemaType<BandPageNavbarTitles> = {
    properties: {
        m: { type: 'string' },
        p: { type: 'string' },
        l: { type: 'string' },
        a: { type: 'string' },
        v: { type: 'string' },
        u: { type: 'string' },
        s: { type: 'string' },
        c: { type: 'string' },
    }
}

const bandPageMerchArtSchema: JTDSchemaType<BandPageMerchArt> = {
    properties: {
        id: { type: 'uint32' },
        file_name: { type: 'string' },
        index: { type: 'uint32' },
        image_id: { type: 'uint32' },
        width: { type: 'uint32' },
        height: { type: 'uint32' },
        crc: { type: 'uint32' },
    }
}


const bandPageMerchSchema: JTDSchemaType<BandPageMerch> = {
    properties: {
        id: { type: 'uint32' },
        type_id: { type: 'uint32' },
        /**
         * Known Types (Non-exhastive):
         * "Vinyl LP" | "2 x Vinyl LP" | "Compact Disc (CD)" | "Vinyl Box Set" | "Other Vinyl" | "Bag" | "Hat" | "T-Shirt/Shirt" | "Other" | "T-Shirt/Apparel" | "Poster/Print"
         */
        type_name: { type: 'string' },
        title: { type: 'string' },
        grid_index: { type: 'uint32' },
        subscriber_only: { type: 'boolean', nullable: true },
        arts: { elements: bandPageMerchArtSchema },
        album_art: { type: 'string', nullable: true },
        download_type: { enum: ["a", "t"], nullable: true },
        download_id: { type: 'uint32' },
        download_title: { type: 'string', nullable: true },
        download_has_audio: { type: 'boolean' },
        band_id: { type: 'uint32' },
        artist_name: { type: 'string', nullable: true },
        in_stock: { type: 'boolean' },
        is_live_ticket: { type: 'boolean' }
    }
}

const bandPageArtistSchema: JTDSchemaType<BandPageArtist> = {
    properties: {
        id: { type: 'uint32' },
        name: { type: 'string' },
        image_id: { type: 'uint32' },
        featured_date: { type: 'uint32' },
        location: { type: 'string' },
    }
}

const bandPageApiResponseSchema: JTDSchemaType<BandPageApiResponse> = {
    properties: {
        id: { type: "uint32" },
        name: { type: "string" },
        bio_image_id: { type: "uint32" },
        bio_image_width: { type: "uint32" },
        bio_image_height: { type: "uint32" },
        bio: { type: "string" },
        bandcamp_url: { type: "string" },
        sites: { elements: bandPageSiteSchema },
        discography: { elements: bandPageDiscographySchema },
        location: { type: "string" },
        /**
         * Always null in testing
         */
        header_image_id: { type: "uint32", nullable: true },
        shows: { elements: bandPageShowSchema },
        navbar_titles: bandPageNavbarTitlesSchema,
        merch: { elements: bandPageMerchSchema },
        /**
         * Only has artists on label pages
         */
        artists: { elements: bandPageArtistSchema }
    }
}

const bandPageApiResponseParser = ajv.compileParser<BandPageApiResponse>(bandPageApiResponseSchema);

const errorApiResponseSchema: JTDSchemaType<BandcampAPIError> = {
    properties: {
        error: {type: 'boolean'},
        error_message: {type: 'string'}
    }
}

const errorApiResponseParser = ajv.compileParser<BandcampAPIError>(errorApiResponseSchema)

type validationTypes = string;

function validateJSON<T>(json: validationTypes, expect = true, parser: JTDParser<T>): T | undefined {
    const data = parser(json);
    if (expect && data === undefined) {
        throw new Error(strings.errors.jsonParsingFailed.withError(parser.message ?? "unknown error", parser.position ?? "unknown position"))
    }
    return data;
}

const validate = {
    searchData: (json: validationTypes, expect?: boolean) => validateJSON(json, expect, searchDataParser),
    searchResult: searchResultParser,
    searchType: (json: validationTypes, expect?: boolean) => validateJSON(json, expect, searchTypeParser),
    bandData: (json: validationTypes, expect?: boolean) => validateJSON(json, expect, bandDataParser),
    clientItems: (json: validationTypes, expect?: boolean) => validateJSON(json, expect, clientItemsParser),
    artistsSelectorPanel: (json: validationTypes, expect?: boolean) => validateJSON(json, expect, labelArtistsSelectorPanelParser),
    emptyBandData: (json: validationTypes, expect?: boolean) => validateJSON(json, expect, emptyBandDataParser),
    releasePageData: (json: validationTypes, expect?: boolean) => validateJSON(json, expect, releasePageDataParser),
    tralbumApiResponse: (json: validationTypes, expect?: boolean) => validateJSON(json, expect, tralbumApiResponseParser),
    bandPageApiResponse: (json: validationTypes, expect?: boolean) => validateJSON(json, expect, bandPageApiResponseParser),
    errorApiResponse: (json: validationTypes, expect?: boolean) => validateJSON(json, expect, errorApiResponseParser),
}

export default validate;