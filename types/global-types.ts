export interface BandcampConfig {
    /**
     * Cookie to use for bandcamp requests; Should contain `client_id=`
     *
     * Ideally, this should include an intentifier for your application
     */
    cookie: string, 
    /**
     * User Agent to use for bandcamp requests; Should contain `Firefox/` or `AppleWebKit/`
     *
     * Ideally, this should include a name and contact information for your application
     */
    userAgent: string
}