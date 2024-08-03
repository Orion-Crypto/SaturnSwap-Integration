import { UpdateSwapInputs } from '@/components/PageComponents/Swap/Utils/SwapUtils/SwapUtils';
import { setSwap } from '@/hooks/Component/swap.hook';
import { OrderType } from '@/types/Enums/OrderType';

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
    isPercent: boolean = true,
    isPriceEntry: any = false
) => {
    let tokenAmountSellElement = null;
    let tokenAmountBuyElement = null;

    if (orderType === OrderType.Buy) {
        if (isPercent) {
            tokenAmountSellElement = (balanceTokenProjectOne * (amount / 100)).toString();
        } else {
            tokenAmountSellElement = amount.toString();
        }
    } else {
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
        tokenAmountSellElement,
        isPriceEntry
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
    isPercent: boolean = true,
    isPriceEntry: any = false
) => {
    let tokenAmountBuyElement = null;
    let tokenAmountSellElement = null;
    if (orderType === OrderType.Buy) {
        // Selling token
        if (isPercent) {
            tokenAmountBuyElement = (balanceTokenProjectTwo * (amount / 100)).toString();
        } else {
            tokenAmountBuyElement = amount.toString();
        }
    } else {
        // Buying token
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
        tokenAmountSellElement,
        isPriceEntry
    );
};

export const ResetSwapInputs = () => {
    setSwap({
        tokenAmountSell: '0',
        tokenAmountBuy: '0',
        tokenSellUpdated: false,
        tokenBuyUpdated: false,
        tokenSellPreviouslyUpdated: false,
        tokenBuyPreviouslyUpdated: false,
    });
};
