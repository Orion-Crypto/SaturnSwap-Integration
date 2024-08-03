import { BottomOrderBook } from '@/components/PageComponents/Swap/OrderBookElements/BottomOrderBook';
import { RightOrderBook } from '@/components/PageComponents/Swap/OrderBookElements/RightOrderBook';
import { formatCommaValue } from '@/utils/number';
import clsx from 'clsx';
export const SwapOrderBook = ({
    pool,
    tokenProjectOne,
    tokenProjectTwo,
    address,
    swapType,
    isTokenSelected,
    isEnabled,
    utxoOrderBookData = null, // Optionally allow showing utxoOrderBookData
    isNike = false,
    isParty = false,
}: any) => {
    const correctedAddress = address ? address : 'addr'; // Required for the orderbook Utxo query
    return (
        <>
            <RightOrderBook
                pool={pool}
                tokenProjectOne={tokenProjectOne}
                tokenProjectTwo={tokenProjectTwo}
                address={correctedAddress}
                swapType={swapType}
                isTokenSelected={isTokenSelected}
                isEnabled={isEnabled}
                isNike={isNike}
                isParty={isParty}
            />
            <BottomOrderBook
                pool={pool}
                tokenProjectOne={tokenProjectOne}
                tokenProjectTwo={tokenProjectTwo}
                address={correctedAddress}
                swapType={swapType}
                isTokenSelected={isTokenSelected}
                isEnabled={isEnabled}
                isNike={isNike}
                isParty={isParty}
            />
        </>
    );
};

export const BuyOrder = ({ utxo, tokenProjectBuy }: any) => {
    let price = utxo?.price.toFixed(tokenProjectBuy?.precision || 4);
    if (price.length > 12) {
        price = price.slice(0, 12);
    }
    const tokenAmount = utxo?.token_amount_buy ? utxo.token_amount_buy / Math.pow(10, tokenProjectBuy.decimals) : 0;
    const tokenAmountString = formatCommaValue(tokenAmount, 3, 3);
    const adaAmount = utxo?.token_amount_sell ? utxo.token_amount_sell / Math.pow(10, 6) : 0;
    const adaAmountString = formatCommaValue(adaAmount, 3, 3);

    let linePadding = 'px-1';
    if (price.length > 6) {
        linePadding = 'px-2';
    } else if (price.length > 8) {
        linePadding = 'px-4';
    }

    let showLine = true;
    if (price.length >= 10) {
        showLine = false;
    }

    return (
        <>
            <div className="flex w-full text-2xs">
                <div className="flex w-12 whitespace-nowrap text-green-500">₳ {price}</div>
                <div className={clsx('flex grow items-center justify-center', linePadding)}>
                    {showLine && <div className="h-[1px] w-full rounded-full bg-green-700"></div>}
                </div>
                <div className="flex w-16 justify-center">{tokenAmountString}</div>
                <div className={clsx('flex grow items-center justify-center', linePadding)}>
                    {showLine && <div className="h-[1px] w-full rounded-full bg-green-700"></div>}
                </div>
                <div className="flex w-12 justify-end">{adaAmountString}</div>
            </div>
        </>
    );
};

export const SellOrder = ({ utxo, tokenProjectSell }: any) => {
    const isIncompleteLiftoffProject = !!tokenProjectSell?.liftoff_project && !tokenProjectSell?.liftoff_project?.is_successful;
    const bondingCurvePrice = 0.0000369;
    const isAboveBoundingPrice = utxo?.price >= bondingCurvePrice;

    let price = utxo?.price.toFixed(tokenProjectSell?.precision || 4);
    if (price.length > 12) {
        price = price.slice(0, 12);
    }
    const tokenAmount = utxo?.token_amount_sell ? utxo.token_amount_sell / Math.pow(10, tokenProjectSell.decimals) : 0;
    const tokenAmountString = formatCommaValue(tokenAmount, 3, 3);
    const adaAmount = utxo?.token_amount_buy ? utxo.token_amount_buy / Math.pow(10, 6) : 0;
    const adaAmountString = formatCommaValue(adaAmount, 3, 3);

    let linePadding = 'px-1';
    if (price.length > 6) {
        linePadding = 'px-2';
    } else if (price.length > 8) {
        linePadding = 'px-4';
    }

    let showLine = true;
    if (price.length >= 10) {
        showLine = false;
    }

    const textColor = isIncompleteLiftoffProject && isAboveBoundingPrice ? 'text-yellow-400' : 'text-red-500';
    const bgColor = isIncompleteLiftoffProject && isAboveBoundingPrice ? 'bg-yellow-400' : 'bg-red-500';
    return (
        <>
            <div className="flex w-full text-2xs">
                <div className={clsx('flex w-12 whitespace-nowrap', textColor)}>₳ {price}</div>
                <div className={clsx('flex grow items-center justify-center', linePadding)}>
                    {showLine && <div className={clsx('h-[1px] w-full rounded-full', bgColor)}></div>}
                </div>
                <div className="flex w-16 justify-center">{tokenAmountString}</div>
                <div className={clsx('flex grow items-center justify-center', linePadding)}>
                    {showLine && <div className={clsx('h-[1px] w-full rounded-full', bgColor)}></div>}
                </div>
                <div className="flex w-12 justify-end">{adaAmountString}</div>
            </div>
        </>
    );
};
