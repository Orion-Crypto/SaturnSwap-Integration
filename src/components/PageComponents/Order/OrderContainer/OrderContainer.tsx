import { Spinner } from '@/components/Elements/Spinner';
import { EmptyOrders } from '@/components/PageComponents/Order/EmptyOrders';
import { OrderRow } from '@/components/PageComponents/Order/OrderContainer/OrderRow';
import { OrdersNavbar } from '@/components/PageComponents/Order/OrdersNavbar';
import { FilterOrders, SortOrders } from '@/components/PageComponents/Order/Utils/OrderUtils';
import { useGetOrderFilterType, useGetOrderStatusFilterType, useGetTradeFilterType } from '@/hooks/Component/order.hook';
import { useGetPoolUtxos } from '@/hooks/Models/poolUtxo.hook';
import { POOL_UTXO_POOL_SEARCH_KEY, useGetSearchValue } from '@/hooks/Models/search.hook';
import { OrderContainerType } from '@/types/Enums/OrderContainerType';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';

export const OrderContainer = ({
    orderContainerType,
    address,
    toggleAnimation,
    showBackgroundImage,
    showOrderTypeToggle = true,
    isNike = false,
    preselectedPool = null,
    isAdvanced = false,
    isParty = false,
}: any) => {
    const { data: tradeFilterType }: any = useGetTradeFilterType();
    const { data: orderFilterType }: any = useGetOrderFilterType();
    const { data: orderStatusFilterType }: any = useGetOrderStatusFilterType();

    const filterAddress = orderContainerType === OrderContainerType.AllOrders ? null : address;

    const { data: search }: any = useGetSearchValue(POOL_UTXO_POOL_SEARCH_KEY);
    const pageSize = 30;
    const {
        data: poolUtxosPages,
        isLoading,
        fetchNextPage: fetchNextOrderPage,
        hasNextPage: hasNextOrderPage,
        refetch,
    }: any = useGetPoolUtxos({
        first: pageSize,
        where: FilterOrders(
            tradeFilterType,
            orderFilterType,
            orderStatusFilterType,
            filterAddress,
            search,
            isNike,
            preselectedPool,
            !!preselectedPool
        ),
        order: SortOrders(),
    });
    const emptyLoadMore = () => {};

    const [reload, setReload] = useState(false);
    useEffect(() => {
        const stopSpinner = async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setReload(false);
        };

        const intervalId = setInterval(async () => {
            setReload(true);
            refetch();
            await stopSpinner();
        }, 10000); // Fetch data every 10 seconds

        return () => clearInterval(intervalId);
    }, [refetch]);

    const totalPages = poolUtxosPages?.pages?.length;
    return (
        <>
            <div
                className={clsx(
                    'flex transition-all duration-700',
                    !!preselectedPool || isAdvanced ? 'w-full justify-start' : 'w-full justify-center px-6 xl:px-24'
                )}
            >
                <div
                    className={clsx(
                        'z-20 mb-12 flex h-144 flex-col justify-start  border-2 text-white',
                        !!preselectedPool ? 'w-full' : 'w-full lg:max-w-360',
                        isParty
                            ? 'rounded-3xl border-nike-orange-500 bg-nike-orange-700'
                            : isNike
                              ? 'rounded-lg border-nike-orange-600/60 bg-nike-orange-900 shadow-full-nike-orange-3xl-500'
                              : 'rounded-lg border-sky-600/60 bg-space-950 shadow-full-sky-xl-900',
                        toggleAnimation
                            ? showBackgroundImage
                                ? 'opacity-100 xl:animate-lighter-fade-out xl:opacity-90'
                                : 'animate-lighter-fade-in opacity-100'
                            : showBackgroundImage
                              ? 'opacity-100 xl:opacity-90'
                              : 'opacity-100'
                    )}
                >
                    <OrdersNavbar
                        orderContainerType={orderContainerType}
                        showOrderTypeToggle={showOrderTypeToggle}
                        pool={preselectedPool}
                        reload={reload}
                        isNike={isNike}
                        isParty={isParty}
                    />
                    {totalPages <= 0 ? (
                        <EmptyOrders isLoading={isLoading} />
                    ) : (
                        <>
                            <div
                                className={clsx(
                                    'flex w-full flex-col overflow-x-auto overflow-y-hidden',
                                    isNike ? 'scrollbar-nike-orange-500-md' : ''
                                )}
                            >
                                <div
                                    className={clsx(
                                        'border-b px-12 py-2 font-bold text-neutral-300',
                                        !!preselectedPool ? 'grid w-359 grid-cols-8 gap-4 sm:w-auto' : 'flex w-359 justify-start',
                                        isParty
                                            ? 'border-nike-orange-500 bg-nike-orange-700 text-white'
                                            : isNike
                                              ? 'border-nike-orange-600/60 bg-nike-orange-900 text-neutral-300'
                                              : 'border-sky-600/60 bg-space-950 text-neutral-300'
                                    )}
                                >
                                    <div className={clsx('flex flex-none justify-start text-center', !!preselectedPool ? 'text-xs' : 'w-28')}>
                                        Time
                                    </div>
                                    <div
                                        className={clsx(
                                            'flex flex-none justify-start px-2 text-center',
                                            !!preselectedPool ? 'hidden text-xs' : 'w-56'
                                        )}
                                    >
                                        Pair
                                    </div>
                                    <div className={clsx('flex flex-none justify-start text-center', !!preselectedPool ? 'text-xs' : 'w-36')}>
                                        Trade Type
                                    </div>
                                    <div className={clsx('flex flex-none justify-start text-end', !!preselectedPool ? 'text-xs' : 'w-40')}>
                                        Size ADA
                                    </div>
                                    <div className={clsx('flex flex-none justify-start text-center', !!preselectedPool ? 'text-xs' : 'w-40')}>
                                        Size Token
                                    </div>
                                    <div className={clsx('flex flex-none justify-start text-center', !!preselectedPool ? 'text-xs' : 'w-36')}>
                                        Price
                                    </div>
                                    <div className={clsx('flex flex-none justify-start text-center', !!preselectedPool ? 'text-xs' : 'w-36')}>
                                        Order Type
                                    </div>
                                    <div className={clsx('flex flex-none justify-start text-center', !!preselectedPool ? 'text-xs' : 'w-28')}>
                                        Status
                                    </div>
                                    <div
                                        className={clsx('flex flex-none justify-start text-center', !!preselectedPool ? 'text-xs' : 'w-28')}
                                    ></div>
                                </div>

                                <div
                                    className={clsx(
                                        'flex h-full flex-col overflow-y-auto overflow-x-hidden',
                                        !!preselectedPool ? 'w-359 sm:w-full' : 'w-359',
                                        isNike ? 'scrollbar-nike-orange-500-md' : ''
                                    )}
                                >
                                    <InfiniteScroll
                                        className="flex h-full w-full flex-col"
                                        loadMore={fetchNextOrderPage ?? emptyLoadMore}
                                        hasMore={hasNextOrderPage ?? false}
                                        loader={
                                            <div key={0} className="flex h-24 w-full items-center justify-center">
                                                <Spinner />
                                            </div>
                                        }
                                        useWindow={false}
                                    >
                                        <>
                                            {poolUtxosPages?.pages?.map(
                                                (page: any, pageIndex: number) =>
                                                    page?.edges?.map((pageData: any, edgeIndex: number) => {
                                                        const order = pageData?.node;
                                                        const index = pageIndex * pageSize + edgeIndex;
                                                        return (
                                                            <OrderRow
                                                                key={index}
                                                                address={filterAddress}
                                                                order={order}
                                                                preselectedPool={preselectedPool}
                                                                isNike={isNike}
                                                                isParty={isParty}
                                                            />
                                                        );
                                                    })
                                            )}
                                        </>
                                    </InfiniteScroll>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};
