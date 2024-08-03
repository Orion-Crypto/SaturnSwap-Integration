import { queryPool } from '@/api/GraphQL/Pool/Query';
import { CardanoscanButton } from '@/components/Elements/Buttons/CardanoscanButton';
import { DeleteButton } from '@/components/Elements/Buttons/DeleteButton';
import { SubPrice } from '@/components/Elements/Price';
import { ProgressBar } from '@/components/Elements/ProgressBar';
import { Spinner } from '@/components/Elements/Spinner';
import { CalculatePercent, getOrderContainerWidths, getOrderType, getStatus } from '@/components/PageComponents/Order/Utils/OrderUtils';
import { setSelectedPool } from '@/hooks/Modals/pool-select-modal.hook';
import { BASE_POOL_UTXO_KEY } from '@/hooks/Models/poolUtxo.hook';
import { queryClient } from '@/hooks/default';
import { getTransactionUrl } from '@/utils/cardano/transaction';
import { formatTokenValue } from '@/utils/number';
import { timeAgoShorthand } from '@/utils/time';
import { CancelV1Transaction } from '@/utils/transaction/Order/Cancel/CancelV1Transaction';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export const OrderRow = ({ order, address = null, preselectedPool = null, isPro = false, isNike = false, isParty = false }: any) => {
    const [isCancelLoading, setIsCancelLoading] = useState(false);
    const txHash = order.spend_tx_hash ? order.spend_tx_hash : order.tx_hash;
    const transactionURL = getTransactionUrl(txHash);

    const isUserAddress = !!address && order.user_address === address;
    const isLimit = order.order_type === 'LIMIT_ORDER';
    const isCancelled = order.order_type === 'CANCEL';

    let isBuy = true;
    if (isLimit && order.active_type === 'LIMIT_BUY_ORDER') isBuy = true;
    else if (isLimit && order.active_type === 'LIMIT_SELL_ORDER') isBuy = false;
    else if (!isLimit && order.spend_type === 'MARKET_BUY_ORDER') isBuy = true;
    else if (!isLimit && order.spend_type === 'MARKET_SELL_ORDER') isBuy = false;

    let pool = order.pool;
    let tokenProjectSell = order.token_project_one;
    let tokenProjectBuy = order.token_project_two;
    let tokenProjectAda = order.token_project_one;
    let tokenProjectOther = order.token_project_two;

    let precision = tokenProjectOther?.precision;
    let adaAmount = 0;
    let otherAmount = 0;
    if (isBuy && isLimit) {
        tokenProjectSell = order.token_project_one;
        tokenProjectBuy = order.token_project_two;

        adaAmount = order.split_token_amount_sell != null ? order.split_token_amount_sell : order.token_amount_sell;
        otherAmount = order.split_token_amount_buy != null ? order.split_token_amount_buy : order.token_amount_buy;
    } else if (!isBuy && isLimit) {
        tokenProjectSell = order.token_project_two;
        tokenProjectBuy = order.token_project_one;

        adaAmount = order.split_token_amount_buy != null ? order.split_token_amount_buy : order.token_amount_buy;
        otherAmount = order.split_token_amount_sell != null ? order.split_token_amount_sell : order.token_amount_sell;
    } else if (isBuy && !isLimit) {
        tokenProjectSell = order.token_project_one;
        tokenProjectBuy = order.token_project_two;

        adaAmount = order.split_token_amount_buy != null ? order.split_token_amount_buy : order.token_amount_buy;
        otherAmount = order.split_token_amount_sell != null ? order.split_token_amount_sell : order.token_amount_sell;
    } else if (!isBuy && !isLimit) {
        tokenProjectSell = order.token_project_two;
        tokenProjectBuy = order.token_project_one;

        adaAmount = order.split_token_amount_sell != null ? order.split_token_amount_sell : order.token_amount_sell;
        otherAmount = order.split_token_amount_buy != null ? order.split_token_amount_buy : order.token_amount_buy;
    }

    const adaAmountNormalized = adaAmount / Math.pow(10, tokenProjectAda.decimals);
    const percent = CalculatePercent(adaAmountNormalized);

    const columnSizes: any = getOrderContainerWidths(isPro);

    const orderType = getOrderType(order, address);
    const status = getStatus(order);
    const timeAgo = isLimit || isCancelled ? timeAgoShorthand(order.active_status_timestamp) : timeAgoShorthand(order.spend_status_timestamp);
    const canCancel = isUserAddress && isLimit;

    const isActive = status === 'Active';
    const isPending = status === 'Pending';
    const isComplete = status === 'Complete';
    return (
        <>
            <div
                className={clsx(
                    ' h-14 border-t px-12 py-2',
                    preselectedPool || isPro ? 'grid grid-cols-8 gap-4' : 'flex w-360 justify-start ',
                    isParty ? 'border-nike-orange-500' : isNike ? 'border-nike-orange-600/60' : 'border-sky-600/60'
                )}
            >
                <div
                    className={clsx(
                        'flex flex-none items-center justify-start text-center text-xs font-semibold',
                        !!preselectedPool ? '' : columnSizes.timeSize
                    )}
                >
                    {timeAgo}
                </div>
                <div
                    className={clsx(
                        'flex flex-none items-center justify-start text-center text-xs font-semibold',
                        !!preselectedPool ? 'hidden' : columnSizes.pairSize
                    )}
                >
                    <OrderPair pool={pool} tokenProjectSell={tokenProjectSell} tokenProjectBuy={tokenProjectBuy} isNike={isNike} />
                </div>
                <div className={clsx('flex flex-none items-center justify-start font-bold', !!preselectedPool ? '' : columnSizes.typeSize)}>
                    {isBuy ? <div className="text-green-400">Buy</div> : <div className="text-red-400">Sell</div>}
                </div>

                <OrderSize
                    tokenProject={tokenProjectAda}
                    tokenAmount={adaAmount}
                    isBuy={isBuy}
                    percent={percent}
                    columnSize={columnSizes.sizeAdaSize}
                    isParty={isParty}
                />
                <OrderSize
                    tokenProject={tokenProjectOther}
                    tokenAmount={otherAmount}
                    isBuy={isBuy}
                    percent={percent}
                    columnSize={columnSizes.sizeTokenSize}
                    isParty={isParty}
                />

                <div
                    className={clsx(
                        'flex flex-none items-center justify-start text-xs font-semibold',
                        !!preselectedPool ? '' : columnSizes.priceSize
                    )}
                >
                    {SubPrice(order.price, precision, '', ' ADA')}
                </div>

                <div
                    className={clsx(
                        'flex flex-none items-center justify-start text-xs font-semibold',
                        !!preselectedPool ? '' : columnSizes.orderTypeSize
                    )}
                >
                    {orderType}
                </div>

                <div
                    className={clsx(
                        'flex flex-none items-center justify-start text-xs font-semibold',
                        isCancelled && 'text-red-400',
                        isActive && 'text-yellow-400',
                        isPending && 'animate-light-blink text-yellow-400',
                        isComplete && 'text-green-400',
                        !!preselectedPool ? '' : columnSizes.statusSize
                    )}
                >
                    {status}
                </div>

                <div className={clsx('flex flex-none items-center justify-center gap-3', !!preselectedPool ? '' : columnSizes.actionSize)}>
                    {canCancel && (
                        <div
                            onClick={async () => {
                                setIsCancelLoading(true);
                                await cancelOrder(order);
                                setIsCancelLoading(false);
                            }}
                            className={clsx(
                                'flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border  transition-all duration-300',
                                '',
                                isNike ? 'border-nike-orange-600/60 hover:bg-nike-orange-700/60' : 'border-sky-600/60 hover:bg-sky-700/60'
                            )}
                        >
                            {isCancelLoading ? <Spinner color={'sky'} /> : <DeleteButton isNike={isNike} />}
                        </div>
                    )}
                    <Link
                        href={transactionURL}
                        target="_blank"
                        className={clsx(
                            'flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border  transition-all duration-300',
                            isParty
                                ? 'border-nike-party-orange-700/60 hover:bg-nike-orange-700/60'
                                : isNike
                                  ? 'border-nike-orange-600/60 hover:bg-nike-orange-700/60'
                                  : 'border-sky-600/60 hover:bg-sky-700/60'
                        )}
                    >
                        <CardanoscanButton isNike={isNike} />
                    </Link>
                </div>
            </div>
        </>
    );
};

