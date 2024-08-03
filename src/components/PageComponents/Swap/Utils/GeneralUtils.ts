export const flattenPoolUtxosPages = (poolUtxosPages: any) => {
    if (!poolUtxosPages) return [];

    let nodeList = [];
    if (poolUtxosPages && poolUtxosPages.pages) {
        for (let page of poolUtxosPages.pages) {
            if (page && page.edges) {
                for (let edge of page.edges) {
                    nodeList.push(edge.node);
                }
            }
        }
    }

    return nodeList;
};
