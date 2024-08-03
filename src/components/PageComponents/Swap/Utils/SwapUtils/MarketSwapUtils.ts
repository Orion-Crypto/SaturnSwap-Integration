import { CalculateMaxBuyMarketOrder, CalculateMaxSellMarketOrder } from '@/components/PageComponents/Swap/Utils/SwapUtils/MaxSwapUtils';
import { SwapTokens } from '@/components/PageComponents/Swap/Utils/SwapUtils/SwapUtils';
import { getSwap, setSwap } from '@/hooks/Component/swap.hook';
import { OrderType } from '@/types/Enums/OrderType';
import { SwapType } from '@/types/Enums/SwapType';
import { cleanStringNumber, convertStringToNumber, formatCommaValue } from '@/utils/number';

// Market Order Utilities
export const UpdateMarketInputs = (
    orderType: OrderType,
    tokenProjectOne: any,
    tokenProjectTwo: any,
    buyUtxos: any,
    sellUtxos: any,
    isTokenSellUpdate: boolean,
    isTokenBuyUpdate: boolean,
    tokenSellPreviouslyUpdated: boolean = false,
    tokenBuyPreviouslyUpdated: boolean = false,
    balanceTokenOne: any,
    balanceTokenTwo: any,
    address: any,
    optionalAmountBuy: any = null,
    optionalAmountSell: any = null
) => {
    let swap: SwapTokens = getSwap();

    // If token project is not available, return
    if (!tokenProjectOne || !tokenProjectTwo) {
        const newSwap = { ...swap, tokenSellUpdated: isTokenSellUpdate, tokenBuyUpdated: isTokenBuyUpdate };
        setSwap(newSwap);
        return;
    }

    let tokenAmountSellValue = optionalAmountSell
        ? optionalAmountSell
        : (document.getElementById('token_amount_sell') as HTMLInputElement)?.value;
    let tokenAmountBuyValue = optionalAmountBuy ? optionalAmountBuy : (document.getElementById('token_amount_buy') as HTMLInputElement)?.value;

    // Parse token amounts
    const tokenAmountSellCurrent = convertStringToNumber(swap.tokenAmountSell);
    const tokenAmountBuyCurrent = convertStringToNumber(swap.tokenAmountBuy);
    let tokenAmountSell = convertStringToNumber(tokenAmountSellValue);
    let tokenAmountBuy = convertStringToNumber(tokenAmountBuyValue);
    tokenAmountSell = tokenAmountSell ? tokenAmountSell : 0;
    tokenAmountBuy = tokenAmountBuy ? tokenAmountBuy : 0;

    // Now check which one is different from the current one, that is the one that has been updated
    let isTokenSellChanged = tokenAmountSellCurrent != tokenAmountSell;
    let isTokenBuyChanged = tokenAmountBuyCurrent != tokenAmountBuy;

    // If buy / sell has not changed, return. This handles the decimal case
    const isSellCurrent = isTokenSellChanged && tokenAmountSellCurrent == tokenAmountSell;
    const isBuyCurrent = isTokenBuyChanged && tokenAmountBuyCurrent == tokenAmountBuy;
    const isSellBuySame = tokenAmountSell == tokenAmountSellCurrent && tokenAmountBuy == tokenAmountBuyCurrent;
    if (isSellCurrent || isBuyCurrent || isSellBuySame) {
        const newSwap = {
            tokenAmountSell: cleanStringNumber(tokenAmountSellValue),
            tokenAmountBuy: cleanStringNumber(tokenAmountBuyValue),
            tokenSellUpdated: isTokenSellUpdate,
            tokenBuyUpdated: isTokenBuyUpdate,
            price: swap.price,
        };
        setSwap(newSwap);
        return;
    }

    // Set Data and start the calculations
    let tokenProjectBuy = null;
    let tokenProjectSell = null;
    let balanceBuy = 0;
    let balanceSell = 0;
    let decimalPrecisionSell = 8;
    let decimalPrecisionBuy = 8;
    if (orderType === OrderType.Buy) {
        tokenProjectBuy = tokenProjectTwo;
        tokenProjectSell = tokenProjectOne;
        balanceBuy = balanceTokenTwo;
        balanceSell = balanceTokenOne;
        decimalPrecisionBuy = tokenProjectTwo.precision;
        decimalPrecisionSell = tokenProjectOne.precision;
    } else if (orderType === OrderType.Sell) {
        tokenProjectBuy = tokenProjectOne;
        tokenProjectSell = tokenProjectTwo;
        balanceBuy = balanceTokenOne;
        balanceSell = balanceTokenTwo;
        decimalPrecisionBuy = tokenProjectOne.precision;
        decimalPrecisionSell = tokenProjectTwo.precision;
    }

    if (isTokenSellUpdate && tokenAmountSell > balanceSell && balanceSell) {
        tokenAmountSell = balanceSell;
    }

    let swapTokens: SwapTokens = {
        tokenAmountSell: '0',
        tokenAmountBuy: '0',
        tokenSellUpdated: isTokenSellUpdate,
        tokenBuyUpdated: isTokenBuyUpdate,
        price: 0,
    };
    if (orderType === OrderType.Buy) {
        swapTokens = CalculateBuyMarketOrder(
            tokenAmountSell,
            tokenAmountBuy,
            tokenProjectSell,
            tokenProjectBuy,
            sellUtxos,
            isTokenSellUpdate,
            isTokenBuyUpdate,
            balanceSell,
            address
        );
    } else if (orderType === OrderType.Sell) {
        swapTokens = CalculateSellMarketOrder(
            tokenAmountSell,
            tokenAmountBuy,
            tokenProjectSell,
            tokenProjectBuy,
            buyUtxos,
            isTokenSellUpdate,
            isTokenBuyUpdate,
            balanceSell,
            address
        );
    }

    // Update Control Logic
    if (tokenAmountSell <= 0 && !!tokenProjectSell) {
        isTokenSellUpdate = false;
    }

    if (tokenAmountBuy <= 0 && !!tokenProjectBuy) {
        isTokenBuyUpdate = false;
    }

    setSwap({
        tokenAmountSell: swapTokens.tokenAmountSell,
        tokenAmountBuy: swapTokens.tokenAmountBuy,
        tokenSellUpdated: swapTokens.tokenSellUpdated,
        tokenBuyUpdated: swapTokens.tokenBuyUpdated,
        tokenSellPreviouslyUpdated: tokenSellPreviouslyUpdated,
        tokenBuyPreviouslyUpdated: tokenBuyPreviouslyUpdated,
        price: swap.price,
        isAboveBalance: swapTokens.isAboveBalance,
    });
};

