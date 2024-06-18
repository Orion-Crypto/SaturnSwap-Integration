import { getSwap, setSwap } from '@/hooks/Component/swap.hook';
import { OrderType } from '@/types/Enums/OrderType';
import { SwapType } from '@/types/Enums/SwapType';

// Price Functions
export const calculateMarketPercent = (
    isBuy: boolean,
    buyMarketPrice: number,
    sellMarketPrice: number,
    percentOfBuyMarketPrice: number,
    percentOfSellMarketPrice: number
) => {
    let percentString = '';
    if (buyMarketPrice === 0 || sellMarketPrice === 0) return percentString;

    percentOfBuyMarketPrice = Math.round(percentOfBuyMarketPrice * 100) / 100;
    percentOfSellMarketPrice = Math.round(percentOfSellMarketPrice * 100) / 100;

    if (isBuy && percentOfBuyMarketPrice >= 1000) {
        percentString = '+1000.00% More Expensive Than Market Price';
    } else if (!isBuy && percentOfSellMarketPrice <= -1000) {
        percentString = '+1000.00% More Expensive Than Market Price';
    } else if (isBuy && percentOfBuyMarketPrice <= -1000) {
        percentString = '+1000.00% Cheaper Then Market Price';
    } else if (!isBuy && percentOfSellMarketPrice >= 1000) {
        percentString = '+1000.00% Cheaper Then Market Price';
    }

    // Percent Calculations
    else if (isBuy && percentOfBuyMarketPrice >= 0) {
        percentString = `${percentOfBuyMarketPrice.toFixed(2)}% More Expensive Than Market Price`;
    } else if (!isBuy && percentOfSellMarketPrice < 0) {
        percentOfSellMarketPrice = -percentOfSellMarketPrice;
        percentString = `${percentOfSellMarketPrice.toFixed(2)}% More Expensive Than Market Price`;
    } else if (isBuy && percentOfBuyMarketPrice < 0) {
        percentOfBuyMarketPrice = -percentOfBuyMarketPrice;
        percentString = `${percentOfBuyMarketPrice.toFixed(2)}% Cheaper Than Market Price`;
    } else if (!isBuy && percentOfSellMarketPrice >= 0) {
        percentString = `${percentOfSellMarketPrice.toFixed(2)}% Cheaper Than Market Price`;
    }

    return percentString;
};

// Input Functions
export const UpdateSwapInputs = (
    swapType: any,
    orderType: any,
    tokenProjectOne: any,
    tokenProjectTwo: any,
    buyUtxos: any,
    sellUtxos: any,
    marketPrice: number,
    isTokenSellUpdate: boolean,
    isTokenBuyUpdate: boolean,
    tokenSellPreviouslyUpdated: boolean,
    tokenBuyPreviouslyUpdated: boolean,
    balanceTokenProjectOne: any,
    balanceTokenProjectTwo: any,
    address: any,
    optionalAmountBuy: any = null,
    optionalAmpuntSell: any = null
) => {
    if (swapType === SwapType.Market) {
        UpdateMarketInputs(
            orderType,
            tokenProjectOne,
            tokenProjectTwo,
            buyUtxos,
            sellUtxos,
            isTokenSellUpdate,
            isTokenBuyUpdate,
            tokenSellPreviouslyUpdated,
            tokenBuyPreviouslyUpdated,
            balanceTokenProjectOne,
            balanceTokenProjectTwo,
            address,
            optionalAmountBuy,
            optionalAmpuntSell
        );
    } else if (swapType === SwapType.Limit) {
        UpdateLimitInputs(
            orderType,
            marketPrice,
            tokenProjectOne,
            tokenProjectTwo,
            isTokenSellUpdate,
            isTokenBuyUpdate,
            tokenSellPreviouslyUpdated,
            tokenBuyPreviouslyUpdated,
            balanceTokenProjectOne,
            balanceTokenProjectTwo,
            address,
            optionalAmountBuy,
            optionalAmpuntSell
        );
    }
};

