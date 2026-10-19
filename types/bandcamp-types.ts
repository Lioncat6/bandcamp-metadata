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