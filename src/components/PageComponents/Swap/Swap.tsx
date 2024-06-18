import { SwapOrderBook } from '@/components/PageComponents/Swap/OrderBookElements/SwapOrderBook';
import { SwapSettings } from '@/components/PageComponents/Swap/SettingsElements/Settings';
import { SwapButton } from '@/components/PageComponents/Swap/SwapElements/Buttons/SwapButton';
import { SwitchButton } from '@/components/PageComponents/Swap/SwapElements/Buttons/SwitchButton';
import { LimitInfoBox } from '@/components/PageComponents/Swap/SwapElements/LimitInfoBox';
import { SwapNavbar } from '@/components/PageComponents/Swap/SwapElements/SwapNavbar';
import { flattenPoolUtxosPages, handleKeyDown } from '@/components/PageComponents/Swap/Utils/GeneralUtils';
import {
    InputAutomaticAdaSwapInputs,
    InputAutomaticTokenSwapInputs,
    UpdateSwapInputs,
    calculateMarketPercent,
} from '@/components/PageComponents/Swap/Utils/SwapUtils';
import { Order } from '@/components/PageComponents/Swap/Utils/TransactionUtils';
import { useGetConnectedWallet } from '@/hooks/Cardano/wallet.hooks';
import { setSwap, useGetSwap } from '@/hooks/Component/swap.hook';
import { TOKEN_SELECT_IS_OPEN_MODAL_KEY, setIsOpenModal } from '@/hooks/Modals/general-modal.hook';
import { useGetSelectedPool } from '@/hooks/Modals/pool-select-modal.hook';
import { useGetCryptocurrency } from '@/hooks/Models/cryptocurrency.hook';
import { useGetPoolUtxos } from '@/hooks/Models/poolUtxo.hook';
import { useGetBalance } from '@/hooks/Models/wallet.hook';
import { OrderType } from '@/types/Enums/OrderType';
import { SwapType } from '@/types/Enums/SwapType';
import { GraphQLParameters } from '@/types/GraphQL/GraphQLParameters';
import { isHttpsURL, isLocalURL } from '@/utils/image';
import clsx from 'clsx';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export const Swap = ({ isTransparent = false, animate = false, isPro = false }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [swapType, setSwapType] = useState(SwapType.Market);
    const [orderType, setOrderType] = useState(OrderType.Buy);
    const [showOrderBook, setShowOrderBook] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    const { data: connectedWallet }: any = useGetConnectedWallet();
    const address = connectedWallet?.address ? connectedWallet.address : '';

    // Get Swap data and rest the swap data on component mount
    useEffect(() => {
        setSwap({
            tokenAmountSell: 0,
            tokenAmountBuy: 0,
            tokenSellUpdated: false,
            tokenBuyUpdated: false,
        });
    }, []);
    const { data: swap }: any = useGetSwap();

    const { data: pool }: any = useGetSelectedPool();
    const tokenProjectOne = pool?.token_project_one;
    const tokenProjectTwo = pool?.token_project_two;
    const tokenTwoName = tokenProjectTwo?.name;
    const tokenTwoImage =
        isHttpsURL(tokenProjectTwo?.image) || isLocalURL(tokenProjectTwo?.image) ? tokenProjectTwo.image : '/images/SaturnSwapLogo.png';

    const isTokenSelected = !!pool && !!pool?.id;

    const minTokenAmountAda = 10 * 1000000;
    const pageSize = 50;
    const limitBuyParameters: GraphQLParameters = {
        first: pageSize,
        where: FilterBuys(pool, minTokenAmountAda, address),
        order: '{ price: DESC }',
    };
    const limitSellParameters: GraphQLParameters = {
        first: pageSize,
        where: FilterSells(pool, minTokenAmountAda, address),
        order: '{ price: ASC }',
    };

    const {
        data: limitBuyPoolUtxosPages,
        fetchNextPage: fetchNextBuyPage,
        hasNextPage: hasNextBuyPage,
    }: any = useGetPoolUtxos(limitBuyParameters, isTokenSelected && !!pool?.id);
    const {
        data: limitSellPoolUtxosPages,
        fetchNextPage: fetchNextSellPage,
        hasNextPage: hasNextSellPage,
    }: any = useGetPoolUtxos(limitSellParameters, isTokenSelected && !!pool?.id);
    const utxoOrderBookData = {
        limitBuyPoolUtxosPages,
        fetchNextBuyPage,
        hasNextBuyPage,
        buyPageSize: pageSize,
        limitSellPoolUtxosPages,
        fetchNextSellPage,
        hasNextSellPage,
        sellPageSize: pageSize,
    };

    const flattenedBuyPoolUtxos = flattenPoolUtxosPages(limitBuyPoolUtxosPages);
    const flattenedSellPoolUtxos = flattenPoolUtxosPages(limitSellPoolUtxosPages);

    const largestBuy = limitBuyPoolUtxosPages?.pages?.[0]?.edges?.[0]?.node;
    const largestSell = limitSellPoolUtxosPages?.pages?.[0]?.edges?.[0]?.node;

    // Aggregated Utxos
    const tokenAmountSell = swap?.tokenAmountSell ? swap.tokenAmountSell : 0;
    const tokenAmountBuy = swap?.tokenAmountBuy ? swap.tokenAmountBuy : 0;
    const isTokenSellUpdate = swap?.isTokenSellUpdate ? swap.isTokenSellUpdate : false;
    const isTokenBuyUpdate = swap?.isTokenBuyUpdate ? swap.isTokenBuyUpdate : false;
    const tokenSellPreviouslyUpdated = swap?.tokenSellPreviouslyUpdated ? swap.tokenSellPreviouslyUpdated : false;
    const tokenBuyPreviouslyUpdated = swap?.tokenBuyPreviouslyUpdated ? swap.tokenBuyPreviouslyUpdated : false;

    // Market buy price is the largest sell order
    // Market sell price is the largest buy order
    const marketBuyPrice = largestSell?.price ? largestSell.price : 0;
    const marketSellPrice = largestBuy?.price ? largestBuy.price : 0;
    const limitBuyPrice = !tokenAmountBuy ? marketBuyPrice * 0.999 : tokenAmountSell / tokenAmountBuy;
    const limitSellPrice = !tokenAmountSell ? marketSellPrice * 1.001 : tokenAmountBuy / tokenAmountSell;
    let percentOfBuyMarketPrice = marketBuyPrice === 0 ? 1000 : (limitBuyPrice / marketBuyPrice - 1) * 100;
    let percentOfSellMarketPrice = marketSellPrice === 0 ? 1000 : (limitSellPrice / marketSellPrice - 1) * 100;
    const marketPrice = orderType === OrderType.Buy ? marketBuyPrice : marketSellPrice;
    const precision = tokenProjectTwo?.precision ?? 4;

    const isMarket = swapType === SwapType.Market;
    const isBuy = orderType === OrderType.Buy;
    const adaAmount = isBuy ? tokenAmountSell : tokenAmountBuy;
    const isButtonDisabled =
        tokenAmountSell <= 0 ||
        tokenAmountBuy <= 0 ||
        (adaAmount < 200 && swapType === SwapType.Limit) ||
        (adaAmount < 10 && swapType === SwapType.Market) ||
        swap?.isAboveBalance;
    const percentString = calculateMarketPercent(isBuy, marketBuyPrice, marketSellPrice, percentOfBuyMarketPrice, percentOfSellMarketPrice);

    const fullHeight = swapType === SwapType.Limit && isTokenSelected;
    const noMarketBuyOrders = isMarket && isBuy && isTokenSelected && !largestSell; // We are buying limit sell order
    const noMarketSellOrders = isMarket && !isBuy && isTokenSelected && !largestBuy; // We are selling limit buy order

    // Create refs for the input fields
    const input1Ref = useRef<HTMLInputElement>(null);
    const input2Ref = useRef<HTMLInputElement>(null);

    const assetOne = !!tokenProjectOne?.policy_id ? `${tokenProjectOne?.policy_id}${tokenProjectOne?.asset_name}` : null;
    const { data: balanceTokenProjectOne }: any = useGetBalance(assetOne, tokenProjectOne?.decimals ?? 6);

    const assetTwo = !!tokenProjectTwo?.policy_id ? `${tokenProjectTwo?.policy_id}${tokenProjectTwo?.asset_name}` : null;
    const { data: balanceTokenProjectTwo }: any = useGetBalance(assetTwo, tokenProjectTwo?.decimals ?? 6);

    const showSelectTokenWarning = !isTokenSelected && (isTokenBuyUpdate || isTokenSellUpdate);

    const handleSwapKeyPress = async (event: any) => {
        handleKeyPress(event, input1Ref, input2Ref, pool, swapType, orderType, setIsLoading, isButtonDisabled);
    };

    const correctdTokenAmountBuy = tokenAmountBuy && tokenAmountBuy != 0 ? tokenAmountBuy : '';
    const correctedTokenAmountSell = tokenAmountSell && tokenAmountSell != 0 ? tokenAmountSell : '';
    const tokenSellValue = isBuy ? correctedTokenAmountSell : correctdTokenAmountBuy;
    const tokenBuyValue = isBuy ? correctdTokenAmountBuy : correctedTokenAmountSell;

    const { data: cardanoCrypto }: any = useGetCryptocurrency({
        where: `{ name: { eq: "Cardano" } }`,
    });

    let cardanoToUSD = 0;
    if (cardanoCrypto) {
        cardanoToUSD = cardanoCrypto[0].price;
    }

    return (
        <>
            <div
                className={clsx(
                    'relative z-10 mx-4 w-80 rounded-3xl',
                    'sm:w-112',
                    'shadow-full-sky-3xl-900',
                    { 'h-104': !fullHeight },
                    { 'h-144': fullHeight },
                    animate
                        ? isTransparent
                            ? 'opacity-100 xl:animate-light-fade-out xl:opacity-75'
                            : 'opacity-100 xl:animate-light-fade-in'
                        : isTransparent
                          ? 'opacity-100 xl:opacity-75'
                          : 'opacity-100'
                )}
            >
                <div
                    className={clsx(
                        'flex flex-col gap-4 rounded-3xl border-2 border-sky-600/60 bg-space-950 p-4 text-white',
                        isPro ? 'sm:w-100' : 'sm:w-112',
                        { 'h-104': !fullHeight },
                        { 'h-144': fullHeight }
                    )}
                >
                    {!showSettings && (
                        <>
                            <SwapNavbar
                                swapType={swapType}
                                setSwapType={setSwapType}
                                showOrderBook={showOrderBook}
                                setShowOrderBook={setShowOrderBook}
                                showSettings={showSettings}
                                setShowSettings={setShowSettings}
                                isPro={isPro}
                            />
                            <div
                                className={clsx('relative flex w-full gap-4', {
                                    'flex-col': isBuy,
                                    'flex-col-reverse': !isBuy,
                                })}
                            >
                                <>
                                    <SwitchButton orderType={orderType} setOrderType={setOrderType} />
                                </>
                                <div
                                    className={clsx(
                                        'flex h-30 w-full flex-none gap-2 rounded-xl border border-sky-600/60 bg-space-700 p-3',
                                        'transition-all duration-300 hover:border-sky-400/60'
                                    )}
                                >
                                    <div className="flex w-28 flex-grow flex-col justify-center sm:w-48">
                                        <label
                                            htmlFor={isBuy ? 'token_amount_sell' : 'token_amount_buy'}
                                            className="text-sm font-semibold text-sky-200"
                                        >
                                            {isBuy ? 'You pay' : 'You receive'}
                                        </label>
                                        <input
                                            id={isBuy ? 'token_amount_sell' : 'token_amount_buy'}
                                            name={isBuy ? 'token_amount_sell' : 'token_amount_buy'}
                                            type="number"
                                            lang="en-US"
                                            step="0.01"
                                            min="0.00"
                                            className={clsx(
                                                'flex h-16 items-center border-0 bg-transparent p-0 text-4xl font-bold placeholder:text-zinc-300',
                                                'placeholder:text-sky-200/80 focus:ring-0 focus:ring-sky-400'
                                            )}
                                            onKeyDown={handleSwapKeyPress}
                                            ref={input1Ref}
                                            onInput={() =>
                                                UpdateSwapInputs(
                                                    swapType,
                                                    orderType,
                                                    tokenProjectOne,
                                                    tokenProjectTwo,
                                                    flattenedBuyPoolUtxos,
                                                    flattenedSellPoolUtxos,
                                                    marketPrice,
                                                    isBuy ? true : false,
                                                    isBuy ? false : true,
                                                    tokenSellPreviouslyUpdated,
                                                    tokenBuyPreviouslyUpdated,
                                                    balanceTokenProjectOne,
                                                    balanceTokenProjectTwo,
                                                    address
                                                )
                                            }
                                            autoComplete="off"
                                            placeholder="0"
                                            value={tokenSellValue}
                                        />
                                        <div
                                            className={clsx(
                                                'h-3 font-semibold text-zinc-300',
                                                noMarketBuyOrders || showSelectTokenWarning || tokenSellValue ? '' : 'invisible',
                                                noMarketBuyOrders ? 'text-3xs' : 'text-2xs '
                                            )}
                                        >
                                            {showSelectTokenWarning
                                                ? isBuy
                                                    ? 'Please select a token to buy'
                                                    : ''
                                                : noMarketBuyOrders && !tokenBuyValue && !tokenSellValue
                                                  ? `No "Swaps" for pair, please select "Limit"`
                                                  : tokenSellValue * cardanoToUSD != 0
                                                    ? `$` + (tokenSellValue * cardanoToUSD).toFixed(2)
                                                    : ''}
                                        </div>
                                    </div>
                                    <div className="hidden grow sm:block"></div>
                                    {swap?.isAboveBalance && !(swapType == SwapType.Limit && orderType == OrderType.Sell) && (
                                        <div className="flex h-full select-none items-center justify-end">
                                            <div
                                                className={clsx(
                                                    'flex h-10 cursor-pointer items-center justify-center rounded-lg px-2 font-bold',
                                                    'border border-sky-600/60 bg-space-400 transition-all duration-300 hover:bg-sky-900'
                                                )}
                                                onClick={() =>
                                                    InputAutomaticAdaSwapInputs(
                                                        swapType,
                                                        orderType,
                                                        tokenProjectOne,
                                                        tokenProjectTwo,
                                                        flattenedBuyPoolUtxos,
                                                        flattenedSellPoolUtxos,
                                                        marketPrice,
                                                        isBuy ? true : false,
                                                        isBuy ? false : true,
                                                        tokenSellPreviouslyUpdated,
                                                        tokenBuyPreviouslyUpdated,
                                                        balanceTokenProjectOne,
                                                        balanceTokenProjectTwo,
                                                        address
                                                    )
                                                }
                                            >
                                                Max
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex h-full select-none items-center justify-end">
                                        <div
                                            className={clsx(
                                                'flex h-10 items-center justify-center rounded-lg font-bold',
                                                'border border-sky-600/60 bg-space-400 transition-all duration-300 hover:bg-sky-900'
                                            )}
                                        >
                                            <div className="flex h-10 w-10 items-center justify-center">
                                                <Image src="/images/tokens/cardano.png" alt="Cardano" width={24} height={24} />
                                            </div>
                                            <div>ADA</div>
                                            <div className="flex h-10 w-2 items-center justify-center"></div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className={clsx(
                                        'flex h-30 w-full flex-none gap-2 rounded-xl border border-sky-600/60 bg-space-700 p-3',
                                        'transition-all duration-300 hover:border-sky-400/60'
                                    )}
                                >
                                    <div className="flex w-28 flex-col justify-center sm:w-40">
                                        <label
                                            htmlFor={isBuy ? 'token_amount_buy' : 'token_amount_sell'}
                                            className="w-40 text-sm font-semibold text-sky-200"
                                        >
                                            {isBuy ? 'You receive' : 'You pay'}
                                        </label>

                                        <input
                                            id={isBuy ? 'token_amount_buy' : 'token_amount_sell'}
                                            name={isBuy ? 'token_amount_buy' : 'token_amount_sell'}
                                            type="number"
                                            lang="en-US"
                                            step="0.01"
                                            min="0.00"
                                            className={clsx(
                                                'flex h-16 items-center border-0 bg-transparent p-0 text-4xl font-bold placeholder:text-zinc-300',
                                                'placeholder:text-sky-200/80 focus:ring-0 focus:ring-sky-400'
                                            )}
                                            onKeyDown={handleSwapKeyPress}
                                            ref={input2Ref}
                                            onInput={() =>
                                                UpdateSwapInputs(
                                                    swapType,
                                                    orderType,
                                                    tokenProjectOne,
                                                    tokenProjectTwo,
                                                    flattenedBuyPoolUtxos,
                                                    flattenedSellPoolUtxos,
                                                    marketPrice,
                                                    isBuy ? false : true, //tokenSellUpdated
                                                    isBuy ? true : false, //tokenBuyUpdated
                                                    tokenSellPreviouslyUpdated,
                                                    tokenBuyPreviouslyUpdated,
                                                    balanceTokenProjectOne,
                                                    balanceTokenProjectTwo,
                                                    address
                                                )
                                            }
                                            autoComplete="off"
                                            placeholder="0"
                                            value={tokenBuyValue}
                                        />
                                        <div
                                            className={clsx(
                                                'h-3 font-semibold text-zinc-300',
                                                noMarketSellOrders || showSelectTokenWarning || tokenSellValue ? '' : 'invisible',
                                                noMarketSellOrders ? 'text-3xs' : 'text-2xs '
                                            )}
                                        >
                                            {showSelectTokenWarning
                                                ? !isBuy
                                                    ? 'Please select a token to sell'
                                                    : ''
                                                : noMarketSellOrders && !tokenBuyValue && !tokenSellValue
                                                  ? `No "Swaps" for pair, please select "Limit"`
                                                  : tokenBuyValue * marketPrice * cardanoToUSD != 0
                                                    ? `$` + (tokenBuyValue * marketPrice * cardanoToUSD).toFixed(2)
                                                    : ''}
                                        </div>
                                    </div>
                                    <div className="grow"></div>
                                    {swap?.isAboveBalance && !(swapType == SwapType.Limit && orderType == OrderType.Buy) && (
                                        <div className="flex h-full select-none items-center justify-end">
                                            <div
                                                className={clsx(
                                                    'flex h-10 cursor-pointer items-center justify-center rounded-lg px-2 font-bold',
                                                    'border border-sky-600/60 bg-space-400 transition-all duration-300 hover:bg-sky-900'
                                                )}
                                                onClick={() =>
                                                    InputAutomaticTokenSwapInputs(
                                                        swapType,
                                                        orderType,
                                                        tokenProjectOne,
                                                        tokenProjectTwo,
                                                        flattenedBuyPoolUtxos,
                                                        flattenedSellPoolUtxos,
                                                        marketPrice,
                                                        isBuy ? false : true, //tokenSellUpdated
                                                        isBuy ? true : false, //tokenBuyUpdated
                                                        tokenSellPreviouslyUpdated,
                                                        tokenBuyPreviouslyUpdated,
                                                        balanceTokenProjectOne,
                                                        balanceTokenProjectTwo,
                                                        address
                                                    )
                                                }
                                            >
                                                Max
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex h-full select-none items-center justify-end">
                                        <div
                                            onClick={() => setIsOpenModal(TOKEN_SELECT_IS_OPEN_MODAL_KEY, true)}
                                            className={clsx(
                                                'flex h-10 cursor-pointer items-center justify-center rounded-lg pl-2 font-bold',
                                                'border border-sky-600/60 bg-space-400 transition-all duration-300 hover:bg-sky-900'
                                            )}
                                        >
                                            {isTokenSelected ? (
                                                <>
                                                    <div className="flex h-10 w-10 items-center justify-center">
                                                        <Image src={tokenTwoImage} alt="Cardano" width={24} height={24} />
                                                    </div>
                                                    <div className="max-w-16 overflow-clip whitespace-nowrap">{tokenTwoName}</div>
                                                    <div className="flex h-10 w-6 items-center justify-center">
                                                        <Image src="/images/icons/arrow-down.png" alt="Arrow Down" width={10} height={10} />
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="hidden sm:block">Select Token</div>
                                                    <div className="text-sm sm:hidden">Select Token</div>
                                                    <div className="flex h-10 w-6 items-center justify-center">
                                                        <Image src="/images/icons/arrow-down.png" alt="Arrow Down" width={10} height={10} />
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {isTokenSelected && swapType === SwapType.Limit && (
                                <LimitInfoBox
                                    isBuy={isBuy}
                                    limitSellPrice={limitSellPrice}
                                    limitBuyPrice={limitBuyPrice}
                                    marketSellPrice={marketSellPrice}
                                    marketBuyPrice={marketBuyPrice}
                                    percentString={percentString}
                                    precision={precision}
                                />
                            )}
                            <>
                                <SwapButton
                                    pool={pool}
                                    swapType={swapType}
                                    orderType={orderType}
                                    adaAmount={adaAmount}
                                    isButtonDisabled={isButtonDisabled}
                                    isLoading={isLoading}
                                    setIsLoading={setIsLoading}
                                    isAboveBalance={swap?.isAboveBalance}
                                />
                            </>
                        </>
                    )}
                    {showSettings && (
                        <>
                            <SwapSettings setShowSettings={setShowSettings} />
                        </>
                    )}
                </div>
                <SwapOrderBook
                    pool={pool}
                    tokenProjectOne={tokenProjectOne}
                    tokenProjectTwo={tokenProjectTwo}
                    address={address}
                    swapType={swapType}
                    isTokenSelected={isTokenSelected}
                    isEnabled={showOrderBook}
                    utxoOrderBookData={utxoOrderBookData}
                />
            </div>
        </>
    );
};

// Handle key press event
export const handleKeyPress = async (
    event: any,
    input1Ref: any,
    input2Ref: any,
    pool: any,
    swapType: any,
    orderType: any,
    setIsLoading: any,
    isButtonDisabled: any
) => {
    // Check if the pressed key is the Tab key
    if (event.key === 'Tab') {
        // Prevent the default Tab behavior
        event.preventDefault();

        // Get the currently focused element
        const focusedElement = document.activeElement;

        // Check if input1 is focused
        if (focusedElement === input1Ref.current) {
            // Check if input2 ref is not null
            if (input2Ref.current) {
                // Focus on input2
                input2Ref.current.focus();
            }
        } else if (focusedElement === input2Ref.current) {
            // Check if input1 ref is not null
            if (input1Ref.current) {
                // Focus on input1
                input1Ref.current.focus();
            }
        }
    } else if (event.key === 'Enter') {
        event.preventDefault();
        if (!isButtonDisabled) {
            //call swap
            setIsLoading(true);
            await Order(pool, swapType, orderType, setSwap);
            setIsLoading(false);
        } else {
            // Get the currently focused element
            const focusedElement = document.activeElement;

            // Check if input1 is focused
            if (focusedElement === input1Ref.current) {
                // Check if input2 ref is not null
                if (input2Ref.current) {
                    // Focus on input2
                    input2Ref.current.focus();
                }
            } else if (focusedElement === input2Ref.current) {
                // Check if input1 ref is not null
                if (input1Ref.current) {
                    // Focus on input1
                    input1Ref.current.focus();
                }
            }
        }
    } else {
        handleKeyDown(event);
    }
};

export const FilterBuys = (pool: any, minTokenAmountAda: any, address: any) => {
    const filter = `{
        pool_id: { eq: "${pool?.id}"},
        token_amount_sell: { gte: ${minTokenAmountAda} },
        active_type: { eq: LIMIT_BUY_ORDER },
        active_status: { eq: COMPLETE },
        and: [
            {
                spend_status: { nin: [SUBMITTING_TRANSACTION, PENDING, PENDING_SUBMIT, COMPLETE] }
            },
            {
                or: [
                    {
                        spend_status: { nin: [CREATING_TRANSACTION, AWAITING_SIGNATURE] }
                    },
                    {
                        spend_user_address: { eq: "${address}" }
                    }
                ]
            }
        ]
    }`;
    return filter;
};

export const FilterSells = (pool: any, minTokenAmountAda: any, address: any) => {
    const filter = `{
            pool_id: { eq: "${pool?.id}"},
            token_amount_buy: { gte: ${minTokenAmountAda} },
            active_type: { eq: LIMIT_SELL_ORDER },
            active_status: { eq: COMPLETE },
            and: [
                {
                    spend_status: { nin: [SUBMITTING_TRANSACTION, PENDING, PENDING_SUBMIT, COMPLETE] }
                },
                {
                    or: [
                        {
                            spend_status: { nin: [CREATING_TRANSACTION, AWAITING_SIGNATURE] }
                        },
                        {
                            spend_user_address: { eq: "${address}" }
                        }
                    ]
                }
            ]
        }`;
    return filter;
};
