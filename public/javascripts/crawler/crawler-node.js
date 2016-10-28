var CrawlerNode = (function () {
    function CrawlerNode(parent, title, url) {
        this.parent = parent;
        this.title = title;
        this.url = url;
        this.children = [];
    }
    return CrawlerNode;
}());
//# sourceMappingURL=crawler-node.js.map