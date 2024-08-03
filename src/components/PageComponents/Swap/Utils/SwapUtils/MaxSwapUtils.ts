export const CalculateMaxBuyMarketOrder = (
    tokenAmountSell: number,
    tokenAmountBuy: number,
    tokenProjectSell: any,
    tokenProjectBuy: any,
    sellUtxos: any,
    isTokenSellUpdate: boolean,
    isTokenBuyUpdate: boolean
) => {
    let uiTokenAmountSell = 0;
    let uiTokenAmountBuy = 0;

    if (isTokenSellUpdate) {
        const inputTokenAmountSell = tokenAmountSell * Math.pow(10, tokenProjectSell.decimals);
        let remainingTokenAmountSell = inputTokenAmountSell;

        let totalTokenAmountSell = 0;
        let totalTokenAmountBuy = 0;
        for (const utxo of sellUtxos) {
            if (remainingTokenAmountSell - utxo.token_amount_buy <= 0) {
                const finalTokenAmountBuy =
                    (remainingTokenAmountSell / utxo.price) *
                    (Math.pow(10, tokenProjectBuy.decimals) / Math.pow(10, tokenProjectSell.decimals));

                totalTokenAmountSell += remainingTokenAmountSell;
                totalTokenAmountBuy += finalTokenAmountBuy;
                break;
            }

            remainingTokenAmountSell -= utxo.token_amount_buy;
            totalTokenAmountSell += utxo.token_amount_buy; // Limit Sell Utxos have buy tokens that we are selling
            totalTokenAmountBuy += utxo.token_amount_sell; // Limit Sell Utxos have sell tokens that we are buying
        }
        uiTokenAmountSell = totalTokenAmountSell;
        uiTokenAmountBuy = totalTokenAmountBuy;
    } else if (isTokenBuyUpdate) {
        const inputTokenAmountBuy = tokenAmountBuy * Math.pow(10, tokenProjectBuy.decimals);
        let remainingTokenAmountBuy = inputTokenAmountBuy;

        let totalTokenAmountSell = 0;
        let totalTokenAmountBuy = 0;
        for (const utxo of sellUtxos) {
            if (remainingTokenAmountBuy - utxo.token_amount_sell <= 0) {
                const finalTokenAmountSell =
                    remainingTokenAmountBuy * utxo.price * (Math.pow(10, tokenProjectSell.decimals) / Math.pow(10, tokenProjectBuy.decimals));

                totalTokenAmountSell += finalTokenAmountSell;
                totalTokenAmountBuy += remainingTokenAmountBuy;
                break;
            }

            remainingTokenAmountBuy -= utxo.token_amount_sell;
            totalTokenAmountSell += utxo.token_amount_buy; // Limit Sell Utxos have buy tokens that we are selling
            totalTokenAmountBuy += utxo.token_amount_sell; // Limit Sell Utxos have sell tokens that we are buying
        }

        uiTokenAmountSell = totalTokenAmountSell;
        uiTokenAmountBuy = totalTokenAmountBuy;
    }

    return {
        tokenAmountSell: uiTokenAmountSell,
        tokenAmountBuy: uiTokenAmountBuy,
        tokenBuyUpdated: isTokenBuyUpdate,
        tokenSellUpdated: isTokenSellUpdate,
    };
};

export const CalculateMaxSellMarketOrder = (
    tokenAmountSell: number,
    tokenAmountBuy: number,
    tokenProjectSell: any,
    tokenProjectBuy: any,
    buyUtxos: any,
    isTokenSellUpdate: boolean,
    isTokenBuyUpdate: boolean
) => {
    let uiTokenAmountSell = 0;
    let uiTokenAmountBuy = 0;
    if (isTokenBuyUpdate) {
        const inputTokenAmountBuy = tokenAmountBuy * Math.pow(10, tokenProjectBuy.decimals);
        let remainingTokenAmountBuy = inputTokenAmountBuy;

        let totalTokenAmountSell = 0;
        let totalTokenAmountBuy = 0;
        for (const utxo of buyUtxos) {
            if (remainingTokenAmountBuy - utxo.token_amount_sell <= 0) {
                const finalTokenAmountSell =
                    (remainingTokenAmountBuy / utxo.price) * (Math.pow(10, tokenProjectSell.decimals) / Math.pow(10, tokenProjectBuy.decimals));

                totalTokenAmountSell += finalTokenAmountSell;
                totalTokenAmountBuy += remainingTokenAmountBuy;
                break;
            }

            remainingTokenAmountBuy -= utxo.token_amount_sell;
            totalTokenAmountSell += utxo.token_amount_buy; // Limit Buy Utxos have buy tokens that we are selling
            totalTokenAmountBuy += utxo.token_amount_sell; // Limit Buy Utxos have sell tokens that we are buying
        }

        uiTokenAmountSell = totalTokenAmountSell;
        uiTokenAmountBuy = totalTokenAmountBuy;
    } else {
        const inputTokenAmountSell = tokenAmountSell * Math.pow(10, tokenProjectSell.decimals);
        let remainingTokenAmountSell = inputTokenAmountSell;

        let totalTokenAmountSell = 0;
        let totalTokenAmountBuy = 0;
        for (const utxo of buyUtxos) {
            if (remainingTokenAmountSell - utxo.token_amount_buy <= 0) {
                const finalTokenAmountBuy =
                    remainingTokenAmountSell * utxo.price * (Math.pow(10, tokenProjectBuy.decimals) / Math.pow(10, tokenProjectSell.decimals));

                totalTokenAmountSell += remainingTokenAmountSell;
                totalTokenAmountBuy += finalTokenAmountBuy;
                break;
            }

            remainingTokenAmountSell -= utxo.token_amount_buy;
            totalTokenAmountSell += utxo.token_amount_buy; // Limit Buy Utxos have buy tokens that we are selling
            totalTokenAmountBuy += utxo.token_amount_sell; // Limit Buy Utxos have sell tokens that we are buying
        }

        uiTokenAmountSell = totalTokenAmountSell;
        uiTokenAmountBuy = totalTokenAmountBuy;
    }

    return {
        tokenAmountSell: uiTokenAmountSell,
        tokenAmountBuy: uiTokenAmountBuy,
        tokenBuyUpdated: isTokenBuyUpdate,
        tokenSellUpdated: isTokenSellUpdate,
    };
};
