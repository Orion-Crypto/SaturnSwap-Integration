import { UpdateLimitInputs } from '@/components/PageComponents/Swap/Utils/SwapUtils/LimitSwapUtils';
import { UpdateMarketInputs } from '@/components/PageComponents/Swap/Utils/SwapUtils/MarketSwapUtils';
import { SwapType } from '@/types/Enums/SwapType';

export interface SwapTokens {
    tokenAmountSell: string;
    tokenAmountBuy: string;
    tokenSellUpdated: boolean;
    tokenBuyUpdated: boolean;
    tokenSellPreviouslyUpdated?: boolean;
    tokenBuyPreviouslyUpdated?: boolean;
    isAboveBalance?: boolean;
    price?: number;
}

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
    optionalAmpuntSell: any = null,
    isPriceEntry: any = false
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
            optionalAmpuntSell,
            isPriceEntry
        );
    }
};