export const InputAutomaticAdaSwapInputs = (
    swapType: any,
    orderType: any,
    tokenProjectOne: any,
    tokenProjectTwo: any,
    buyUtxos: any,
    sellUtxos: any,
    marketPrice: number,
    isTokenSellUpdate: boolean,
    isTokenBuyUpdate: boolean,
    tokenSellPreviouslyUpdated: boolean,
    tokenBuyPreviouslyUpdated: boolean,
    balanceTokenProjectOne: any,
    balanceTokenProjectTwo: any,
    address: any,
    amount: number = 100,
    isPercent: boolean = true
) => {
    let tokenAmountSellElement = null;
    let tokenAmountBuyElement = null;

    if (orderType === OrderType.Buy) {
        //Selling cardano
        //Sell needs to be maxxed
        if (isPercent) {
            tokenAmountSellElement = (balanceTokenProjectOne * (amount / 100)).toString();
        } else {
            tokenAmountSellElement = amount.toString();
        }
    } else {
        //Buying cardano
        //Buy needs to be maxxed
        if (isPercent) {
            tokenAmountBuyElement = (balanceTokenProjectOne * (amount / 100)).toString();
        } else {
            tokenAmountBuyElement = amount.toString();
        }
    }

    UpdateSwapInputs(
        swapType,
        orderType,
        tokenProjectOne,
        tokenProjectTwo,
        buyUtxos,
        sellUtxos,
        marketPrice,
        isTokenSellUpdate,
        isTokenBuyUpdate,
        tokenSellPreviouslyUpdated,
        tokenBuyPreviouslyUpdated,
        balanceTokenProjectOne,
        balanceTokenProjectTwo,
        address,
        tokenAmountBuyElement,
        tokenAmountSellElement
    );
};

export const InputAutomaticTokenSwapInputs = (
    swapType: any,
    orderType: any,
    tokenProjectOne: any,
    tokenProjectTwo: any,
    buyUtxos: any,
    sellUtxos: any,
    marketPrice: number,
    isTokenSellUpdate: boolean,
    isTokenBuyUpdate: boolean,
    tokenSellPreviouslyUpdated: boolean,
    tokenBuyPreviouslyUpdated: boolean,
    balanceTokenProjectOne: any,
    balanceTokenProjectTwo: any,
    address: any,
    amount: number = 100,
    isPercent: boolean = true
) => {
    let tokenAmountBuyElement = null;
    let tokenAmountSellElement = null;
    if (orderType === OrderType.Buy) {
        //Selling token
        //Sell needs to be maxxed

        if (isPercent) {
            tokenAmountBuyElement = (balanceTokenProjectTwo * (amount / 100)).toString();
        } else {
            tokenAmountBuyElement = amount.toString();
        }
    } else {
        //Buying token
        //Buy needs to be maxxed

        if (isPercent) {
            tokenAmountSellElement = (balanceTokenProjectTwo * (amount / 100)).toString();
        } else {
            tokenAmountSellElement = amount.toString();
        }
    }

    UpdateSwapInputs(
        swapType,
        orderType,
        tokenProjectOne,
        tokenProjectTwo,
        buyUtxos,
        sellUtxos,
        marketPrice,
        isTokenSellUpdate,
        isTokenBuyUpdate,
        tokenSellPreviouslyUpdated,
        tokenBuyPreviouslyUpdated,
        balanceTokenProjectOne,
        balanceTokenProjectTwo,
        address,
        tokenAmountBuyElement,
        tokenAmountSellElement
    );
};

