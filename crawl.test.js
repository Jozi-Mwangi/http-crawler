const { normalizeUrl, getUrlsFromHtml } = require("./crawl")
const { test, expect } = require ("@jest/globals")

test("normalizeUrl to strip protocol", ()=>{
    const input = 'https://blog.boot.dev/path'
    const actual = normalizeUrl(input)
    const expected = 'blog.boot.dev/path'
    expect(actual).toEqual(expected)
})

test("normalizeUrl to strip trailing slash", ()=>{
    const input = 'https://blog.boot.dev/path/'
    const actual = normalizeUrl(input)
    const expected = 'blog.boot.dev/path'
    expect(actual).toEqual(expected)
})

test("normalizeUrl capitals", ()=>{
    // URL constructor changes caps to lowercase for us
    const input = 'https://BLOG.boot.dev/path/'
    const actual = normalizeUrl(input)
    const expected = 'blog.boot.dev/path'
    expect(actual).toEqual(expected)
})

test("normalizeUrl to strip http", ()=>{
    const input = 'http://blog.boot.dev/path'
    const actual = normalizeUrl(input)
    const expected = 'blog.boot.dev/path'
    expect(actual).toEqual(expected)
})

test("get URLS from HTML absolute ", ()=>{
    const inputHTMLBody = `
        <html>
            <body>
                <a href="https://blog.boot.dev/path/">
                    Boot.dev Blog
                </a>
            </body>
        </html>
    `
    const inputBaseUrl = 'https://blog.boot.dev/path/'
    const actual = getUrlsFromHtml(inputHTMLBody, inputBaseUrl)
    const expected = ['https://blog.boot.dev/path/']
    expect(actual).toEqual(expected)
})

test("get URLS from HTML relative", ()=>{
    const inputHTMLBody = `
        <html>
            <body>
                <a href="/path/">
                    Boot.dev Blog
                </a>
            </body>
        </html>
    `
    const inputBaseUrl = 'https://blog.boot.dev'
    const actual = getUrlsFromHtml(inputHTMLBody, inputBaseUrl)
    const expected = ['https://blog.boot.dev/path/']
    expect(actual).toEqual(expected)
})

test("get URLS from HTML absolute and relative", ()=>{
    const inputHTMLBody = `
        <html>
            <body>
                <a href="/path1/">
                    Boot.dev Blog Path 1
                </a>
                <a href="https://blog.boot.dev/path2/">
                    Boot.dev Blog Path 2
                </a>
            </body>
        </html>
    `
    const inputBaseUrl = 'https://blog.boot.dev'
    const actual = getUrlsFromHtml(inputHTMLBody, inputBaseUrl)
    const expected = ['https://blog.boot.dev/path1/','https://blog.boot.dev/path2/']
    expect(actual).toEqual(expected)
})

test("get URLS from HTML invalid", ()=>{
    const inputHTMLBody = `
        <html>
            <body>
                <a href="invalid">
                    Invalid
                </a>
            </body>
        </html>
    `
    const inputBaseUrl = 'https://blog.boot.dev'
    const actual = getUrlsFromHtml(inputHTMLBody, inputBaseUrl)
    const expected = []
    expect(actual).toEqual(expected)
})
