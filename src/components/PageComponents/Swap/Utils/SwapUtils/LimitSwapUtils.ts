import { SwapTokens } from '@/components/PageComponents/Swap/Utils/SwapUtils/SwapUtils';
import { getSwap, setSwap } from '@/hooks/Component/swap.hook';
import { OrderType } from '@/types/Enums/OrderType';
import { cleanStringNumber, convertStringToNumber, formatCommaValue } from '@/utils/number';

// Limit Order Utilities
export const UpdateLimitInputs = (
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
    optionalAmountSell: any = null,
    isPriceEntry: any = false
) => {
    const swap: SwapTokens = getSwap();

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

    let tokenProjectBuy = null;
    let tokenProjectSell = null;
    let balanceBuy = 0;
    let balanceSell = 0;
    let decimalPrecisionSell = 6;
    let decimalPrecisionBuy = 6;
    let price = marketPrice;
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

    // Calculate Balance Values
    let isAboveBalance = false;
    if (!balanceSell) balanceSell = address ? 0 : Number.MAX_VALUE;
    if (tokenAmountSell > balanceSell) {
        isAboveBalance = true;
    }

    if (orderType === OrderType.Buy && !isTokenBuyUpdate && marketPrice) {
        if (tokenBuyPreviouslyUpdated == true) {
            tokenAmountBuy = tokenAmountBuy;
        } else {
            tokenAmountBuy = (1.001 * tokenAmountSell) / marketPrice;
        }
    } else if (orderType === OrderType.Buy && !isTokenSellUpdate && marketPrice) {
        if (tokenSellPreviouslyUpdated == true || isPriceEntry) {
            tokenAmountSell = tokenAmountSell;
        } else {
            tokenAmountSell = 0.999 * tokenAmountBuy * marketPrice;
            if (tokenAmountSell > balanceSell && balanceSell) {
                isAboveBalance = true;
            }
        }

        price = tokenAmountSell / tokenAmountBuy;
    } else if (orderType === OrderType.Sell && !isTokenBuyUpdate && marketPrice) {
        if (tokenBuyPreviouslyUpdated == true || isPriceEntry) {
            tokenAmountBuy = tokenAmountBuy;
        } else {
            tokenAmountBuy = 1.001 * tokenAmountSell * marketPrice;
        }
    } else if (orderType === OrderType.Sell && !isTokenSellUpdate && marketPrice) {
        if (tokenSellPreviouslyUpdated == true) {
            tokenAmountSell = tokenAmountSell;
        } else {
            tokenAmountSell = (0.999 * tokenAmountBuy) / marketPrice;
            if (tokenAmountSell > balanceSell && balanceSell) {
                isAboveBalance = true;
            }
        }
        price = tokenAmountBuy / tokenAmountSell;
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
        isAboveBalance = true;
    }

    const formattedTokenAmountSell = formatCommaValue(tokenAmountSell, 0, 6);
    const formattedTokenAmountBuy = formatCommaValue(tokenAmountBuy, 0, 6);
    setSwap({
        tokenAmountSell: formattedTokenAmountSell,
        tokenAmountBuy: formattedTokenAmountBuy,
        tokenSellUpdated: isTokenSellUpdate,
        tokenBuyUpdated: isTokenBuyUpdate,
        tokenSellPreviouslyUpdated: tokenSellPreviouslyUpdated,
        tokenBuyPreviouslyUpdated: tokenBuyPreviouslyUpdated,
        isAboveBalance: isAboveBalance,
        price: isPriceEntry ? swap.price : price,
    });
};

// Price Functions
export const CalculateMarketPercent = (
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
