import { Bandcamp } from "../index.js";

let bcApi = new Bandcamp({
    cookie: 'client_id=bandcamp-metadata-test-client',
    userAgent: '(Test client) https://github.com/Lioncat6/bandcamp-metadata'
})

const results = await bcApi.search('jamie paige', 1)

console.log(JSON.stringify(results))