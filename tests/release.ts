import { Bandcamp } from "../index.js";
import fs from "fs"
let bcApi = new Bandcamp({
    cookie: 'client_id=bandcamp-metadata-test-client',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0'
})

const results = await bcApi.getRelease('https://jamiepaige.bandcamp.com/album/constant-companions-deluxe-edition')

// fs.writeFile('./bandout.json', JSON.stringify(results), () => {})

console.log(JSON.stringify(results))
