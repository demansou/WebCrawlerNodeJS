/**
 * Created by Daniel Mansour on 11/1/2016.
 */

var callbackObj = {
    "id": id,
    "parent": null,
    "title": "Google homepage",
    "url": "http://www.google.com",
    "children":
        [
            "http://array.com",
            "http://of.com",
            "http://links.com",
            "http://to.com",
            "http://add.com",
            "http://to.com",
            "http://queue.com",
            "http://or.com",
            "http://stack.com"
        ]
};

/**
 * Client requests depth crawl
 *
 * @type {{startPage: string, searchType: string, keyword: string, pageLimit: number, depthLimit: number}}
 */
var frontendRequestObj = {
    request: "crawler",
    data: {
        startPage: "http://www.google.com",
        searchType: "depth",
        keyword: "word",
        pageLimit: 10,
        depthLimit: 5
    }
};

// submit via HTTP POST
// server receives POST
// server generates request id

/**
 * Server response to client
 * @type {{id: number, finished: boolean, depth: number, depthLimit: number, msg: string}}
 */
var serverResponseObj = {
    id: 12345,
    finished: false,
    depth: 0,
    depthLimit: 5,
    msg: "working"
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
    finished: false,
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
    finished: false,
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

// NOT SURE WHAT HAPPENS AT THIS POINT
// submit to database?

/**
 * Client automatically checks on status of crawl query
 * @type {{id: number}}
 */
var clientStatusQuery = {
    request: "status",
    data: {
        id: 12345
    }
};

// server sees request status
// server queries database and generates response

/**
 * Server response to client query
 * @type {{id: number, finished: boolean, depth: number, depthLimit: number, msg: string}}
 */
var serverResponseObj = {
    id: 12345,
    finished: false,
    depth: 1,
    depthLimit: 5,
    msg: "working"
};

// at same time, server asynchronously continues crawling

/**
 * Server creates object to start crawler iteration
 * @type {{id: number, finished: boolean, startPage: string, searchType: string, keyword: string, pageLimit: number, depth: number, depthLimit: number}}
 */
var crawlerRequestObject = {
    id: 12345,
    finished: false,
    parent: {
        title: "Google homepage",
        url: "http://www.google.com"
    },
    startPage: "http://www.yahoo.com",
    searchType: "depth",
    keyword: "word",
    pageLimit: 10,
    depth: 1,
    depthLimit: 5
};

// return object

var crawlerCallbackObject = {
    id: 12345,
    finished: false,
    searchType: "depth",
    keyword: "word"
    pageLimit: 10,
    depth: 2,
    depthLimit: 5,
    parent: null,
    title: "Yahoo homepage",
    url: "http://www.yahoo.com",
    children: [
        "http://www.amazon.com"
    ]
};