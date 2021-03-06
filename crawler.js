﻿var parser = require('url');
var HashSet = require('hashset');
var request = require('request');
var cheerio = require('cheerio');
var cache = require('memory-cache');

var Timeout = 1200000;
var MaxPages = 10000;
var MaxDepth = 32;

/**
 * Shuffles array in place.
 * @param {Array} a items The array containing the items.
 */
function shuffle(a)
{
    var j, x, i;
    for (i = a.length; i; i--)
    {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}

/**
 * function sends http request to designated url and if
 * successful response (200), uses Cheerio JS to load the
 * DOM object into memory and filters anchor elements from
 * the DOM tree
 *
 * @param url
 * @param keyword
 * @param callback
 */
function crawlUrl(url, keyword, callback) {
    request(url, function (err, res, html) {
        if (err)
        {
            callback(err);
        }
        else if (res.statusCode !== 200)
        {
            var responseErr = "Error: HTTP Response " + res.statusCode;
            callback(responseErr);
        }
        else {
            var $ = cheerio.load(html);
            var title = $("title").text();
            var children = $("html > body a");
            var htmlBodyText = $("html > body").text();

            var callbackObj = {
                title: title,
                url: url,
                children: [],
                keywordFound: containsText(htmlBodyText, keyword)
            };

            for (var i = 0; i < children.length; i++)
            {
                callbackObj.children.push(children[i].attribs.href);
            }

            shuffle(callbackObj.children);

            callback(null, callbackObj);
        }
    })
}

/**
 * function returns true if anchor href attribute is:
 * defined, not a `mailto` link, not a `javascript` link,
 * not a relative link, not a hash link, and not a file
 * unless it's a HTML file
 * function returns false if it meets any of those criteria
 *
 * @param child
 * @returns {boolean}
 */
function isValidChild(child) {
    if (child != undefined) {
        // filters out mailto links
        if (child.startsWith("mailto:")) {
            return false;
        }
        // filters out javascript links
        if (child.startsWith("javascript:")) {
            return false;
        }
        // filters out tel links
        if (child.startsWith("tel:")) {
            return false;
        }
        // filters out hash links
        if (child.startsWith("#"))
        {
            return false;
        }
        /*
        // filters out truncated links from certain CMS schemes
        if (child.search("...") !== -1) {
            return false;
        }
        */
        // filters out files unless it's an HTML file
        // other files have no possible links
        // must be placed after other filters so that it doesn't catch local urls
        if (parser.parse(child).pathname !== undefined && parser.parse(child).pathname !== null) {
            if (parser.parse(child).pathname.search(".") !== -1) {
                if (parser.parse(child).pathname.lastIndexOf(".") > 0) {
                    if (!parser.parse(child).pathname.substr(parser.parse(child).pathname.lastIndexOf(".") + 1).startsWith("html")) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    return false;
}

/**
 * Function takes an anchor href attribute value
 * and determines if is relative url. child
 * undefined check happens in isValidChild
 * @param child
 * @returns {boolean}
 */
function isRelativeUrl(child) {
    if (child != undefined) {
        /* Special cases where links begin with `/` */
        if (child.startsWith("/")) {
            if (/\/\//.test(child)) {
                return false;
            }
        }
        /* Most cases where links don't begin with `/` */
        if (!child.startsWith("/")) {
            return false;
        }
        return true;
    }
    return false;
}

/**
 * Function takes page html body text and
 * searches for keyword. if keyword is found,
 * returns true, else returns false.
 *
 * var htmlBodyText = $('html > body').text();
 *
 * @param htmlBodyText
 * @param keyword
 * @returns {boolean}
 */
function containsText(htmlBodyText, keyword) {
    if (keyword.length <= 0) {
        return false;
    }
    if (htmlBodyText.search(keyword) === -1) {
        return false;
    }
    return true;
}

/**
 * Converts a url to a valid format for the crawler
 * @param domain
 * @param url
 */
function convertURL(domain,url)
{
    if (!isValidChild(url))
        return null;

    //Remove query items
    url = url.split('?')[0];

    if (isRelativeUrl(url))
        return domain + url;

    return url;
}

/**
 * function returns a randomized string of length 16 containing
 * upper- and lower- alpha & num
 * 62^16 possible permutations
 *
 * @returns {string}
 */
function generateId()
{
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var idLength = 16;
    var id = "";
    for (var i = 0; i < idLength; i++) {
        id += characters[Math.floor(Math.random() * characters.length)];
    }
    return id;
}

/**
 * Create a crawl instance and return an associated id
 * @param startPage
 * @param searchType
 * @param keyword
 * @param pageLimit
 * @param depthLimit
 */
function CreateCrawlInstance(startPage, searchType, keyword, pageLimit, depthLimit)
{
    var instance = {
        id: generateId(),
        searchType: searchType,
        keyword: keyword,
        pageLimit: pageLimit,
        depthLimit: depthLimit,
        map: new HashSet(),
        queue: [{ depth: 0, parent: null, url: startPage }],
        results: []
    };

    instance.map.add(startPage);

    if (instance.depthLimit == null || instance.depthLimit > MaxDepth)
        instance.depthLimit = MaxDepth;

    if (instance.pageLimit == null || instance.pageLimit > MaxPages)
        instance.pageLimit = MaxPages;

    cache.put(instance.id, instance, Timeout);

    return instance.id;
}

/**
 * Get the next stage of the crawl
 * @param id
 * @param callback
 */
function IncrementCrawl(id,callback)
{
    var instance = cache.get(id);

    if (instance == null)
    {
        callback({ success: false, message: "Crawler is finished or does not exist.", data: null}, null);
        return;
    }

    if (instance.queue.length == 0)
    {
        cache.del(id);
        callback(null,{success: true, message: "Crawler is finished.", data: null });
        return;   
    }


    var page = null;
    if (instance.searchType === "breadth")
        page = instance.queue.shift();
    else
        page = instance.queue.pop();

    crawlUrl(page.url, instance.keyword, function (err, result) {

        if (err || result == null)
        {
            IncrementCrawl(id, callback);
            return;
        }

        var urlParse = parser.parse(page.url);
        var domain = urlParse.protocol + "//" + urlParse.hostname;
        var localSet = new HashSet();


        for (var i = 0; i < result.children.length; i++)
        {
            //Attempt to convert a url to a valid format
            var url = convertURL(domain, result.children[i]);

            //URL is invalid remove from possible results
            if (url == null || localSet.contains(url))
            {
                result.children.splice(i, 1); //Invalid url delete it from the results
                i--;
                continue;
            }

            //Set the child to the valid url format
            result.children[i] = url;
            localSet.add(url);

            //We stop adding to the crawler once we have reached one of our limits
            if (page.depth < instance.depthLimit && instance.map.length < instance.pageLimit) {
                if (instance.map.contains(url))
                    continue;

                //Add the new value to the queue/stack and add it to the map of already known sites
                instance.map.add(url);

                // If keyword found, no need to add to instance queue since queue will be cleared
                if(result.keywordFound === false)
                    instance.queue.push({depth: page.depth + 1, parent: page.url, url: url});
            }

        }

        result.parent = page.parent;
        result.depth = page.depth;

        // If keyword found, clear queue. Next request will return end of crawl.
        if (result.keywordFound === true)
            instance.queue = [];
       
        //Refresh the cache
        cache.put(id, instance, Timeout);

        result.id = id;
        //Send back to the data transfer layer
        callback(null, { success: true, message: "Page found.", data: result });
    });
}

/**
 * Delete the crawl
 * @param id
 */
function EndCrawl(id)
{
    cache.del(id);
}

module.exports.CreateCrawlInstance = CreateCrawlInstance;
module.exports.IncrementCrawl = IncrementCrawl;
module.exports.EndCrawl = EndCrawl;