// Cancel Orders

export const cancelOrder = async (order: any) => {
    await CancelV1Transaction([order]);
    queryClient.invalidateQueries({ queryKey: [BASE_POOL_UTXO_KEY, 'infinite'] });
};

// Orders Row Elements
export const OrderPair = ({ pool, tokenProjectSell, tokenProjectBuy, isNike }: any) => {
    const [isPoolLoading, setIsPoolLoading] = useState(false);
    return (
        <>
            <div
                className={clsx(
                    'flex cursor-pointer items-center rounded-lg p-2 text-sm transition-all duration-300',
                    isNike ? 'hover:bg-nike-orange-500' : 'hover:bg-sky-700 active:bg-sky-600',
                    isPoolLoading ? 'w-32 justify-center' : 'justify-start'
                )}
                onClick={async () => {
                    if (!pool || !pool.id) return;

                    setIsPoolLoading(true);
                    const poolObj = await queryPool(pool.id);
                    setSelectedPool(poolObj);
                    setIsPoolLoading(false);
                }}
            >
                {isPoolLoading ? (
                    <Spinner />
                ) : (
                    <>
                        <div className="flex items-center justify-start gap-2">
                            <div className="flex h-6 w-6 flex-none">
                                <Image src={tokenProjectSell.image} alt={tokenProjectSell.ticker} width={32} height={32} quality={100} />
                            </div>
                            <div className="font-semibold">{tokenProjectSell.ticker}</div>
                        </div>

                        <div className="flex h-full w-6 -rotate-90 items-center justify-center text-gray-600">
                            <Image src={'/images/icons/arrow-down.png'} alt={'Arrow'} width={10} height={10} quality={100} />
                        </div>

                        <div className="flex items-center justify-center gap-2">
                            <div className="flex h-6 w-6 flex-none">
                                <Image src={tokenProjectBuy.image} alt={tokenProjectBuy.ticker} width={32} height={32} quality={100} />
                            </div>
                            <div className="font-semibold">{tokenProjectBuy.ticker}</div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export const OrderSize = ({ tokenProject, tokenAmount, isBuy, percent, columnSize, isParty }: any) => {
    const formattedTokenAmount = formatTokenValue(tokenAmount, tokenProject.decimals);

    const progressFillBackground = isBuy ? 'bg-green-400' : 'bg-red-400';
    const progressBackground = isParty ? 'bg-neutral-900' : 'bg-neutral-600';
    return (
        <>
            <div className={clsx('flex flex-none flex-col items-start justify-center gap-1 font-semibold ', columnSize)}>
                <div className="flex w-full justify-start gap-1 text-center text-xs">
                    <div className="">{formattedTokenAmount}</div>
                    <div className="">{tokenProject.ticker}</div>
                </div>
                <div className="flex h-1 w-1/4 justify-start">
                    <ProgressBar bgColor={progressBackground} progressColor={progressFillBackground} countdown={percent} maxCountdown={100} />
                </div>
            </div>
        </>
    );
};
