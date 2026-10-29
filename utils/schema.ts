import Ajv, { type JTDDataType, type JTDParser } from "ajv/dist/jtd.js"
import type { JTDSchemaType } from "ajv/dist/core.js"
import type { BandcampSearchResult } from "../types/parsed-types.js"
import strings from "./strings.js"
import type { BandcampReleasePageData, bandClientItems, bandData, emptyBandData, labelArtistsSelectorPanelData, searchData, searchItemDisplayType, searchItemType } from "../types/bandcamp/html-types.js"
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

const releasePageDataSchema: JTDSchemaType<BandcampReleasePageData> = {
    discriminator: "item_type",
    mapping: {
        'album': {
            properties: {
                "for the curious": { type: 'string' },
                preorder_count: { type: 'uint32', nullable: true },
                hasAudio: { type: 'boolean' },
                art_id: { type: 'uint32' },
                packages: {
                    elements: {
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
                            price: { type: 'uint32' },
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
                    },
                    nullable: true
                },
                defaultPrice: { type: 'uint32' },
                freeDownloadPage: { type: 'string', nullable: true },
                FREE: { type: 'uint32' },
                PAID: { type: 'uint32' },
                artist: { type: 'string' },
                id: { type: 'uint32' },
                last_subscription_item: {} as never,
                has_discounts: { type: 'boolean' },
                is_bonus: { type: 'boolean', nullable: true },
                play_cap_data: {
                    properties: {
                        streaming_limits_enabled: { type: 'boolean' };
                        streaming_limit: { type: 'number' }
                    },
                    nullable: true
                },
                is_purchased: { type: 'boolean' },
                items_purchased: {
                    properties: {
                        packages: {
                            properties: {}
                        },
                        bundles: {
                            properties: {}
                        },
                        crowdfunding_campaign: {
                            properties: {}
                        }
                    }
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
                playing_from: { enum: ["album page"] },
                url: { type: 'string' },
                trackinfo: {
                    elements: {
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
                            is_downloadable: {} as never,
                            has_free_download: { type: 'boolean', nullable: true },
                            duration: { type: 'uint32' },
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
                },
                current: {
                    properties: {
                        audit: {type: 'uint32'}
                    }
                }
            }
        },
        'track': {
            properties: {

            }
        }
    }
}


type validationTypes = string

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
}

export default validate;