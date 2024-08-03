import { InfoTip } from '@/components/Elements/Tooltips/InfoTip';
import {
    InputAutomaticAdaSwapInputs,
    InputAutomaticTokenSwapInputs,
} from '@/components/PageComponents/Swap/Utils/SwapUtils/AutomaticSwapUtilts';
import { getSwap, setSwap } from '@/hooks/Component/swap.hook';
import clsx from 'clsx';

export const LimitInfoBox = ({
    swap,
    address,
    isBuy,
    limitSellPrice,
    limitBuyPrice,
    marketSellPrice,
    marketBuyPrice,
    percentString,
    precision = 4,
    isNike = false,
    swapType,
    orderType,
    tokenProjectOne,
    tokenProjectTwo,
    flattenedBuyPoolUtxos,
    flattenedSellPoolUtxos,
    marketPrice,
    tokenSellPreviouslyUpdated,
    tokenBuyPreviouslyUpdated,
    balanceTokenProjectOne,
    balanceTokenProjectTwo,
}: any) => {
    const initialInputValue =
        !!swap.price || swap.price === ''
            ? swap.price.toString()
            : isBuy
              ? limitBuyPrice.toFixed(precision)
              : limitSellPrice.toFixed(precision);

    const changeLimitPrice = (e: any) => {
        const positiveValue = e.target.value.replace(/-/g, ''); // Remove any "-" characters

        const newSwap = { ...swap, price: positiveValue };
        setSwap(newSwap);

        const newLimitPrice = parseFloat(positiveValue);
        if (!isNaN(newLimitPrice)) {
            const precision = isBuy ? tokenProjectTwo.precision : tokenProjectOne.precision;
            const numberTokenAmountSell = parseFloat(swap.tokenAmountSell.replace(/,/g, ''));
            const newBuyAmount = numberTokenAmountSell * newLimitPrice;
            const newBuyAmountFixed = parseFloat(newBuyAmount.toFixed(precision));
            InputAutomaticAdaSwapInputs(
                swapType,
                orderType,
                tokenProjectOne,
                tokenProjectTwo,
                flattenedBuyPoolUtxos,
                flattenedSellPoolUtxos,
                marketPrice,
                isBuy ? false : true,
                isBuy ? true : false,
                tokenSellPreviouslyUpdated,
                tokenBuyPreviouslyUpdated,
                balanceTokenProjectOne,
                balanceTokenProjectTwo,
                address,
                newBuyAmountFixed,
                false,
                true
            );
        } else {
            const swap: any = getSwap();
            const newSwap = { ...swap };
            setSwap(newSwap);
        }
    };

    return (
        <>
            <div
                className={clsx(
                    'flex w-full grow flex-col rounded-xl border ',
                    isNike ? 'border-nike-orange-600/60 bg-nike-orange-700 hover:border-nike-orange-500/60' : 'border-sky-600/60 bg-space-700'
                )}
            >
                <div className="flex flex-col gap-4 p-4">
                    <div className="flex w-full">
                        <div className="text-sm font-semibold">Limit Price</div>
                        <div className="grow"></div>
                        <div className="flex items-center">
                            <input
                                type="number"
                                className={clsx(
                                    'mx-1 h-6 w-24 rounded-md border-2  text-center text-sm font-semibold',
                                    isNike
                                        ? 'border-nike-orange-600/60 bg-nike-orange-700 focus:border-0 focus:ring-nike-orange-500'
                                        : 'border-sky-600/60 bg-space-600 text-sky-200'
                                )}
                                value={!isNaN(initialInputValue) ? initialInputValue || '' : ''}
                                onChange={changeLimitPrice}
                                step="0.0001"
                            />
                            <div className={clsx('text-sm font-semibold', isNike ? '' : 'text-sky-200')}>₳ per 1 Token</div>
                        </div>
                    </div>
                    <div className="flex w-full">
                        <div className="text-sm font-semibold">Market Price</div>
                        <div className="grow"></div>
                        <div className={clsx('text-sm font-semibold ', isNike ? '' : 'text-sky-200')}>
                            {`${isBuy ? marketBuyPrice?.toFixed(precision) : marketSellPrice?.toFixed(precision)} ₳ per 1 Token`}
                        </div>
                    </div>
                </div>
                <div className={clsx('flex h-full w-full items-center border-t px-4', isNike ? 'border-nike-orange-600' : 'border-sky-600/60')}>
                    <div className="flex items-center sm:gap-2">
                        <div className="text-xs">Limit Order?</div>
                        <div className="mr-8 pl-4 sm:mr-0 sm:pl-0">
                            <InfoTip id="limit-info-tool-tip" place="top" isNike={isNike}>
                                <div className={clsx('z-50 flex h-28 w-72 flex-col sm:w-96', isNike ? '' : 'text-sky-100')}>
                                    {isNike ? (
                                        <div>Limit Orders on Nike Swap will stay on the order book until they are taken.</div>
                                    ) : (
                                        <div>Limit Orders on Saturn Swap will stay on the order book until they are taken.</div>
                                    )}
                                    <div className="grow"></div>
                                    <div>
                                        Limit orders, instead of costing a fee, are awarded 60% of the dex fee when the limit order is taken.
                                    </div>
                                </div>
                            </InfoTip>
                        </div>
                    </div>
                    <div className="grow"></div>
                    <div className={clsx('text-xs ', isNike ? '' : 'text-sky-200')}>{percentString}</div>
                </div>
            </div>
        </>
    );
};
