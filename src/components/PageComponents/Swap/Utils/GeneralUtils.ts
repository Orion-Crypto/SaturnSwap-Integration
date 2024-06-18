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

export const handleKeyDown = (event: KeyboardEvent, inputValue?: string) => {
    // List of key codes for 'e', 'E', '+', '-'
    const forbiddenKeys = ['e', 'E', '+', '-'];

    if (forbiddenKeys.includes(event.key)) {
        event.preventDefault(); // Prevent these keys from being processed
    } else if ((event.key === '.' || event.key === ',') && inputValue) {
        // Check if the input already contains a decimal point or comma
        if (inputValue.includes('.') || inputValue.includes(',')) {
            event.preventDefault(); // Prevent another decimal point or comma if one already exists
        }
    }
};
