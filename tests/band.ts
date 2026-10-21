import { Bandcamp } from "../index.js";

let bcApi = new Bandcamp({
    cookie: 'client_id=bandcamp-metadata-test-client',
    userAgent: '(Test client) https://github.com/Lioncat6/bandcamp-metadata'
})

const results = await bcApi.getBand('https://1985-music.bandcamp.com/')

console.log(JSON.stringify(results))