export const resetSwapInputs = () => {
    setSwap({
        tokenAmountSell: 0,
        tokenAmountBuy: 0,
        tokenSellUpdated: false,
        tokenBuyUpdated: false,
        tokenSellPreviouslyUpdated: false,
        tokenBuyPreviouslyUpdated: false,
    });
};

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
    let tokenAmountSellValue = optionalAmountSell
        ? optionalAmountSell
        : (document.getElementById('token_amount_sell') as HTMLInputElement)?.value.replace(/,/g, '.');
    let tokenAmountBuyValue = optionalAmountBuy
        ? optionalAmountBuy
        : (document.getElementById('token_amount_buy') as HTMLInputElement)?.value.replace(/,/g, '.');

    let tokenAmountSell = parseFloat(tokenAmountSellValue);
    let tokenAmountBuy = parseFloat(tokenAmountBuyValue);

    tokenAmountSell = tokenAmountSell ? tokenAmountSell : 0;
    tokenAmountBuy = tokenAmountBuy ? tokenAmountBuy : 0;

    let tokenProjectBuy = null;
    let tokenProjectSell = null;
    let balanceBuy = 0;
    let balanceSell = 0;
    let decimalPrecisionSell = 8;
    let decimalPrecisionBuy = 8;

    if (!tokenProjectOne || !tokenProjectTwo) {
        const swap: any = getSwap();
        const newSwap = { ...swap };
        newSwap.isTokenSellUpdate = isTokenSellUpdate;
        newSwap.isTokenBuyUpdate = isTokenBuyUpdate;
        setSwap(newSwap);
        return;
    }

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

    //Now get the current values from the getSwap hook
    let swap: any = getSwap();
    const tokenAmountSellCurrent = parseFloat(swap.tokenAmountSell);
    const tokenAmountBuyCurrent = parseFloat(swap.tokenAmountBuy);

    //Now check which one is different from the current one, that is the one that has been updated
    let isTokenSellChanged = tokenAmountSellCurrent != tokenAmountSell;
    let isTokenBuyChanged = tokenAmountBuyCurrent != tokenAmountBuy;

    tokenAmountSell = floorToPrecision(tokenAmountSell, decimalPrecisionSell);
    tokenAmountBuy = floorToPrecision(tokenAmountBuy, decimalPrecisionBuy);

    //if tokenSellChanged is true, but now they are the same after precisioning, then we can return
    if (isTokenSellChanged && tokenAmountSellCurrent == tokenAmountSell) {
        return;
    }
    //Same for tokenBuy
    if (isTokenBuyChanged && tokenAmountBuyCurrent == tokenAmountBuy) {
        return;
    }

    //If both the current and the new values are the same, then we can return
    if (tokenAmountSell == tokenAmountSellCurrent && tokenAmountBuy == tokenAmountBuyCurrent) {
        return;
    }

    if (isTokenSellUpdate) {
        if (tokenAmountSell > balanceSell && balanceSell) tokenAmountSell = balanceSell;
    }

    let swapTokens: any = { tokenAmountSell: 0, tokenAmountBuy: 0, isTokenBuyUpdate: isTokenBuyUpdate, isTokenSellUpdate: isTokenSellUpdate };
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

    const finalTokenAmountSell = floorToPrecision(swapTokens.tokenAmountSell, decimalPrecisionSell);
    const finalTokenAmountBuy = floorToPrecision(swapTokens.tokenAmountBuy, decimalPrecisionBuy);

    const formattedTokenAmountSell = formatNumberUS(finalTokenAmountSell);
    const formattedTokenAmountBuy = formatNumberUS(finalTokenAmountBuy);

    setSwap({
        tokenAmountSell: formattedTokenAmountSell,
        tokenAmountBuy: formattedTokenAmountBuy,
        isTokenSellUpdate: swapTokens.isTokenSellUpdate,
        isTokenBuyUpdate: swapTokens.isTokenBuyUpdate,
        tokendSellPreviouslyUpdated: tokenSellPreviouslyUpdated,
        tokenBuyPreviouslyUpdated: tokenBuyPreviouslyUpdated,
        isAboveBalance: swapTokens.isAboveBalance,
    });
};

