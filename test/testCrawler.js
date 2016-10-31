/**
 * Created by Daniel Mansour on 10/29/2016.
 */

var crawler = require('../crawler.js');

/*
test basic breadth search initializer
 */

var requestObj1 = {
    id: null,
    parent: null,
    startPage: "http://reddit.com",
    searchType: "breadth",
    keyword: "keyword",
    pageLimit: 5,
    depthLimit: 5
};

crawler.crawlerTool(requestObj1, function(err, callbackObj){
    if (err) {
        console.log(err);
    }
    else {
        console.log(callbackObj);
    }
});

/*
test basic depth search initializer
 */

var requestObj2 = {
    id: null,
    parent: null,
    startPage: "http://reddit.com",
    searchType: "depth",
    keyword: "keyword",
    pageLimit: 5,
    depthLimit: 5
};

crawler.crawlerTool(requestObj2, function(err, callbackObj){
    if (err) {
        console.log(err);
    }
    else {
        console.log(callbackObj);
    }
});

/*
test basic first level breadth search
 */

var requestObj3 = {
    id: "abc123",
    parent: {
        title: "Google test",
        url: "http://google.com"
    },
    startPage: "http://reddit.com",
    searchType: "breadth",
    keyword: "betterKeyword",
    pageLimit: 5,
    depthLimit: 2
};

crawler.crawlerTool(requestObj3, function(err, callbackObj){
    if (err) {
        console.log(err);
    }
    else {
        console.log(callbackObj);
    }
});

/*
test basic first level depth search
 */

var requestObj4 = {
    id: "crazystring",
    parent: {
        title: "Google test",
        url: "http://google.com"
    },
    startPage: "http://reddit.com",
    searchType: "depth",
    keyword: "betterKeyword",
    pageLimit: 5,
    depthLimit: 2
};

crawler.crawlerTool(requestObj4, function(err, callbackObj){
    if (err) {
        console.log(err);
    }
    else {
        console.log(callbackObj);
    }
});

/*
test for `http://www.google.com` error - Lisa frontend 10/30/2016
 */

var requestObj5 = {
    id: "testerror1",
    parent: null,
    startPage: "http://www.google.com/",
    searchType: "breadth",
    keyword: "a_keyword",
    pageLimit: 10,
    depthLimit: 5
};

crawler.crawlerTool(requestObj5, function(err, callbackObj){
    if (err) {
        console.log(err);
    }
    else {
        console.log(callbackObj);
    }
});