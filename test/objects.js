/**
 * Client requests depth crawl
 *
 * @type {{startPage: string, searchType: string, keyword: string, pageLimit: number, depthLimit: number}}
 */
var frontendRequestObj = {
    startPage: "http://www.google.com",
    searchType: "depth",
    keyword: "word",
    pageLimit: 10,
    depthLimit: 5
};

// submit via HTTP POST
// server receives POST
// server generates request id

/**
 * Server response to client
 * @type {{id: number, finished: boolean, depth: number, depthLimit: number, msg: string}}
 */
var serverResponseObj = {
    success: true,
    message: "crawl initiated",
    data: {
        id: 12345,
        startPage: "http://www.google.com",
        searchType: "depth",
        keyword: "word",
        pageLimit: 10,
        depthLimit: 5
    }
};

// server sends response object
// begins client request loop
// server sends client request object to crawler
// crawler generates crawler object

/**
 * Server creates object to start crawler iteration
 * @type {{id: number, finished: boolean, startPage: string, searchType: string, keyword: string, pageLimit: number, depth: number, depthLimit: number}}
 */
var crawlerRequestObject = {
    id: 12345,
    parent: null,
    startPage: "http://www.google.com",
    searchType: "depth",
    keyword: "word",
    pageLimit: 10,
    depth: 0,
    depthLimit: 5
};

// crawler runs once
// depth crawler function on `http://www.google.com`
// increment `depth`
// no errors so generate callback object

/**
 * Crawler returns object in this format for use by server
 * @type {{id: number, finished: boolean, searchType: string, keyword: string, pageLimit: number, depth: number, depthLimit: number, parent: null, title: string, url: string, children: string[]}}
 */
var crawlerCallbackObject = {
    id: 12345,
    searchType: "depth",
    keyword: "word",
    pageLimit: 10,
    depth: 1,
    depthLimit: 5,
    parent: null,
    title: "Google homepage",
    url: "http://www.google.com",
    children: [
        "http://www.yahoo.com"
    ]
};

// callback object gets pushed to graph object (hashed)
// graph object is stored in memory
// generated id is key where object is stored for 300000ms (5 minutes)
// timeout is reset every time depth level updated

var query = require('memory-cache');
var graphObj = new crawlerFrontend.CrawlerGraph();
graphObj.addPacket(crawlerCallbackObject);
query.put(crawlerCallbackObject.id, graphObj, 300000);

// NEED CLIENT QUERY AND SERVER RESPONSE WITH DATA


var newReturnObject = {
    id: "string",
    parent: "url",
    title: "string",
    url: "url",
    depth: 0, // or other integer
    children: [
        "url",
        "url",
        "url"
    ],
    keywordFound: true // or false
};

var responseObj = {
    success: true, // or false
    message: "string",
    data: newReturnObject
};