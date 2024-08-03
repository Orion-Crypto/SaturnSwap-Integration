import { SubPrice } from '@/components/Elements/Price';
import { ToolTipWrapper } from '@/components/Elements/Tooltips/ToolTipWrapper';
import clsx from 'clsx';

export const SwapPriceComponent = ({ isBuy, tokenProjectTwo, marketBuyPrice, marketSellPrice, averagePrice, isNike }: any) => {
    const precision = tokenProjectTwo?.precision ?? 4;

    const displayPrice = isBuy ? marketBuyPrice : marketSellPrice;
    const averagePriceString = averagePrice?.toFixed(precision);
    const displayPriceString = displayPrice.toFixed(precision);

    const showDisplayPrice = displayPrice > 0;
    const showAvgPrice = averagePriceString != displayPriceString && averagePrice > 0 && displayPrice > 0;

    const name = tokenProjectTwo?.name;

    const subPrice = SubPrice(displayPrice, precision, '', ' ₳');
    const subAvgPrice = SubPrice(averagePrice, precision, 'Avg: ', ' ₳');

    // Is the average price 2x higher then the display price
    const is2xHigh = averagePrice > displayPrice * 2;
    const is5xHigh = averagePrice > displayPrice * 5;
    const textColor = is5xHigh ? 'text-red-500' : is2xHigh ? 'text-yellow-300' : 'text-zinc-300';
    return (
        <div className={clsx('flex w-full text-xs text-zinc-300', showDisplayPrice && '-my-2')}>
            {showDisplayPrice && (
                <ToolTipWrapper
                    id="base-price"
                    place={'top'}
                    tip={
                        <div className="z-50 flex flex-col items-center justify-center gap-2 p-2 text-sm font-semibold">
                            <div>{`The current best price for ${name}.`}</div>
                            <div>{`This can change after a buy or sell order is placed.`}</div>
                        </div>
                    }
                    isNike={isNike}
                >
                    <>
                        <div className="flex w-full items-center justify-start">
                            <div className="flex items-center">{`1 ${name} =`}&nbsp;</div>
                            <div>{subPrice}</div>
                        </div>
                    </>
                </ToolTipWrapper>
            )}
            <div className="grow"></div>
            {showAvgPrice && (
                <ToolTipWrapper
                    id="avg-price"
                    place={'top'}
                    tip={
                        <div className="z-50 flex flex-col items-center justify-center gap-2 p-2 text-sm font-semibold">
                            <div>{`The average price being paid for 1 ${name} for this order.`}</div>
                            <div>{`This will change the price of ${name} after this order is placed.`}</div>
                            {is2xHigh && !is5xHigh && (
                                <div className="text-yellow-300">The average price is 2x higher than the current price.</div>
                            )}
                            {is5xHigh && <div className="text-red-500">The average price is 5x higher than the current price.</div>}
                        </div>
                    }
                    isNike={isNike}
                >
                    <div className={clsx('flex w-full items-center justify-start', textColor)}>
                        <div>{subAvgPrice}</div>
                    </div>
                </ToolTipWrapper>
            )}
        </div>
    );
};
