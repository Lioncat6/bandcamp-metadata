import { Bandcamp } from "../index.js";
import fs from "fs"
let bcApi = new Bandcamp({
    cookie: 'client_id=bandcamp-metadata-test-client',
    userAgent: 'Firefox/ (Test client) https://github.com/Lioncat6/bandcamp-metadata'
})

const results = await bcApi.api.getRelease(2112526559, "t")

// fs.writeFile('./bandout.json', JSON.stringify(results), () => {})

console.log(JSON.stringify(results))
 