const CalculateBuyMarketOrder = (
    tokenAmountSell: number,
    tokenAmountBuy: number,
    tokenProjectSell: any,
    tokenProjectBuy: any,
    sellUtxos: any,
    isTokenSellUpdate: boolean,
    isTokenBuyUpdate: boolean,
    balanceSell: any,
    address: any
) => {
    if (!tokenProjectSell || !tokenProjectBuy) {
        return { tokenAmountSell: 0, tokenAmountBuy: 0, isTokenBuyUpdate: isTokenBuyUpdate, isTokenSellUpdate: isTokenSellUpdate };
    }

    let uiTokenAmountSell = 0;
    let uiTokenAmountBuy = 0;

    const defaultBalance = address ? 0 : Number.MAX_VALUE;

    const balanceSellPower = balanceSell <= 0 ? defaultBalance : balanceSell * Math.pow(10, tokenProjectSell.decimals);
    let maxAdaAmount = 10000 * Math.pow(10, tokenProjectSell.decimals);

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
            // const maxValues = CalculateMaxBuyMarketOrder(
            //     balanceSell,
            //     Number.MAX_VALUE,
            //     tokenProjectSell,
            //     tokenProjectBuy,
            //     sellUtxos,
            //     true,
            //     false
            // );
            // totalTokenAmountSell = maxValues.tokenAmountSell;
            // totalTokenAmountBuy = maxValues.tokenAmountBuy;
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
            // const maxValues = CalculateMaxBuyMarketOrder(
            //     balanceSell,
            //     Number.MAX_VALUE,
            //     tokenProjectSell,
            //     tokenProjectBuy,
            //     sellUtxos,
            //     true,
            //     false
            // );
            // totalTokenAmountSell = maxValues.tokenAmountSell;
            // totalTokenAmountBuy = maxValues.tokenAmountBuy;
            isAboveBalance = true;
        }

        uiTokenAmountSell = totalTokenAmountSell / Math.pow(10, tokenProjectSell.decimals);
        uiTokenAmountBuy = totalTokenAmountBuy / Math.pow(10, tokenProjectBuy.decimals);
    }

    return {
        tokenAmountSell: uiTokenAmountSell,
        tokenAmountBuy: uiTokenAmountBuy,
        tokenBuyUpdated: isTokenBuyUpdate,
        tokenSellUpdated: isTokenSellUpdate,
        isAboveBalance: isAboveBalance,
    };
};

const CalculateMaxBuyMarketOrder = (
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

const CalculateSellMarketOrder = (
    tokenAmountSell: number,
    tokenAmountBuy: number,
    tokenProjectSell: any,
    tokenProjectBuy: any,
    buyUtxos: any,
    isTokenSellUpdate: boolean,
    isTokenBuyUpdate: boolean,
    balanceSell: any,
    address: any
) => {
    if (!tokenProjectSell || !tokenProjectBuy) {
        return { tokenAmountSell: 0, tokenAmountBuy: 0, isTokenBuyUpdate: isTokenBuyUpdate, tokenSellUpdated: isTokenSellUpdate };
    }

    let uiTokenAmountSell = 0;
    let uiTokenAmountBuy = 0;

    const defaultBalance = address ? 0 : Number.MAX_VALUE;

    const balanceSellPower = balanceSell <= 0 ? defaultBalance : balanceSell * Math.pow(10, tokenProjectSell.decimals);
    let maxAdaAmount = 10000 * Math.pow(10, tokenProjectBuy.decimals);

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
            // const maxValues = CalculateMaxSellMarketOrder(
            //     balanceSell,
            //     Number.MAX_VALUE,
            //     tokenProjectSell,
            //     tokenProjectBuy,
            //     buyUtxos,
            //     true,
            //     false
            // );
            // totalTokenAmountSell = maxValues.tokenAmountSell;
            // totalTokenAmountBuy = maxValues.tokenAmountBuy;
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
            // const maxValues = CalculateMaxSellMarketOrder(
            //     balanceSell,
            //     Number.MAX_VALUE,
            //     tokenProjectSell,
            //     tokenProjectBuy,
            //     buyUtxos,
            //     true,
            //     false
            // );
            // totalTokenAmountSell = maxValues.tokenAmountSell;
            // totalTokenAmountBuy = maxValues.tokenAmountBuy;
            isAboveBalance = true;
        }

        uiTokenAmountSell = totalTokenAmountSell / Math.pow(10, tokenProjectSell.decimals);
        uiTokenAmountBuy = totalTokenAmountBuy / Math.pow(10, tokenProjectBuy.decimals);
    }

    return {
        tokenAmountSell: uiTokenAmountSell,
        tokenAmountBuy: uiTokenAmountBuy,
        tokenBuyUpdated: isTokenBuyUpdate,
        tokenSellUpdated: isTokenSellUpdate,
        isAboveBalance: isAboveBalance,
    };
};

