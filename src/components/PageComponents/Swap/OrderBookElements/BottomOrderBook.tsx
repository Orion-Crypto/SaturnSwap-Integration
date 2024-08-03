import { Spinner } from '@/components/Elements/Spinner';
import { FilterOrderBook } from '@/components/PageComponents/Swap/OrderBookElements/RightOrderBook';
import { BuyOrder, SellOrder } from '@/components/PageComponents/Swap/OrderBookElements/SwapOrderBook';
import { useGetOrderBookBuyPoolUtxos, useGetOrderBookSellPoolUtxos } from '@/hooks/Models/poolUtxo.hook';
import { SwapType } from '@/types/Enums/SwapType';
import { GraphQLParameters } from '@/types/GraphQL/GraphQLParameters';
import clsx from 'clsx';
import InfiniteScroll from 'react-infinite-scroller';

export const BottomOrderBook = ({
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

    const ticker = tokenProjectTwo?.ticker ? tokenProjectTwo.ticker : 'Token';
    const fullHeight = swapType === SwapType.Limit && isTokenSelected;

    const backgroundColor = isParty
        ? 'bg-nike-orange-900 border-nike-orange-500 rounded-3xl'
        : isNike
          ? 'border-nike-orange-600/60 bg-nike-orange-900'
          : 'border-sky-600/60 bg-space-950';
    const borderColor = isNike ? 'border-nike-orange-500/60' : 'border-sky-600/60';
    return (
        <>
            <div
                className={clsx(
                    'absolute -z-10 flex w-full justify-center rounded-b-3xl border-2 transition-all duration-700',
                    'sm:hidden',
                    backgroundColor,
                    {
                        'h-104': !fullHeight,
                        'top-[410px] xl:top-0 xl:rounded-3xl': isEnabled && !fullHeight,
                        'top-[555px] xl:top-0 xl:rounded-3xl': isEnabled && fullHeight,
                        'top-0 rounded-3xl': !isEnabled,
                    }
                )}
            >
                <div className={clsx('flex w-full flex-col justify-start p-3 text-white')}>
                    <div
                        className={clsx(
                            'flex h-16 w-full flex-none items-end justify-center border-b  pb-4 text-sm font-semibold text-zinc-200',
                            borderColor
                        )}
                    >
                        Order Book
                    </div>
                    <div className={clsx('flex w-full flex-col font-semibold', { 'h-84': !fullHeight }, { 'h-120': fullHeight })}>
                        <div className={clsx('flex h-1/2 w-full flex-col')}>
                            <div className={clsx('flex w-full flex-col border-b  text-zinc-200', borderColor)}>
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
                                    'flex w-full flex-grow flex-col-reverse overflow-y-hidden pt-1 text-xs',
                                    { 'h-32': !fullHeight },
                                    { 'h-48': fullHeight },
                                    isNike ? 'scrollbar-nike-orange-500-sm' : 'scrollbar-sky-700-sm'
                                )}
                            >
                                <InfiniteScroll
                                    className="flex w-full"
                                    loadMore={fetchNextSellPage ?? emptyLoadMore}
                                    hasMore={false} // Not reloading more on mobile due to components above this preventing scroll
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
                        <div className={clsx('mb-4 flex h-1/2 w-full flex-col')}>
                            <div className={clsx('flex w-full flex-col border-y  text-zinc-200', borderColor)}>
                                <div className="flex w-full py-1 pr-2 text-2xs text-zinc-400">
                                    <div className="flex w-16 text-green-500">Bid (₳)</div>
                                    <div className="grow"></div>
                                    <div className="flex w-20 justify-center text-center">{`Amount (${ticker})`}</div>
                                    <div className="grow"></div>
                                    <div className="flex w-16 justify-end">Amount (₳)</div>
                                </div>
                            </div>
                            <div
                                className={clsx(
                                    'flex w-full flex-grow overflow-y-hidden pt-1 text-xs',
                                    { 'h-40': !fullHeight },
                                    { 'h-56': fullHeight },
                                    isNike ? 'scrollbar-nike-orange-500-sm' : 'scrollbar-sky-700-sm'
                                )}
                            >
                                <InfiniteScroll
                                    className="flex w-full"
                                    loadMore={fetchNextBuyPage ?? emptyLoadMore}
                                    hasMore={false} // Not reloading more on mobile due to components above this preventing scroll
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
                        <div className="md:hidden">
                            <div className="h-20"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                className={clsx('absolute -z-10 flex w-full justify-center transition-all duration-700', {
                    'h-116': !fullHeight,
                    'top-[390px] xl:top-0 xl:rounded-3xl': isEnabled && !fullHeight,
                    'top-[555px] xl:top-0 xl:rounded-3xl': isEnabled && fullHeight,
                    'top-0 rounded-3xl': !isEnabled,
                })}
            ></div>
        </>
    );
};
