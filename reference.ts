// Bandcamp Types
// https://transform.tools/json-to-typescript is really helpful
export type BandcampSearchResults = BandcampSearchResult[]
export interface BandcampSearchResult {
	type: "artist" | "album" | "track" | "label" | "fan"
	name: string
	url: string
	imageUrl: string
	tags: string[]
	genre?: string
	location?: string
	releaseDate?: string
	numTracks?: number
	numMinutes?: number
	artist?: string
	album?: string
}

export interface BandcampArtistPageRoot {
	type: string
	name: string
	url: string
	imageUrl: string
	tags: string[]
	genre: string
	location: string
	raw: BandcampArtistPageRaw | BandcampArtistPageDisabledRaw
	bannerImage: string
}

export interface BandcampArtistPageRaw {
	id: number
	create_date: string
	disabled_date: unknown
	name: string
	subdomain: string
	url: string
	https_url: string
	local_url: string
	https_local_url: string
	url_hints: {
		subdomain: string
		custom_domain: unknown
		custom_domain_verified: unknown
	}
	header_desktop?: {
		url: unknown
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
		using_map?: number
		area_tags?: Array<{
			shape: string
			coords: string
			href: string
			alt: string
			target: unknown
			title: string
		}>
	}
	header_phone: unknown
	design: {
		bg_color: string
		text_color: string
		secondary_text_color: string
		link_color: string
		body_color: string
		hd_ft_color: string
		navbar_bg_color: string
		invert_iconography?: number
		tile_bg?: number
		bg_halign?: string
		bg_image_id?: number
		bg_file_name?: string
		defaultbg: boolean
		bg_fixed?: number
		bg_behavior?: string
	}
	currency: string
	fan_email: unknown
	thanks_enabled: number
	reviews_enabled: number
	is_label: boolean
	has_label: boolean
	paypal_matching_label_id?: number
	merch_enabled: boolean
	google_analytics_id?: string
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
		nav_type: unknown
	}>
	navbar_items: Array<{
		url: string
		title: string
		nav_type: string
	}>
	navbar_hide: boolean
	navbar_hide_community: boolean
	has_items_for_sale: boolean
	public_video_ct?: number
	private_video_ct: unknown
	playback_limits: {
		streaming_limits_enabled: boolean
		streaming_limit: number
	}
	genre_id: number
	meets_buy_full_discography_criteria: boolean
	buy_full_discography_banner_dismissed?: number
	is_dsa_trader: boolean
}

/**
 * If the artist only has a single track / release or have manually disabled their homepage, this is the only raw data that can be pulled
 */
export interface BandcampArtistPageDisabledRaw {
	id: number
	name: string
	fan_email: any
	account_id: number
	facebook_like_enabled: number
	has_discounts: boolean
	image_id: number
}

// Album Page
export interface BandcampAlbumPageRoot {
  tags: BandcampTag[]
  artist: string
  title: string
  imageUrl: string
  tracks: BandcampTrack[]
  raw: BandcampAlbumPageRaw
  pageData: unknown
  url: string
}

export interface BandcampTag {
  name: string
}

export interface BandcampTrack {
  name: string
  url?: string
  duration?: string
}

export interface BandcampAlbumPageRaw {
  "for the curious": string
  current: BandcampAlbumPageCurrent
  preorder_count: any
  hasAudio: boolean
  art_id: number
  packages?: BandcampAlbumPackage[]
  defaultPrice: number
  freeDownloadPage: any
  FREE: number
  PAID: number
  artist: string
  item_type: string
  id: number
  last_subscription_item: any
  has_discounts: boolean
  is_bonus: any
  play_cap_data?: BandcampPlayCapData
  is_purchased: any
  items_purchased: any
  is_private_stream: any
  is_band_member: any
  licensed_version_ids: any
  package_associated_license_id: any
  has_video: any
  tralbum_subscriber_only?: boolean
  album_is_preorder?: boolean
  album_release_date?: string
  trackinfo: BandcampTrackinfo[]
  playing_from: string
  album_url: any
  album_upsell_url: any
  url: string
  featured_track_id?: number
  initial_track_num: any
  is_preorder?: boolean
  use_expando_lyrics?: boolean
}

