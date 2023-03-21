const { JSDOM } = require("jsdom")


async function crawlPage (baseUrl,currentUrl, pages) {
    
    const baseURLObj = new URL(baseUrl)
    const currentURLObj = new URL (currentUrl)
    
    // Checking that the domain names are the same.
    if (baseURLObj.hostname !== currentURLObj.hostname){
        return pages
    }
    
    // This function checks if we have already crawled a URL
    // If i have already crawled this URL, increase the count in the pages object
    const normalizedCurrentUrl = normalizeUrl(currentUrl)
    if (pages[normalizedCurrentUrl] > 0) {
        pages[normalizedCurrentUrl]++
        return pages
    }
    
    pages[normalizedCurrentUrl] = 1
    console.log(`Actively crawling ${currentUrl}`)

    try {
        const resp = await fetch(currentUrl)
    
        if (resp.status > 399) {
            console.log(`Error with status code : ${resp.status} on page: ${currentUrl}`)
            return pages
        }    

        const contentType = resp.headers.get("content-type")
        if (!contentType.includes("text/html")) {
            console.log(`Non-html with content type of: ${contentType}, on page: ${currentUrl}`)
            return pages
        }

        const htmlBody = await resp.text()
        const nextURLs = getUrlsFromHtml(htmlBody, baseUrl)
        
        for (const nextURL of nextURLs) {
            pages = await crawlPage(baseUrl, nextURL, pages)
        }

    } catch(err){
        console.log(`Failed due to this Error : ${err.message} on page: ${currentUrl} `)
    }
    return pages
}

function getUrlsFromHtml (htmlBody, baseUrl) {
    const urls = []
    const dom = new JSDOM(htmlBody)
    const linklements = dom.window.document.querySelectorAll("a")
    for ( const linkElement of linklements){
        if (linkElement.href.slice(0, 1) === "/"){
            //relative URL
            // urls.push(`${baseUrl}${linkElement.href}`)
            try {
                const urlObj = new URL(`${baseUrl}${linkElement.href}`)
                urls.push(urlObj.href)
            } catch (error) {
                console.log(`Error with relative URL: ${error.message}`)
            }    
        } else {
            //An absolute URL
            try {
                const urlObj = new URL(`${linkElement.href}`)
                urls.push(urlObj.href)
            } catch (error) {
                console.log(`Error with absolute URL: ${error.message}`)
            }
        }
    }
    return urls
}


function normalizeUrl (urlString) {
    const urlObj = new URL(urlString)
    const hostPath = `${urlObj.hostname}${urlObj.pathname}`

    if (hostPath.length > 0 && hostPath.slice(-1) === "/") {
        return hostPath.slice(0, -1)
    }
    return hostPath
} 

module.exports = {
    normalizeUrl,
    getUrlsFromHtml,
    crawlPage
}