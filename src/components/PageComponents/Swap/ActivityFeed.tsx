import { IPFSImage } from '@/components/Elements/IPFSImage';
import { Spinner } from '@/components/Elements/Spinner';
import { useGetShowActivityFeed } from '@/hooks/Component/activity-feed.hook';
import { useGetActivityFeedPoolUtxos } from '@/hooks/Models/poolUtxo.hook';
import { GraphQLParameters } from '@/types/GraphQL/GraphQLParameters';
import { formatTokenValue } from '@/utils/number';
import { timeAgo } from '@/utils/time';
import clsx from 'clsx';
import { useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroller';

export const ActivityFeed = ({ isTransparent = false, animate = false }) => {
    const emptyLoadMore = () => {};

    const pageSize = 30;
    const orderParameters: GraphQLParameters = {
        first: pageSize,
        where: `{ spend_type: { in: [MARKET_BUY_ORDER, MARKET_SELL_ORDER]  }, active_status: { eq: COMPLETE }, spend_status: { eq: COMPLETE } }`,
        order: '{ spend_status_timestamp: DESC }',
    };
    const {
        data: orderPoolUtxosPages,
        isLoading: isLoading,
        fetchNextPage: fetchNextOrderPage,
        hasNextPage: hasNextOrderPage,
        refetch,
    }: any = useGetActivityFeedPoolUtxos(orderParameters);

    useEffect(() => {
        const intervalId = setInterval(() => {
            refetch();
        }, 10000); // Fetch data every 10 seconds

        // Cleanup function: clear the interval on unmount
        return () => clearInterval(intervalId);
    }, [refetch]);

    const { data: showActivityFeed } = useGetShowActivityFeed();
    return (
        <div
            className={clsx(
                'absolute top-3 z-20 flex max-h-184 w-64 flex-col rounded-2xl border border-sky-600/60 bg-space-950 transition-all duration-700',
                showActivityFeed ? 'left-36' : 'left-108',
                animate
                    ? isTransparent
                        ? 'opacity-100 xl:animate-lighter-fade-out xl:opacity-90'
                        : 'opacity-100 xl:animate-lighter-fade-in'
                    : isTransparent
                      ? 'opacity-100 xl:opacity-90'
                      : 'opacity-100'
            )}
        >
            <div className="my-1 flex h-10 w-full flex-none items-center justify-center  border-sky-600/60 text-center text-xl font-semibold text-zinc-200">
                Activity Feed
            </div>
            <div className="scrollbar-sky-800-sm flex h-full min-h-[40rem] w-full overflow-auto border-t border-sky-600/60 text-white">
                {isLoading ? (
                    <div className="flex h-24 w-full items-center justify-center">
                        <Spinner />
                    </div>
                ) : (
                    <InfiniteScroll
                        className="flex w-full"
                        loadMore={fetchNextOrderPage ?? emptyLoadMore}
                        hasMore={hasNextOrderPage ?? false}
                        useWindow={false}
                    >
                        <div className="flex h-full w-full flex-col ">
                            {orderPoolUtxosPages?.pages?.map(
                                (page: any, pageIndex: number) =>
                                    page?.edges?.map((pageData: any, edgeIndex: number) => {
                                        const order = pageData?.node;
                                        const index = pageIndex * pageSize + edgeIndex;
                                        return <ActivityAction key={index} order={order} />;
                                    })
                            )}
                        </div>
                    </InfiniteScroll>
                )}
            </div>
        </div>
    );
};

export const ActivityAction = ({ order, isLastItem }: any) => {
    const isTokenProjectOneBuy = order.token_project_one.policy_id === order.policy_id_buy;

    const tokenAmountSell = order.split_token_amount_sell ? order.split_token_amount_sell : order.token_amount_sell;
    const tokenAmountBuy = order.split_token_amount_buy ? order.split_token_amount_buy : order.token_amount_buy;

    const tokenValue = isTokenProjectOneBuy ? formatTokenValue(tokenAmountSell) : formatTokenValue(tokenAmountBuy);
    const adaValue = isTokenProjectOneBuy
        ? formatTokenValue(tokenAmountBuy, order.token_project_one.decimals)
        : formatTokenValue(tokenAmountSell, order.token_project_one.decimals);
    return (
        <>
            <div className={clsx('flex border-sky-600/60 py-1 sm:pb-1', isLastItem ? 'border-b-0' : 'border-b')}>
                <div className="mr-3 flex items-center font-semibold text-zinc-200">
                    <div className="flex justify-center pl-2">
                        <div className={clsx('z-10 ml-1.5 flex h-7 w-7 rounded-full')}>
                            <IPFSImage
                                image={order.token_project_one.image}
                                containerClassNames="relative flex aspect-square w-screen"
                                classNames="rounded-full object-contain"
                                alt={order.token_project_one.ticker}
                            />
                        </div>
                        <div className={clsx('z-20 -ml-3 flex h-7 w-7 rounded-full')}>
                            <IPFSImage
                                image={order.token_project_two.image}
                                containerClassNames="relative flex aspect-square w-screen"
                                classNames="rounded-full object-contain"
                                alt={order.token_project_two.ticker}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    <div className="flex gap-1 text-xs font-semibold">
                        <div className={clsx(isTokenProjectOneBuy ? '' : 'hidden', 'text-red-400')}>{'Sold'}</div>
                        <div className={clsx(isTokenProjectOneBuy ? 'hidden' : '', 'text-green-400')}>{'Bought'}</div>
                        <div className="flex items-center justify-end gap-1">
                            <div className="text-sky-300">{tokenValue}</div>
                            <div className="text-3xs text-slate-200">({order.token_project_two.ticker})</div>
                        </div>
                    </div>
                    <div className="flex text-xs">
                        <div className="flex gap-1 font-semibold">
                            <div>For </div>
                            <div className="text-sky-300">₳ {adaValue}</div>
                        </div>
                    </div>
                </div>
                <div className="grow"></div>
                <div className="flex h-full items-center pr-1 text-3xs">{timeAgo(order.spend_status_timestamp)}</div>
            </div>
        </>
    );
};
