class CrawlerGraph
{
    root: CrawlerNode;
    map: Map<CrawlerNode>;
    id: string;
    domain: string;

    constructor()
    {
        this.root = null;
        this.map = new Map<CrawlerNode>();
        this.id = null;
        this.domain = "http://localhost:3000/crawl";
    }

    clear()
    {
        this.id = null;
        this.root = null;
        this.map.clear();
    }

    getValue(url: string)
    {
        return this.map.getValue(url);
    }

    requestPacketById(callback)
    {
        var g = this;
        //User Update No Username
        $.ajax({
            type: "POST",
            url: this.domain,
            data: {
               id: this.id
            },
            success: function (response, status) {
               
                if (response.success)
                {
                    if (response.data !== null)
                    {
                        g.addPacket(response.data);
                        callback(null, g, response.data);
                        g.requestPacketById(callback);
                    }
                    else
                    {
                        this.id = null;
                    }
                }
                else
                {
                    callback(response, g, null);
                }
            }
        });
    }

    requestPacket(startPage,searchType,keyword,pageLimit,depthLimit, callback)
    {
        var g = this;
        //User Update No Username
        $.ajax({
            type: "POST",
            url: this.domain,
            data: {
                startPage: startPage,
                searchType: searchType,
                keyword: keyword,
                pageLimit: pageLimit,
                depthLimit: depthLimit
            },
            success: function (response, status) {
               
                if (response.success)
                {
                    if (response.data !== null)
                    {
                        g.id = response.data.id;
                        g.addPacket(response.data);
                        callback(null, g, response.data);
                        g.requestPacketById(callback);
                    }
                    else
                    {
                        this.id = null;
                    }
                }
                else
                {
                    callback(response, g, null);
                }
            }
        });
    }

    addPacket(packet: CrawlerPacket)
    {
        if (packet.parent == null)
        {
            this.map.clear();
            this.root = new CrawlerNode(null, packet.title, packet.url);

            this.map.addKeyValue(this.root.url, this.root);
            for (var i = 0, len = packet.children.length; i < len; i++)
            {
                //Create the node
                var node = new CrawlerNode(this.root, null, packet.children[i]);

                //Update our book keeping
                this.map.addKeyValue(node.url,node);
                this.root.children.push(node);
            }
        }
        else
        {
            var value = this.map.getValue(packet.url);
       
            if (value == null)
            {
                throw { message: "Recieved a packet with a child that doesn't exist in the graph." };
            }

            //We have now visited so we know the title!
            value.title = packet.title;

            //Create the children for the node we didn't have before
            if (packet.children != null)
            {
                for (var i = 0, len = packet.children.length; i < len; i++)
                {
                    var node = this.getValue(packet.children[i]);

                    if(node == null)
                    {
                        node = new CrawlerNode(value, null, packet.children[i]);
                        this.map.addKeyValue(node.url, node);
                    }

                    value.children.push(node);
                }
            }
        }
    }


}