import { PoolUtxoPoolGraphQLFilter, SearchBar } from '@/components/Elements/SearchBar';
import { Spinner } from '@/components/Elements/Spinner';
import {
    setOrderContainerType,
    setOrderFilterType,
    setOrderStatusFilterType,
    setTradeFilterType,
    useGetOrderFilterType,
    useGetOrderStatusFilterType,
    useGetTradeFilterType,
} from '@/hooks/Component/order.hook';
import { BASE_POOL_UTXO_KEY } from '@/hooks/Models/poolUtxo.hook';
import { POOL_UTXO_POOL_SEARCH_KEY } from '@/hooks/Models/search.hook';
import { OrderContainerType } from '@/types/Enums/OrderContainerType';
import { OrderFilterType } from '@/types/Enums/OrderFilterType';
import { OrderStatusFilterType } from '@/types/Enums/OrderStatusFilterType';
import { TradeFilterType } from '@/types/Enums/TradeFilterType';
import clsx from 'clsx';
import Image from 'next/image';
import { useState } from 'react';

export const OrdersNavbar = ({
    orderContainerType,
    showOrderTypeToggle = true,
    pool = null,
    reload = false,
    isPro = false,
    isNike = false,
    isParty = false,
}: any) => {
    const searchKey: any = POOL_UTXO_POOL_SEARCH_KEY;
    const refetchKey: any = [BASE_POOL_UTXO_KEY, 'infinite'];

    let title: any = <span>All Orders</span>;
    if (pool) {
        title = (
            <div className="flex w-full gap-2">
                <span>All</span>
                <span className="text-yellow-500">{`${pool?.token_project_two?.name}`}</span>
                <span>Orders</span>
            </div>
        );
    }

    const { data: tradeFilterType }: any = useGetTradeFilterType();
    const { data: orderFilterType }: any = useGetOrderFilterType();
    const { data: orderStatusFilterType }: any = useGetOrderStatusFilterType();
    return (
        <>
            <div className="flex w-full flex-col gap-4 p-4 lg:flex-row">
                <div className="flex w-full justify-start gap-4">
                    {orderContainerType === OrderContainerType.AllOrders && (
                        <div className="flex text-center text-4xl font-bold sm:w-auto sm:flex-none sm:text-start">{title}</div>
                    )}
                    {orderContainerType === OrderContainerType.YourOrders && (
                        <div className="flex flex-none text-4xl font-bold">Your Orders</div>
                    )}
                    <div className="flex items-center justify-center">{reload && <Spinner />}</div>
                </div>
                <div className="flex w-full justify-start gap-4 lg:justify-end">
                    <TradeTypeDropdown tradeFilterType={tradeFilterType} isNike={isNike} isParty={isParty} />
                    {showOrderTypeToggle && <OrderTypeDropdown orderFilterType={orderFilterType} isNike={isNike} isParty={isParty} />}
                    <OrderStatusTypeDropdown orderStatusFilterType={orderStatusFilterType} isNike={isNike} isParty={isParty} />
                </div>

                {!isNike && !pool && (
                    <div className={clsx('flex w-full', isPro ? 'lg:w-120' : 'lg:w-144')}>
                        <div>
                            <SearchBar
                                classNames="h-10"
                                placeholderText={'Search Orders'}
                                searchKey={searchKey}
                                refetchKey={refetchKey}
                                graphQLFilter={PoolUtxoPoolGraphQLFilter}
                            />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export const TradeTypeDropdown = ({ tradeFilterType, isNike, isParty }: any) => {
    const [isShowingDropdown, setIsShowingDropdown] = useState(false);
    const tradeFilterTypeString =
        tradeFilterType === TradeFilterType.All ? 'Trade Type' : tradeFilterType === TradeFilterType.Buy ? 'Buy' : 'Sell';

    return (
        <>
            <div className="relative flex flex-col">
                <div
                    className={clsx(
                        'flex h-10 cursor-pointer select-none items-center justify-center gap-3 font-bold text-zinc-100 transition-all duration-300',
                        'w-20 text-2xs sm:w-28 sm:text-sm',
                        isParty
                            ? 'bg-nike-party-orange-800 hover:bg-nike-party-orange-600 rounded-2xl'
                            : isNike
                              ? 'bg-nike-orange-700 hover:bg-nike-orange-600 rounded-lg'
                              : 'rounded-lg bg-sky-700 hover:bg-sky-600'
                    )}
                    onClick={() => setIsShowingDropdown(!isShowingDropdown)}
                >
                    <div className={clsx('flex items-center')}>{tradeFilterTypeString}</div>
                    <div className="flex h-full items-center justify-center pt-0.5">
                        <Image src={'/images/icons/arrow-down.png'} alt={'Arrow Down Icon'} width={12} height={12} quality={100} />
                    </div>
                </div>

                {isShowingDropdown && (
                    <div
                        onMouseLeave={() => setIsShowingDropdown(false)}
                        onClick={() => setIsShowingDropdown(false)}
                        className={clsx(
                            'absolute left-0 top-12 z-60 flex max-h-128 w-32 flex-col overflow-y-auto rounded-2xl border-2  font-bold text-white drop-shadow-black-sharp',
                            isParty
                                ? 'border-nike-party-orange-600/60 bg-nike-orange-600'
                                : isNike
                                  ? 'border-nike-orange-600/60 bg-nike-orange-900'
                                  : 'border-sky-600/60 bg-space-950'
                        )}
                    >
                        <>
                            <div
                                className={clsx(
                                    'flex h-12 cursor-pointer items-center justify-start px-4',
                                    tradeFilterType === TradeFilterType.All
                                        ? isParty
                                            ? 'bg-nike-party-orange-800'
                                            : isNike
                                              ? 'bg-nike-orange-700/60'
                                              : 'bg-sky-700/60'
                                        : isParty
                                          ? 'hover:bg-nike-party-orange-800'
                                          : isNike
                                            ? 'hover:bg-nike-orange-700/60'
                                            : 'hover:bg-sky-700/60'
                                )}
                                onClick={() => {
                                    setTradeFilterType(TradeFilterType.All);
                                }}
                            >
                                <div>All</div>
                            </div>
                            <div
                                className={clsx(
                                    'flex h-12 cursor-pointer items-center justify-start px-4',
                                    tradeFilterType === TradeFilterType.Buy
                                        ? isParty
                                            ? 'bg-nike-party-orange-800'
                                            : isNike
                                              ? 'bg-nike-orange-700/60'
                                              : 'bg-sky-700/60'
                                        : isParty
                                          ? 'hover:bg-nike-party-orange-800'
                                          : isNike
                                            ? 'hover:bg-nike-orange-700/60'
                                            : 'hover:bg-sky-700/60'
                                )}
                                onClick={() => {
                                    setTradeFilterType(TradeFilterType.Buy);
                                }}
                            >
                                <div>Buy</div>
                            </div>
                            <div
                                className={clsx(
                                    'flex h-12 cursor-pointer items-center justify-start px-4',
                                    tradeFilterType === TradeFilterType.Sell
                                        ? isParty
                                            ? 'bg-nike-party-orange-800'
                                            : isNike
                                              ? 'bg-nike-orange-700/60'
                                              : 'bg-sky-700/60'
                                        : isParty
                                          ? 'hover:bg-nike-party-orange-800'
                                          : isNike
                                            ? 'hover:bg-nike-orange-700/60'
                                            : 'hover:bg-sky-700/60'
                                )}
                                onClick={() => {
                                    setTradeFilterType(TradeFilterType.Sell);
                                }}
                            >
                                <div>Sell</div>
                            </div>
                        </>
                    </div>
                )}
            </div>
        </>
    );
};

export const OrderTypeDropdown = ({ orderFilterType, isNike, isParty }: any) => {
    const [isShowingDropdown, setIsShowingDropdown] = useState(false);
    const orderFilterTypeString =
        orderFilterType === OrderFilterType.All ? 'Order Type' : orderFilterType === OrderFilterType.Market ? 'Market' : 'Limit';
    return (
        <>
            <div className="relative flex flex-col">
                <div
                    className={clsx(
                        'flex h-10 cursor-pointer select-none items-center justify-center gap-3 text-sm font-bold text-zinc-100 transition-all duration-300',
                        'w-20 text-2xs sm:w-28 sm:text-sm',
                        isParty
                            ? 'bg-nike-party-orange-800 hover:bg-nike-party-orange-600 rounded-2xl'
                            : isNike
                              ? 'bg-nike-orange-700 hover:bg-nike-orange-600 rounded-lg'
                              : 'rounded-lg bg-sky-700 hover:bg-sky-600'
                    )}
                    onClick={() => setIsShowingDropdown(!isShowingDropdown)}
                >
                    <div className={clsx('flex items-center')}>{orderFilterTypeString}</div>
                    <div className="flex h-full items-center justify-center pt-0.5">
                        <Image src={'/images/icons/arrow-down.png'} alt={'Arrow Down Icon'} width={12} height={12} quality={100} />
                    </div>
                </div>

                {isShowingDropdown && (
                    <div
                        onMouseLeave={() => setIsShowingDropdown(false)}
                        onClick={() => setIsShowingDropdown(false)}
                        className={clsx(
                            'absolute left-0 top-12 z-60 flex max-h-128 w-32 flex-col overflow-y-auto rounded-2xl border-2  font-bold text-white drop-shadow-black-sharp',
                            isNike ? 'border-nike-orange-600/60 bg-nike-orange-900' : 'border-sky-600/60 bg-space-950'
                        )}
                    >
                        <div
                            className={clsx(
                                'flex h-12 cursor-pointer items-center justify-start px-4 ',
                                orderFilterType === OrderFilterType.All
                                    ? isParty
                                        ? 'bg-nike-party-orange-800'
                                        : isNike
                                          ? 'bg-nike-orange-700/60'
                                          : 'bg-sky-700/60'
                                    : isParty
                                      ? 'hover:bg-nike-party-orange-800'
                                      : isNike
                                        ? 'hover:bg-nike-orange-700/60'
                                        : 'hover:bg-sky-700/60'
                            )}
                            onClick={() => {
                                setOrderFilterType(OrderFilterType.All);
                            }}
                        >
                            <div>All</div>
                        </div>
                        <div
                            className={clsx(
                                'flex h-12 cursor-pointer items-center justify-start px-4 ',
                                orderFilterType === OrderFilterType.Market
                                    ? isParty
                                        ? 'bg-nike-party-orange-800'
                                        : isNike
                                          ? 'bg-nike-orange-700/60'
                                          : 'bg-sky-700/60'
                                    : isParty
                                      ? 'hover:bg-nike-party-orange-800'
                                      : isNike
                                        ? 'hover:bg-nike-orange-700/60'
                                        : 'hover:bg-sky-700/60'
                            )}
                            onClick={() => {
                                setOrderFilterType(OrderFilterType.Market);
                            }}
                        >
                            <div>Market</div>
                        </div>
                        <div
                            className={clsx(
                                'flex h-12 cursor-pointer items-center justify-start px-4',
                                orderFilterType === OrderFilterType.Limit
                                    ? isParty
                                        ? 'bg-nike-party-orange-800'
                                        : isNike
                                          ? 'bg-nike-orange-700/60'
                                          : 'bg-sky-700/60'
                                    : isParty
                                      ? 'hover:bg-nike-party-orange-800'
                                      : isNike
                                        ? 'hover:bg-nike-orange-700/60'
                                        : 'hover:bg-sky-700/60'
                            )}
                            onClick={() => {
                                setOrderFilterType(OrderFilterType.Limit);
                            }}
                        >
                            <div>Limit</div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export const OrderStatusTypeDropdown = ({ orderStatusFilterType, isNike, isParty }: any) => {
    const [isShowingDropdown, setIsShowingDropdown] = useState(false);
    let orderStatusFilterTypeString = 'Status';
    if (orderStatusFilterType === OrderStatusFilterType.Pending) {
        orderStatusFilterTypeString = 'Pending';
    } else if (orderStatusFilterType === OrderStatusFilterType.Complete) {
        orderStatusFilterTypeString = 'Complete';
    } else if (orderStatusFilterType === OrderStatusFilterType.Cancelled) {
        orderStatusFilterTypeString = 'Cancelled';
    }
    return (
        <>
            <div className="relative flex flex-col">
                <div
                    className={clsx(
                        'flex h-10 cursor-pointer select-none items-center justify-center gap-3 text-sm font-bold text-zinc-100 transition-all duration-300',
                        'w-20 text-2xs sm:w-28 sm:text-sm',
                        isParty
                            ? 'bg-nike-party-orange-800 hover:bg-nike-party-orange-600 rounded-2xl'
                            : isNike
                              ? 'bg-nike-orange-700 hover:bg-nike-orange-600 rounded-lg'
                              : 'rounded-lg bg-sky-700 hover:bg-sky-600'
                    )}
                    onClick={() => setIsShowingDropdown(!isShowingDropdown)}
                >
                    <div className={clsx('flex items-center')}>{orderStatusFilterTypeString}</div>
                    <div className="flex h-full items-center justify-center pt-0.5">
                        <Image src={'/images/icons/arrow-down.png'} alt={'Arrow Down Icon'} width={12} height={12} quality={100} />
                    </div>
                </div>

                {isShowingDropdown && (
                    <div
                        onMouseLeave={() => setIsShowingDropdown(false)}
                        onClick={() => setIsShowingDropdown(false)}
                        className={clsx(
                            'absolute left-0 top-12 z-60 flex max-h-128 w-32 flex-col overflow-y-auto rounded-2xl border-2 font-bold text-white drop-shadow-black-sharp',
                            isParty
                                ? 'border-nike-party-orange-600/60 bg-nike-orange-600'
                                : isNike
                                  ? 'border-nike-orange-600/60 bg-nike-orange-900'
                                  : 'border-sky-600/60 bg-space-950'
                        )}
                    >
                        <div
                            className={clsx(
                                'flex h-12 cursor-pointer items-center justify-start px-4 ',
                                isParty ? 'hover:bg-nike-party-orange-800' : isNike ? 'hover:bg-nike-orange-700/60' : 'hover:bg-sky-700/60'
                            )}
                            onClick={() => {
                                setOrderStatusFilterType(OrderStatusFilterType.All);
                            }}
                        >
                            <div>All</div>
                        </div>
                        <div
                            className={clsx(
                                'flex h-12 cursor-pointer items-center justify-start px-4 ',
                                isParty ? 'hover:bg-nike-party-orange-800' : isNike ? 'hover:bg-nike-orange-700/60' : 'hover:bg-sky-700/60'
                            )}
                            onClick={() => {
                                setOrderStatusFilterType(OrderStatusFilterType.Pending);
                            }}
                        >
                            <div>Pending</div>
                        </div>
                        <div
                            className={clsx(
                                'flex h-12 cursor-pointer items-center justify-start px-4 ',
                                isParty ? 'hover:bg-nike-party-orange-800' : isNike ? 'hover:bg-nike-orange-700/60' : 'hover:bg-sky-700/60'
                            )}
                            onClick={() => {
                                setOrderStatusFilterType(OrderStatusFilterType.Complete);
                            }}
                        >
                            <div>Complete</div>
                        </div>
                        <div
                            className={clsx(
                                'flex h-12 cursor-pointer items-center justify-start px-4 ',
                                isParty ? 'hover:bg-nike-party-orange-800' : isNike ? 'hover:bg-nike-orange-700/60' : 'hover:bg-sky-700/60'
                            )}
                            onClick={() => {
                                setOrderStatusFilterType(OrderStatusFilterType.Cancelled);
                            }}
                        >
                            <div>Cancelled</div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};
