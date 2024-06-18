import { Spinner } from '@/components/Elements/Spinner';
import { BuyOrder, SellOrder } from '@/components/PageComponents/Swap/OrderBookElements/SwapOrderBook';
import { useGetOrderBookBuyPoolUtxos, useGetOrderBookSellPoolUtxos } from '@/hooks/Models/poolUtxo.hook';
import { SwapType } from '@/types/Enums/SwapType';
import { GraphQLParameters } from '@/types/GraphQL/GraphQLParameters';
import clsx from 'clsx';
import InfiniteScroll from 'react-infinite-scroller';

export const RightOrderBook = ({
    orderBookData,
    pool,
    tokenProjectOne,
    tokenProjectTwo,
    address,
    swapType,
    isTokenSelected,
    isEnabled,
    isActivityFeedEnabled,
}: any) => {
    // Order Book Hooks must be called in the child component
    const { buyPageSize, sellPageSize } = orderBookData;
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

    const ticker = tokenProjectTwo?.ticker ? tokenProjectTwo.ticker : 'Token';
    const fullHeight = swapType === SwapType.Limit && isTokenSelected;
    return (
        <>
            <div
                className={clsx(
                    'absolute top-0 -z-10 flex w-88 justify-end rounded-3xl border-2 border-sky-600/60 bg-space-950 transition-[left] duration-700',
                    'hidden sm:flex',
                    {
                        'h-104': !fullHeight,
                        'h-144': fullHeight,
                        'left-0 xl:left-[388px]': isEnabled,
                        'left-0': !isEnabled,
                    }
                )}
            >
                <div className={clsx('flex w-72 flex-col justify-start p-3 text-white')}>
                    <div className="flex h-6 w-full flex-none items-center justify-center border-b border-sky-600/60 pb-1 text-sm font-semibold text-zinc-200">
                        Order Book
                    </div>
                    <div className={clsx('flex w-full flex-col font-semibold', { 'h-90': !fullHeight }, { 'h-132': fullHeight })}>
                        <div className={clsx('flex h-1/2 w-full flex-col')}>
                            <div className="flex w-full flex-col border-b border-sky-600/60 text-zinc-200">
                                <div className="flex w-full py-1 pr-2 text-2xs text-zinc-400">
                                    <div className="flex w-16 text-red-500">Ask (₳)</div>
                                    <div className="grow"></div>
                                    <div className="flex w-20 justify-center text-center">{`Amount (${ticker})`}</div>
                                    <div className="grow"></div>
                                    <div className="flex w-16 justify-end">Amount (₳)</div>
                                </div>
                            </div>
                            <div
                                className={clsx(
                                    'scrollbar-sky-800-sm flex w-full flex-grow flex-col-reverse overflow-y-auto pt-1 text-xs',
                                    { 'h-36': !fullHeight },
                                    { 'h-56': fullHeight }
                                )}
                            >
                                <div className="grow"></div>
                                <InfiniteScroll
                                    className="flex w-full"
                                    loadMore={fetchNextSellPage ?? emptyLoadMore}
                                    hasMore={hasNextSellPage ?? false}
                                    isReverse={true}
                                    loader={
                                        <div key={0} className="flex h-24 w-full items-center justify-center">
                                            <Spinner />
                                        </div>
                                    }
                                    useWindow={false}
                                >
                                    <div className="flex h-full w-full flex-col-reverse justify-end pb-1 pr-2">
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
                            <div className="flex w-full flex-col border-y border-sky-600/60 text-zinc-200">
                                <div className="flex w-full py-1 pr-2 text-2xs text-zinc-400">
                                    <div className="w-16 text-green-500">Bid (₳)</div>
                                    <div className="grow"></div>
                                    <div className="flex w-20 justify-center text-center">{`Amount (${ticker})`}</div>
                                    <div className="grow"></div>
                                    <div className="flex w-16 justify-end">Amount (₳)</div>
                                </div>
                            </div>
                            <div
                                className={clsx(
                                    'scrollbar-sky-800-sm flex w-full flex-grow overflow-y-auto pt-1 text-xs',
                                    { 'h-56': !fullHeight },
                                    { 'h-56': fullHeight }
                                )}
                            >
                                <InfiniteScroll
                                    className="flex w-full"
                                    loadMore={fetchNextBuyPage ?? emptyLoadMore}
                                    hasMore={hasNextBuyPage ?? false}
                                    loader={
                                        <div key={0} className="flex h-24 w-full items-center justify-center">
                                            <Spinner />
                                        </div>
                                    }
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
