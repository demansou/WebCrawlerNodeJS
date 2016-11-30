/// <reference path="jquery.d.ts" />
var graph = new CrawlerGraph();
/*
$(document).ready(function () {

    var visited = 0;
    graph.requestPacket("https://amazon.com", "depth", "", 10000, 5, function (err, g, packet)
    {
        if (err)
        {
            console.log(err);
            return;
        }

        visited++;
        console.log("visited: " + visited + " url: " + packet.url + "  count: " + g.map.elementCount);
    });
});
*/
$(document).ready(function () {
      graph.requestPacket("https://www.youtube.com", "breadth","", 500, 500, function (err, g, packet) {
        if(err)
              console.log(err);

        console.log(packet);
    });
});
//# sourceMappingURL=execute.js.map