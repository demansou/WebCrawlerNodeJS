/// <reference path="jquery.d.ts" />
$(document).ready(function () {

    var graph = new CrawlerGraph();

    graph.requestPacket("http://google.com", "breadth", "", 1, 1, function (err, g, packet)
    {
        for (var i = 0; i < packet.children.length; i++)
        {
            console.log(packet.children[i]);
        }
    });
});
//# sourceMappingURL=execute.js.map