export interface BandcampAlbumPageCurrent {
  audit: number
  title: string
  new_date: string
  mod_date: string
  publish_date: string
  private: any
  killed: any
  download_pref: number
  require_email: any
  is_set_price: any
  set_price: number
  minimum_price: number
  minimum_price_nonzero: number
  require_email_0: any
  artist?: string
  about: string
  credits: string
  auto_repriced: any
  new_desc_format: number
  band_id: number
  selling_band_id: number
  art_id: number
  download_desc_id: any
  track_number: any
  release_date: string
  file_name: any
  lyrics?: string
  album_id: any
  encodings_id?: number
  pending_encodings_id: any
  license_type?: number
  isrc: any
  preorder_download: any
  streaming?: number
  id: number
  type: string
  upc: any
  purchase_url: any
  purchase_title: any
  featured_track_id?: number
}

export interface BandcampAlbumPackage {
  id: number
  url: string
  url_for_app: string
  type_id: number
  type_name: string
  title: string
  description: string
  desc_pt1: string
  desc_pt2: any
  new_desc_format: number
  grid_index: number
  private: any
  subscriber_only: any
  price: number
  is_set_price: any
  is_live_ticket: any
  live_event_over: any
  live_event_id: any
  live_event_title: any
  live_event_url: any
  live_event_gcal_url: any
  live_event_ical_url: any
  live_event_replays_enabled: any
  live_event_image_color_one: any
  live_event_image_color_two: any
  sku: string
  upc: any
  band_id: number
  selling_band_id: number
  label: any
  currency: string
  country: any
  tax_rate: any
  options_title: any
  options: any
  origins: Origin[]
  arts: Art[]
  album_art: any
  album_art_id: number
  shipping_exception_mode: any
  download_type: string
  download_id: number
  download_is_preorder: number
  download_release_date: string
  download_title: string
  download_url: string
  download_has_audio: boolean
  download_track_count: number
  download_art_id: number
  download_artist: string
  fulfillment_days: number
  release_date: string
  new_date: string
  edition_size: any
  quantity_sold: any
  quantity_available: number
  quantity_limits: number
  quantity_warning: boolean
  album_id: number
  album_title: string
  album_artist: any
  album_private: any
  album_publish_date: string
  album_release_date: string
  subscriber_only_published: boolean
  featured_date: any
  certified_seller: number
  limited_checkout: boolean
  associated_license_id: any
  live_event_scheduled_start_date: any
  live_event_scheduled_end_date: any
  live_event_start_date: any
  live_event_end_date: any
  live_event_timezone: any
  live_event_type: any
  listening_party_duration: any
  is_cardable: boolean
}

export interface Origin {
  id: number
  quantity: any
  quantity_sold: any
  quantity_available: number
  package_id: number
  option_id: number
}

export interface Art {
  id: number
  file_name: string
  index: number
  image_id: number
  width: number
  height: number
  crc: number
}

export interface BandcampPlayCapData {
  streaming_limits_enabled: boolean
  streaming_limit: number
}

export interface BandcampTrackinfo {
  id?: number
  track_id: number
  file?: BandcampTrackFile
  artist?: string
  title: string
  encodings_id: number
  license_type: number
  private: any
  track_num?: number
  album_preorder: boolean
  unreleased_track: boolean
  title_link?: string
  has_lyrics?: boolean
  has_info: boolean
  streaming: number
  is_downloadable?: boolean
  has_free_download: any
  free_album_download: boolean
  duration: number
  lyrics?: string
  sizeof_lyrics: number
  is_draft: boolean
  video_source_type: any
  video_source_id: any
  video_mobile_url: any
  video_poster_url: any
  video_id: any
  video_caption: any
  video_featured: any
  alt_link: any
  encoding_error: any
  encoding_pending: any
  play_count?: number
  is_capped?: boolean
  track_license_id: any
}

export interface BandcampTrackFile {
  "mp3-128": string
}

// End Bandcamp Types
