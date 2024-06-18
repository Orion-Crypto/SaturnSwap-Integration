import { BottomOrderBook } from '@/components/PageComponents/Swap/OrderBookElements/BottomOrderBook';
import { RightOrderBook } from '@/components/PageComponents/Swap/OrderBookElements/RightOrderBook';
import { useGetShowActivityFeed } from '@/hooks/Component/activity-feed.hook';
import { BASE_POOL_UTXO_KEY, ORDER_BOOK_POOL_UTXO_KEY } from '@/hooks/Models/poolUtxo.hook';
import { queryClient } from '@/hooks/default';
import clsx from 'clsx';
import { useEffect } from 'react';

export const SwapOrderBook = ({
    pool,
    tokenProjectOne,
    tokenProjectTwo,
    address,
    swapType,
    isTokenSelected,
    isEnabled,
    utxoOrderBookData = null, // Optionally allow showing utxoOrderBookData
}: any) => {
    const pageSize = 30;
    const orderBookData = {
        buyPageSize: pageSize,
        sellPageSize: pageSize,
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            queryClient.invalidateQueries({ queryKey: [BASE_POOL_UTXO_KEY] });
            queryClient.invalidateQueries({ queryKey: [ORDER_BOOK_POOL_UTXO_KEY] });
        }, 20000);
        return () => clearInterval(intervalId);
    }, []);
    const { data: showActivityFeed } = useGetShowActivityFeed();

    const correctedAddress = address ? address : 'addr'; // Required for the orderbook Utxo query
    return (
        <>
            <RightOrderBook
                orderBookData={orderBookData}
                pool={pool}
                tokenProjectOne={tokenProjectOne}
                tokenProjectTwo={tokenProjectTwo}
                address={correctedAddress}
                swapType={swapType}
                isTokenSelected={isTokenSelected}
                isEnabled={isEnabled}
                isActivityFeedEnabled={showActivityFeed}
            />
            <BottomOrderBook
                orderBookData={orderBookData}
                pool={pool}
                tokenProjectOne={tokenProjectOne}
                tokenProjectTwo={tokenProjectTwo}
                address={correctedAddress}
                swapType={swapType}
                isTokenSelected={isTokenSelected}
                isEnabled={isEnabled}
                isActivityFeedEnabled={showActivityFeed}
            />
        </>
    );
};

export const BuyOrder = ({ utxo, tokenProjectBuy }: any) => {
    let price = utxo?.price.toFixed(tokenProjectBuy?.precision || 4);
    if (price.length > 12) {
        price = price.slice(0, 12);
    }
    const tokenAmount = utxo?.token_amount_buy ? (utxo.token_amount_buy / Math.pow(10, tokenProjectBuy.decimals)).toFixed(4) : 0;
    const adaAmount = utxo?.token_amount_sell ? (utxo.token_amount_sell / Math.pow(10, 6)).toFixed(3) : 0;

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
                <div className="flex w-16 justify-center">{tokenAmount}</div>
                <div className={clsx('flex grow items-center justify-center', linePadding)}>
                    {showLine && <div className="h-[1px] w-full rounded-full bg-green-700"></div>}
                </div>
                <div className="flex w-12 justify-end">{adaAmount}</div>
            </div>
        </>
    );
};

export const SellOrder = ({ utxo, tokenProjectSell }: any) => {
    let price = utxo?.price.toFixed(tokenProjectSell?.precision || 4);
    if (price.length > 12) {
        price = price.slice(0, 12);
    }
    const tokenAmount = utxo?.token_amount_sell ? (utxo.token_amount_sell / Math.pow(10, tokenProjectSell.decimals)).toFixed(4) : 0;
    const adaAmount = utxo?.token_amount_buy ? (utxo.token_amount_buy / Math.pow(10, 6)).toFixed(3) : 0;

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
                <div className="flex w-12 whitespace-nowrap text-red-500">₳ {price}</div>
                <div className={clsx('flex grow items-center justify-center', linePadding)}>
                    {showLine && <div className="h-[1px] w-full rounded-full bg-red-700"></div>}
                </div>
                <div className="flex w-16 justify-center">{tokenAmount}</div>
                <div className={clsx('flex grow items-center justify-center', linePadding)}>
                    {showLine && <div className="h-[1px] w-full rounded-full bg-red-700"></div>}
                </div>
                <div className="flex w-12 justify-end">{adaAmount}</div>
            </div>
        </>
    );
};
