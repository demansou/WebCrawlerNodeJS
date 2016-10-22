/// <reference path="jquery.d.ts" />
$(document).ready(function () {
    $.getJSON("/example_json/fake-data.json", function (data) {
        console.log(data);
        var graph = new CrawlerGraph();
        for (var i = 0, len = data.packets.length; i < len; i++) {
            graph.addPacket(data.packets[i]);
        }
        //Breadth First Seach Printing
        var queue = [{ offset: 0, node: graph.root }];
        while (queue.length > 0) {
            var n = queue.shift();
            for (var i = 0, len = n.node.children.length; i < len; i++) {
                queue.push({ offset: n.offset + 1, node: n.node.children[i] });
            }
            var indent = "";
            var baseindent = "****";
            for (var i = 0; i < n.offset; i++) {
                indent = indent + baseindent;
            }
            console.log(indent + n.node.url);
        }
    });
});
//# sourceMappingURL=execute.js.map