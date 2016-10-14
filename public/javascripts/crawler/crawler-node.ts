class CrawlerNode
{
    parent: CrawlerNode;
    url: string;
    title: string;
    children: Array<CrawlerNode>;

    constructor(parent: CrawlerNode, title: string, url: string)
    {
        this.parent = parent;
        this.title = title;
        this.url = url;
        this.children = [];
    }
}