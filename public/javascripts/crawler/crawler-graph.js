class CrawlerGraph {
    constructor() {
        this.root = null;
        this.map = new Map();
    }
    clear() {
        this.root = null;
        this.map.clear();
    }
    getValue(url) {
        return this.map.getValue(url);
    }
    requestPacket(startPage, searchType, keyword, pageLimit, depthLimit, callback) {
        //User Update No Username
        $.ajax({
            type: "POST",
            url: "localhost:3000/crawl",
            data: {
                startPage: startPage,
                searchType: searchType,
                keyword: keyword,
                pageLimit: pageLimit,
                depthLimit: depthLimit
            },
            success: function (response, status) {
                if (response.success) {
                    this.addPacket(response);
                    callback(null, this, response);
                }
                else {
                    callback(response, this, null);
                }
            }
        });
    }
    addPacket(packet) {
        if (packet.parent == null) {
            this.map.clear();
            this.root = new CrawlerNode(null, packet.title, packet.url);
            this.map.addKeyValue(this.root.url, this.root);
            for (var i = 0, len = packet.children.length; i < len; i++) {
                //Create the node
                var node = new CrawlerNode(this.root, null, packet.children[i]);
                //Update our book keeping
                this.map.addKeyValue(node.url, node);
                this.root.children.push(node);
            }
        }
        else {
            var value = this.map.getValue(packet.url);
            if (value == null) {
                throw "Recieved a packet with a child that doesn't exist in the graph.";
            }
            //We have now visited so we know the title!
            value.title = packet.title;
            //Create the children for the node we didn't have before
            if (packet.children != null) {
                for (var i = 0, len = packet.children.length; i < len; i++) {
                    var node = new CrawlerNode(value, null, packet.children[i]);
                    this.map.addKeyValue(node.url, node);
                    value.children.push(node);
                }
            }
        }
    }
}
//# sourceMappingURL=crawler-graph.js.map