/// <reference path="jquery.d.ts" />
$(document).ready(function () {

    var graph = new CrawlerGraph();
    var visited = 0;
    graph.requestPacket("http://amazon.com", "breadth", "", 10000, 5, function (err, g, packet)
    {
        if (err)
        {
            console.log(err);
            return;
        }

        visited++;
        console.log("visited: " + visited + " url: " + packet.url + "  count: " + g.map.elementCount);
        /*
        for (var i = 0; i < packet.children.length; i++)
        {
            console.log(packet.children[i]);
        }
        */
    });
});
//# sourceMappingURL=execute.js.map