export const CalculateBuyMarketOrder = (
    tokenAmountSell: number,
    tokenAmountBuy: number,
    tokenProjectSell: any,
    tokenProjectBuy: any,
    sellUtxos: any,
    isTokenSellUpdate: boolean,
    isTokenBuyUpdate: boolean,
    balanceSell: any,
    address: any
): SwapTokens => {
    if (!tokenProjectSell || !tokenProjectBuy) {
        return { tokenAmountSell: '0', tokenAmountBuy: '0', tokenSellUpdated: isTokenSellUpdate, tokenBuyUpdated: isTokenBuyUpdate };
    }

    let uiTokenAmountSell = 0;
    let uiTokenAmountBuy = 0;

    // Set Balance and Max Values
    const defaultBalance = address ? 0 : Number.MAX_VALUE;
    const balanceSellPower = balanceSell <= 0 ? defaultBalance : balanceSell * Math.pow(10, tokenProjectSell.decimals);
    let maxAdaAmount = 25000 * Math.pow(10, tokenProjectSell.decimals);
    let isAboveBalance = false;

    if (isTokenSellUpdate) {
        const inputTokenAmountSell = tokenAmountSell * Math.pow(10, tokenProjectSell.decimals);
        let remainingTokenAmountSell = inputTokenAmountSell;

        let totalTokenAmountSell = 0;
        let totalTokenAmountBuy = 0;
        for (const utxo of sellUtxos) {
            if (remainingTokenAmountSell - utxo.token_amount_buy <= 0) {
                //Runs this if there's more than enough in the utxo amount bucket to cover the sell amount
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

        // Determine if we are selling more then the max amount of Ada
        if (totalTokenAmountSell > maxAdaAmount) {
            const balanceMaxAdaAmount = maxAdaAmount / Math.pow(10, tokenProjectSell.decimals);

            const maxValues = CalculateMaxBuyMarketOrder(
                balanceMaxAdaAmount,
                Number.MAX_VALUE,
                tokenProjectSell,
                tokenProjectBuy,
                sellUtxos,
                true,
                false
            );
            totalTokenAmountSell = maxValues.tokenAmountSell;
            totalTokenAmountBuy = maxValues.tokenAmountBuy;
        }

        // Deteremine if the Buy Market Order is above the balance of the user
        if (totalTokenAmountSell > balanceSellPower) {
            isAboveBalance = true;
        }

        uiTokenAmountSell = totalTokenAmountSell / Math.pow(10, tokenProjectSell.decimals);
        uiTokenAmountBuy = totalTokenAmountBuy / Math.pow(10, tokenProjectBuy.decimals);
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

        // Determine if we are buying more then the max amount of Ada
        if (totalTokenAmountSell > maxAdaAmount) {
            const balanceMaxAdaAmount = maxAdaAmount / Math.pow(10, tokenProjectBuy.decimals);
            const maxValues = CalculateMaxBuyMarketOrder(
                balanceMaxAdaAmount,
                Number.MAX_VALUE,
                tokenProjectSell,
                tokenProjectBuy,
                sellUtxos,
                true,
                false
            );

            totalTokenAmountSell = maxValues.tokenAmountSell;
            totalTokenAmountBuy = maxValues.tokenAmountBuy;
        }

        if (totalTokenAmountSell > balanceSellPower) {
            isAboveBalance = true;
        }

        uiTokenAmountSell = totalTokenAmountSell / Math.pow(10, tokenProjectSell.decimals);
        uiTokenAmountBuy = totalTokenAmountBuy / Math.pow(10, tokenProjectBuy.decimals);
    }

    const formattedTokenAmountSell = formatCommaValue(uiTokenAmountSell, 0, 6);
    const formattedTokenAmountBuy = formatCommaValue(uiTokenAmountBuy, 0, 6);
    return {
        tokenAmountSell: formattedTokenAmountSell,
        tokenAmountBuy: formattedTokenAmountBuy,
        tokenBuyUpdated: isTokenBuyUpdate,
        tokenSellUpdated: isTokenSellUpdate,
        isAboveBalance: isAboveBalance,
    };
};

export const CalculateSellMarketOrder = (
    tokenAmountSell: number,
    tokenAmountBuy: number,
    tokenProjectSell: any,
    tokenProjectBuy: any,
    buyUtxos: any,
    isTokenSellUpdate: boolean,
    isTokenBuyUpdate: boolean,
    balanceSell: any,
    address: any
): SwapTokens => {
    if (!tokenProjectSell || !tokenProjectBuy) {
        return { tokenAmountSell: '0', tokenAmountBuy: '0', tokenSellUpdated: isTokenSellUpdate, tokenBuyUpdated: isTokenBuyUpdate };
    }

    let uiTokenAmountSell = 0;
    let uiTokenAmountBuy = 0;

    // Set Balance and Max Values
    const defaultBalance = address ? 0 : Number.MAX_VALUE;
    const balanceSellPower = balanceSell <= 0 ? defaultBalance : balanceSell * Math.pow(10, tokenProjectSell.decimals);
    let maxAdaAmount = 25000 * Math.pow(10, tokenProjectBuy.decimals);
    let isAboveBalance = false;

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

        // Determine if we are buying more then the max amount of Ada
        if (totalTokenAmountBuy > maxAdaAmount) {
            const balanceMaxAdaAmount = maxAdaAmount / Math.pow(10, tokenProjectSell.decimals);
            const maxValues = CalculateMaxSellMarketOrder(
                Number.MAX_VALUE,
                balanceMaxAdaAmount,
                tokenProjectSell,
                tokenProjectBuy,
                buyUtxos,
                false,
                true
            );
            totalTokenAmountSell = maxValues.tokenAmountSell;
            totalTokenAmountBuy = maxValues.tokenAmountBuy;
        }

        // Deteremine if the Sell Market Order is above the balance of the user
        if (totalTokenAmountSell > balanceSellPower) {
            isAboveBalance = true;
        }

        uiTokenAmountSell = totalTokenAmountSell / Math.pow(10, tokenProjectSell.decimals);
        uiTokenAmountBuy = totalTokenAmountBuy / Math.pow(10, tokenProjectBuy.decimals);
    } else if (isTokenSellUpdate) {
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

        // Determine if we are buying more then the max amount of Ada
        if (totalTokenAmountBuy > maxAdaAmount) {
            const balanceMaxAdaAmount = maxAdaAmount / Math.pow(10, tokenProjectSell.decimals);
            const maxValues = CalculateMaxSellMarketOrder(
                Number.MAX_VALUE,
                balanceMaxAdaAmount,
                tokenProjectSell,
                tokenProjectBuy,
                buyUtxos,
                false,
                true
            );
            totalTokenAmountSell = maxValues.tokenAmountSell;
            totalTokenAmountBuy = maxValues.tokenAmountBuy;
        }

        if (totalTokenAmountSell > balanceSellPower) {
            isAboveBalance = true;
        }

        uiTokenAmountSell = totalTokenAmountSell / Math.pow(10, tokenProjectSell.decimals);
        uiTokenAmountBuy = totalTokenAmountBuy / Math.pow(10, tokenProjectBuy.decimals);
    }

    const formattedTokenAmountSell = formatCommaValue(uiTokenAmountSell, 0, 6);
    const formattedTokenAmountBuy = formatCommaValue(uiTokenAmountBuy, 0, 6);

    return {
        tokenAmountSell: formattedTokenAmountSell,
        tokenAmountBuy: formattedTokenAmountBuy,
        tokenBuyUpdated: isTokenBuyUpdate,
        tokenSellUpdated: isTokenSellUpdate,
        isAboveBalance: isAboveBalance,
    };
};
