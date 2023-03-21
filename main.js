const { crawlPage } = require("./crawl")

async function main () {
    if (process.argv.length < 3) {
        console.log("No website Provided")
        process.exit(1)
    }
    if (process.argv.length > 3) {
        console.log("Too many entries")
        process.exit(1)
    }
    
    const baseUrl = process.argv[2]
    console.log(`Crawler has started on : ${baseUrl}`)
    
    const pages = await crawlPage(baseUrl, baseUrl, {})   
    for (const page of Object.entries(pages)) {
        console.log(page)
    }
}

main()