const CalculateMaxSellMarketOrder = (
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

// Limit Order Utilities
const UpdateLimitInputs = (
    orderType: OrderType,
    marketPrice: number,
    tokenProjectOne: any,
    tokenProjectTwo: any,
    isTokenSellUpdate: boolean = false,
    isTokenBuyUpdate: boolean = false,
    tokenSellPreviouslyUpdated: boolean = false,
    tokenBuyPreviouslyUpdated: boolean = false,
    balanceTokenProjectOne: any,
    balanceTokenProjectTwo: any,
    address: any,
    optionalAmountBuy: any = null,
    optionalAmountSell: any = null
) => {
    let tokenAmountSellValue = optionalAmountSell
        ? optionalAmountSell
        : (document.getElementById('token_amount_sell') as HTMLInputElement)?.value.replace(/,/g, '.');
    let tokenAmountBuyValue = optionalAmountBuy
        ? optionalAmountBuy
        : (document.getElementById('token_amount_buy') as HTMLInputElement)?.value.replace(/,/g, '.');

    let tokenAmountSell = parseFloat(tokenAmountSellValue);
    let tokenAmountBuy = parseFloat(tokenAmountBuyValue);

    tokenAmountSell = tokenAmountSell ? tokenAmountSell : 0;
    tokenAmountBuy = tokenAmountBuy ? tokenAmountBuy : 0;

    let tokenProjectBuy = null;
    let tokenProjectSell = null;
    let balanceBuy = 0;
    let balanceSell = 0;
    let decimalPrecisionSell = 8;
    let decimalPrecisionBuy = 8;

    if (!tokenProjectOne || !tokenProjectTwo) {
        const swap: any = getSwap();
        const newSwap = { ...swap };
        newSwap.isTokenSellUpdate = isTokenSellUpdate;
        newSwap.isTokenBuyUpdate = isTokenBuyUpdate;
        setSwap(newSwap);
        return;
    }

    if (orderType === OrderType.Buy) {
        tokenProjectBuy = tokenProjectTwo;
        tokenProjectSell = tokenProjectOne;
        balanceBuy = balanceTokenProjectTwo;
        balanceSell = balanceTokenProjectOne;
        decimalPrecisionBuy = tokenProjectTwo.precision;
        decimalPrecisionSell = tokenProjectOne.precision;
    } else if (orderType === OrderType.Sell) {
        tokenProjectBuy = tokenProjectOne;
        tokenProjectSell = tokenProjectTwo;
        balanceBuy = balanceTokenProjectOne;
        balanceSell = balanceTokenProjectTwo;
        decimalPrecisionBuy = tokenProjectOne.precision;
        decimalPrecisionSell = tokenProjectTwo.precision;
    }

    tokenAmountSell = floorToPrecision(tokenAmountSell, decimalPrecisionSell);
    tokenAmountBuy = floorToPrecision(tokenAmountBuy, decimalPrecisionBuy);

    let isAboveBalance = false;

    if (!balanceSell) balanceSell = address ? 0 : Number.MAX_VALUE;

    if (tokenAmountSell > balanceSell) {
        // tokenAmountSell = balanceSell;
        isAboveBalance = true;
    }

    if (orderType === OrderType.Buy && !isTokenBuyUpdate && marketPrice) {
        if (tokenBuyPreviouslyUpdated == true) {
            tokenAmountBuy = tokenAmountBuy;
        } else {
            tokenAmountBuy = (1.001 * tokenAmountSell) / marketPrice;
        }
    } else if (orderType === OrderType.Buy && !isTokenSellUpdate && marketPrice) {
        if (tokenSellPreviouslyUpdated == true) {
            tokenAmountSell = tokenAmountSell;
        } else {
            tokenAmountSell = 0.999 * tokenAmountBuy * marketPrice;
            if (tokenAmountSell > balanceSell && balanceSell) {
                // tokenAmountSell = balanceSell;
                isAboveBalance = true;
            }
        }
    } else if (orderType === OrderType.Sell && !isTokenBuyUpdate && marketPrice) {
        if (tokenBuyPreviouslyUpdated == true) {
            tokenAmountBuy = tokenAmountBuy;
        } else {
            tokenAmountBuy = (1.001 * tokenAmountSell) / marketPrice;
        }
        tokenAmountBuy = 1.001 * tokenAmountSell * marketPrice;
    } else if (orderType === OrderType.Sell && !isTokenSellUpdate && marketPrice) {
        if (tokenSellPreviouslyUpdated == true) {
            tokenAmountSell = tokenAmountSell;
        } else {
            tokenAmountSell = (0.999 * tokenAmountBuy) / marketPrice;
            if (tokenAmountSell > balanceSell && balanceSell) {
                // tokenAmountSell = balanceSell;
                isAboveBalance = true;
            }
        }
    }

    if (marketPrice === 0 && (!tokenProjectSell || !tokenProjectBuy)) {
        tokenAmountSell = 0;
        tokenAmountBuy = 0;
    }

    // Update Control Logic
    if (tokenAmountSell <= 0 && !!tokenProjectSell) {
        isTokenSellUpdate = false;
    }

    if (tokenAmountBuy <= 0 && !!tokenProjectBuy) {
        isTokenBuyUpdate = false;
    }

    if (orderType === OrderType.Buy) {
        if (isTokenBuyUpdate) {
            tokenBuyPreviouslyUpdated = true;
        } else {
            tokenSellPreviouslyUpdated = true;
        }
    } else if (orderType === OrderType.Sell) {
        if (isTokenSellUpdate) {
            tokenSellPreviouslyUpdated = true;
        } else {
            tokenBuyPreviouslyUpdated = true;
        }
    }

    if (tokenAmountBuy <= 0 && tokenAmountSell <= 0) {
        tokenSellPreviouslyUpdated = false;
        tokenBuyPreviouslyUpdated = false;
    }

    if (tokenAmountSell > balanceSell) {
        // tokenAmountSell = balanceSell;
        isAboveBalance = true;
    }

    const finalTokenAmountSell = floorToPrecision(tokenAmountSell, decimalPrecisionSell);
    const finalTokenAmountBuy = floorToPrecision(tokenAmountBuy, decimalPrecisionBuy);

    const formattedTokenAmountSell = formatNumberUS(finalTokenAmountSell);
    const formattedTokenAmountBuy = formatNumberUS(finalTokenAmountBuy);

    setSwap({
        tokenAmountSell: formattedTokenAmountSell,
        tokenAmountBuy: formattedTokenAmountBuy,
        tokenSellUpdated: isTokenSellUpdate,
        tokenBuyUpdated: isTokenBuyUpdate,
        tokenSellPreviouslyUpdated: tokenSellPreviouslyUpdated,
        tokenBuyPreviouslyUpdated: tokenBuyPreviouslyUpdated,
        isAboveBalance: isAboveBalance,
    });
};
const formatNumberUS = (number: any) => {
    // Determine the number of decimals in the input
    const countDecimals = (num: number) => {
        if (Math.floor(num) === num) return 0;
        return num.toString().split('.')[1].length || 0;
    };

    const decimalCount = countDecimals(number);

    return new Intl.NumberFormat('en-US', {
        useGrouping: false,
        minimumFractionDigits: decimalCount, // Ensure the minimum fraction digits are set to the number's actual decimals
        maximumFractionDigits: decimalCount, // Limit to the actual number of decimals to prevent rounding
    }).format(number);
};

function floorToPrecision(number: any, maxPrecision: any) {
    const numberAsString = number.toString();
    const parts = numberAsString.split('.');
    const existingDecimals = parts.length > 1 ? parts[1].length : 0;

    if (existingDecimals <= maxPrecision) {
        return number; // Return the original number if it has equal or fewer decimals than maxPrecision
    }

    const factor = Math.pow(10, maxPrecision);
    return Math.floor(number * factor) / factor;
}
