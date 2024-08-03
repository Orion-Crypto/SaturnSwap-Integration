import { BuyOrder, SellOrder } from '@/components/PageComponents/Swap/OrderBookElements/SwapOrderBook';
import { useGetOrderBookBuyPoolUtxos, useGetOrderBookSellPoolUtxos } from '@/hooks/Models/poolUtxo.hook';
import { SwapType } from '@/types/Enums/SwapType';
import { GraphQLParameters } from '@/types/GraphQL/GraphQLParameters';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';

export const RightOrderBook = ({
    pool,
    tokenProjectOne,
    tokenProjectTwo,
    address,
    swapType,
    isTokenSelected,
    isEnabled,
    isNike = false,
    isParty = false,
}: any) => {
    // Order Book Hooks must be called in the child component
    const sellPageSize = 30;
    const buyPageSize = 30;

    const emptyLoadMore = () => {};
    const limitSellOrderBookParameters: GraphQLParameters = {
        first: sellPageSize,
        where: FilterOrderBook(pool),
        order: `{ price: ASC }`,
    };

    const {
        data: limitSellPoolUtxosPages,
        fetchNextPage: fetchNextSellPage,
        hasNextPage: hasNextSellPage,
    }: any = useGetOrderBookSellPoolUtxos(address, limitSellOrderBookParameters, isTokenSelected && !!pool?.id);

    const limitBuyOrderBookParameters: GraphQLParameters = {
        first: buyPageSize,
        where: FilterOrderBook(pool),
        order: `{ price: DESC }`,
    };

    const {
        data: limitBuyPoolUtxosPages,
        fetchNextPage: fetchNextBuyPage,
        hasNextPage: hasNextBuyPage,
    }: any = useGetOrderBookBuyPoolUtxos(address, limitBuyOrderBookParameters, isTokenSelected && !!pool?.id);

    // Ensure the reverse scrollbar starts at the bottom of the section
    const [initialPoolLoad, setInitialPoolLoad] = useState('');
    const scrollContainerRef: any = useRef(null);
    const isSamePool = !!initialPoolLoad && initialPoolLoad === pool?.id;
    useEffect(() => {
        // Scroll to the bottom when new items are loaded
        const pages = limitSellPoolUtxosPages?.pages;
        const isSamePool = !!initialPoolLoad && initialPoolLoad === pool?.id;
        if (scrollContainerRef.current && !isSamePool && pages && pages.length) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
            setInitialPoolLoad(pool?.id);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialPoolLoad, limitSellPoolUtxosPages]);

    const ticker = tokenProjectTwo?.ticker ? tokenProjectTwo.ticker : 'Token';
    const fullHeight = swapType === SwapType.Limit && isTokenSelected;

    const backgroundColor = isParty
        ? 'bg-nike-orange-900 border-nike-orange-500 rounded-3xl'
        : isNike
          ? 'border-nike-orange-600/60 bg-nike-orange-900'
          : 'border-sky-600/60 bg-space-950';
    const borderColor = isNike ? 'border-nike-orange-500/60' : 'border-sky-600/60';

    const tickerLengthSize = 4;
    let amountHeader = `Amount (${ticker})`;
    if (ticker.length > tickerLengthSize) {
        amountHeader = `Amt (${ticker})`;
    }
    return (
        <>
            <div
                className={clsx(
                    'absolute top-0 -z-10 flex justify-end rounded-3xl border-2 transition-[left] duration-700',
                    'w-80 sm:w-88',
                    'hidden sm:flex',
                    backgroundColor,
                    {
                        'h-107': !fullHeight,
                        'h-144': fullHeight,
                        'left-0 md:left-[388px]': isEnabled,
                        'left-0': !isEnabled,
                    }
                )}
            >
                <div className={clsx('flex w-72 flex-col justify-start p-3 text-white')}>
                    <div
                        className={clsx(
                            'flex h-6 w-full flex-none items-center justify-center border-b pb-1 text-sm font-semibold text-zinc-200',
                            borderColor
                        )}
                    >
                        Order Book
                    </div>
                    <div className={clsx('flex w-full flex-col font-semibold', { 'h-94': !fullHeight }, { 'h-132': fullHeight })}>
                        <div className={clsx('flex h-1/2 w-full flex-col')}>
                            <div className={clsx('flex w-full flex-col border-b text-zinc-200', borderColor)}>
                                <div className="flex w-full py-1 pr-2 text-2xs text-zinc-400">
                                    <div className="flex w-16 text-red-500">Ask (₳)</div>
                                    <div className="grow"></div>
                                    <div className="flex w-20 justify-center text-center">{amountHeader}</div>
                                    <div className="grow"></div>
                                    <div className="flex w-16 justify-end">Amount (₳)</div>
                                </div>
                            </div>
                            <div
                                ref={scrollContainerRef}
                                className={clsx(
                                    'flex w-full flex-col overflow-y-auto pt-1 text-xs',
                                    isNike ? 'scrollbar-nike-orange-500-sm' : 'scrollbar-sky-700-sm'
                                )}
                            >
                                <InfiniteScroll
                                    className="flex w-full"
                                    loadMore={fetchNextSellPage ?? emptyLoadMore}
                                    hasMore={(isSamePool && hasNextSellPage) ?? false}
                                    initialLoad={false} //  Need this 2 to prevent instead double load pushing the scrollbar up
                                    threshold={100} //  Need this 2 to prevent instead double load pushing the scrollbar up
                                    isReverse={true}
                                    loader={<div key={0}></div>}
                                    useWindow={false}
                                >
                                    <div className="flex h-full w-full flex-col-reverse justify-start pb-1 pr-2">
                                        {limitSellPoolUtxosPages?.pages?.map(
                                            (page: any, pageIndex: number) =>
                                                page?.edges?.map((pageData: any, edgeIndex: number) => {
                                                    const utxo = pageData?.node;
                                                    const index = pageIndex * sellPageSize + edgeIndex;
                                                    return <SellOrder key={index} utxo={utxo} tokenProjectSell={tokenProjectTwo} />;
                                                })
                                        )}
                                    </div>
                                </InfiniteScroll>
                            </div>
                        </div>
                        <div className={clsx('flex h-1/2 w-full flex-col')}>
                            <div className={clsx('flex w-full flex-col border-y  text-zinc-200', borderColor)}>
                                <div className="flex w-full py-1 pr-2 text-2xs text-zinc-400">
                                    <div className="w-16 text-green-500">Bid (₳)</div>
                                    <div className="grow"></div>
                                    <div className="flex w-20 justify-center text-center">{amountHeader}</div>
                                    <div className="grow"></div>
                                    <div className="flex w-16 justify-end">Amount (₳)</div>
                                </div>
                            </div>
                            <div
                                className={clsx(
                                    'flex w-full flex-grow overflow-y-auto pt-1 text-xs',
                                    isNike ? 'scrollbar-nike-orange-500-sm' : 'scrollbar-sky-700-sm'
                                )}
                            >
                                <InfiniteScroll
                                    className="flex w-full"
                                    loadMore={fetchNextBuyPage ?? emptyLoadMore}
                                    hasMore={hasNextBuyPage ?? false}
                                    threshold={100}
                                    loader={<div key={0}></div>}
                                    useWindow={false}
                                >
                                    <div className="flex h-full w-full flex-col pr-2">
                                        {limitBuyPoolUtxosPages?.pages?.map(
                                            (page: any, pageIndex: number) =>
                                                page?.edges?.map((pageData: any, edgeIndex: number) => {
                                                    const utxo = pageData?.node;
                                                    const index = pageIndex * buyPageSize + edgeIndex;
                                                    return <BuyOrder key={index} utxo={utxo} tokenProjectBuy={tokenProjectTwo} />;
                                                })
                                        )}
                                    </div>
                                </InfiniteScroll>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export const FilterOrderBook = (pool: any) => {
    const filter = `{
        pool_id: { eq: "${pool?.id}" },
    }`;
    return filter;
};
