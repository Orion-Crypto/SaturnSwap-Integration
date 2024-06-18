import { InfoTip } from '@/components/Elements/Tooltips/InfoTip';

export const LimitInfoBox = ({ isBuy, limitSellPrice, limitBuyPrice, marketSellPrice, marketBuyPrice, percentString, precision = 4 }: any) => {
    if (Number.isNaN(limitSellPrice)) limitSellPrice = 0;
    if (Number.isNaN(limitBuyPrice)) limitBuyPrice = 0;
    return (
        <>
            <div className="flex w-full grow flex-col rounded-xl border border-sky-600/60 bg-space-700">
                <div className="flex flex-col gap-4 p-4">
                    <div className="flex w-full">
                        <div className="text-sm font-semibold">Limit Price</div>
                        <div className="grow"></div>
                        <div className="text-sm font-semibold text-sky-200">
                            {`${
                                isBuy
                                    ? limitBuyPrice === Infinity
                                        ? '0.0000'
                                        : limitBuyPrice.toFixed(precision)
                                    : limitSellPrice === Infinity
                                      ? '0.0000'
                                      : limitSellPrice.toFixed(precision)
                            } ₳ per 1 Token`}
                        </div>
                    </div>
                    <div className="flex w-full">
                        <div className="text-sm font-semibold">Market Price</div>
                        <div className="grow"></div>
                        <div className="text-sm font-semibold text-sky-200">
                            {`${isBuy ? marketBuyPrice?.toFixed(precision) : marketSellPrice?.toFixed(precision)} ₳ per 1 Token`}
                        </div>
                    </div>
                </div>
                <div className="flex h-full w-full items-center border-t border-sky-600/60 px-4">
                    <div className="flex items-center sm:gap-2">
                        <div className="text-xs">Limit Order?</div>
                        <div className="mr-8 pl-4 sm:mr-0 sm:pl-0">
                            <InfoTip id="limit-info-tool-tip" place="top">
                                <div className="z-50 flex h-28 w-72 flex-col text-sky-100 sm:w-96">
                                    <div>Limit Orders on Saturn Swap will stay on the order book until they are taken.</div>
                                    <div className="grow"></div>
                                    <div>
                                        Limit orders, instead of costing a fee, are awarded 60% of the dex fee when the limit order is taken.
                                    </div>
                                </div>
                            </InfoTip>
                        </div>
                    </div>
                    <div className="grow"></div>
                    <div className="text-xs text-sky-200">{percentString}</div>
                </div>
            </div>
        </>
    );
};
