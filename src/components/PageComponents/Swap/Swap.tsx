import { SwapOrderBook } from '@/components/PageComponents/Swap/OrderBookElements/SwapOrderBook';
import { SwapSettings } from '@/components/PageComponents/Swap/SettingsElements/Settings';
import { BalanceOneSection, BalanceTwoSection } from '@/components/PageComponents/Swap/SwapElements/BalanceSection';
import { SwapButton } from '@/components/PageComponents/Swap/SwapElements/Buttons/SwapButton';
import { SwitchButton } from '@/components/PageComponents/Swap/SwapElements/Buttons/SwitchButton';
import { LimitInfoBox } from '@/components/PageComponents/Swap/SwapElements/LimitInfoBox';
import { SwapNavbar } from '@/components/PageComponents/Swap/SwapElements/SwapNavbar';
import { SwapPriceComponent } from '@/components/PageComponents/Swap/SwapElements/SwapPriceComponent';
import { flattenPoolUtxosPages } from '@/components/PageComponents/Swap/Utils/GeneralUtils';
import { CalculateMarketPercent } from '@/components/PageComponents/Swap/Utils/SwapUtils/LimitSwapUtils';
import { UpdateSwapInputs } from '@/components/PageComponents/Swap/Utils/SwapUtils/SwapUtils';
import { Order } from '@/components/PageComponents/Swap/Utils/TransactionUtils';
import { useGetBalance, useGetConnectedWallet } from '@/hooks/Cardano/wallet.hooks';
import { useGetShowOrderBookSwap } from '@/hooks/Component/order-book.hook';
import { setSwap, useGetSwap } from '@/hooks/Component/swap.hook';
import { TOKEN_SELECT_IS_OPEN_MODAL_KEY, setIsOpenModal } from '@/hooks/Modals/general-modal.hook';
import { useGetSelectedPool } from '@/hooks/Modals/pool-select-modal.hook';
import { useGetCryptocurrency } from '@/hooks/Models/cryptocurrency.hook';
import { useGetPools } from '@/hooks/Models/pool.hook';
import { BASE_POOL_UTXO_KEY, ORDER_BOOK_POOL_UTXO_KEY, useGetPoolUtxos } from '@/hooks/Models/poolUtxo.hook';
import { BASE_WALLET_KEY } from '@/hooks/Models/wallet.hook';
import { queryClient } from '@/hooks/default';
import { OrderType } from '@/types/Enums/OrderType';
import { SwapType } from '@/types/Enums/SwapType';
import { GraphQLParameters } from '@/types/GraphQL/GraphQLParameters';
import { getNikePoolName } from '@/utils/hostname';
import { isHttpsURL, isLocalURL } from '@/utils/image';
import { convertStringToNumber } from '@/utils/number';
import clsx from 'clsx';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export const Swap = ({ isTransparent = false, animate = false, isNike = false, isPro = false, preselectedPool = null, isParty = false }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [swapType, setSwapType] = useState(SwapType.Market);
    const [orderType, setOrderType] = useState(OrderType.Buy);
    const [showSettings, setShowSettings] = useState(false);

    const { data: connectedWallet }: any = useGetConnectedWallet();
    const address = connectedWallet?.address ? connectedWallet.address : '';

    const { data: showOrderBook }: any = useGetShowOrderBookSwap();

    // Check if the page is the swap page or the home page
    const [isSwapPage, setIsSwapPage] = useState(false);
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsSwapPage(window.location.pathname === '/swap');
        }
    }, []);

    // Get Swap data and rest the swap data on component mount
    useEffect(() => {
        setSwap({
            tokenAmountSell: '0',
            tokenAmountBuy: '0',
            tokenSellUpdated: false,
            tokenBuyUpdated: false,
        });
    }, []);
    const { data: swap }: any = useGetSwap();

    let { data: pool }: any = useGetSelectedPool();

    // Nike Functions
    const nikePoolName = getNikePoolName();
    const nikePageSize = 1;
    const { data: nikePools, isLoading: isNikePoolsLoading }: any = useGetPools({
        first: nikePageSize,
        where: `{ name: { eq: "${nikePoolName}" } }`,
        order: '[{sort_order: ASC}, {created_at: ASC}]',
    });
    const nikePool = nikePools?.pages?.[0]?.edges?.[0]?.node;

    if (!pool && isNike && !isNikePoolsLoading && !isParty) {
        pool = nikePool;
    }

    // Preselected Pool Functions
    if (preselectedPool && (!isNike || isParty)) {
        pool = preselectedPool;
    }

    const tokenProjectOne = pool?.token_project_one;
    const tokenProjectTwo = pool?.token_project_two;
    const tokenTwoName = tokenProjectTwo?.name;
    const tokenTwoImage =
        isHttpsURL(tokenProjectTwo?.image) || isLocalURL(tokenProjectTwo?.image) ? tokenProjectTwo.image : '/images/SaturnSwapLogo.png';

    const isTokenSelected = !!pool && !!pool?.id;

    const pageSize = 50;
    const limitBuyParameters: GraphQLParameters = {
        first: pageSize,
        where: FilterBuys(pool, address),
        order: '{ price: DESC }',
    };
    const limitSellParameters: GraphQLParameters = {
        first: pageSize,
        where: FilterSells(pool, address),
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

    // Get Type
    const isMarket = swapType === SwapType.Market;
    const isBuy = orderType === OrderType.Buy;

    // Aggregated Utxos
    const correctedTokenAmountSell = swap?.tokenAmountSell && swap?.tokenAmountSell !== '0' ? swap.tokenAmountSell : '';
    const correctedTokenAmountBuy = swap?.tokenAmountBuy && swap?.tokenAmountBuy !== '0' ? swap.tokenAmountBuy : '';
    const tokenAmountSellString = isBuy ? correctedTokenAmountSell : correctedTokenAmountBuy;
    const tokenAmountBuyString = isBuy ? correctedTokenAmountBuy : correctedTokenAmountSell;

    const tokenAmountSell = convertStringToNumber(swap?.tokenAmountSell ? swap.tokenAmountSell : '0');
    const tokenAmountBuy = convertStringToNumber(swap?.tokenAmountBuy ? swap.tokenAmountBuy : '0');
    const tokenSellValue = isBuy ? tokenAmountSell : tokenAmountBuy;
    const tokenBuyValue = isBuy ? tokenAmountBuy : tokenAmountSell;

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

    const adaAmount = isBuy ? tokenAmountSell : tokenAmountBuy;
    const isButtonDisabled =
        tokenAmountSell <= 0 ||
        tokenAmountBuy <= 0 ||
        (adaAmount < 25 && swapType === SwapType.Limit) ||
        (adaAmount < 5 && swapType === SwapType.Market) ||
        swap?.isAboveBalance;
    const percentString = CalculateMarketPercent(isBuy, marketBuyPrice, marketSellPrice, percentOfBuyMarketPrice, percentOfSellMarketPrice);

    const fullHeight = swapType === SwapType.Limit && isTokenSelected;
    const noMarketBuyOrders = isMarket && isBuy && isTokenSelected && !largestSell; // We are buying limit sell order
    const noMarketSellOrders = isMarket && !isBuy && isTokenSelected && !largestBuy; // We are selling limit buy order

    // Create refs for the input fields
    const input1Ref = useRef<HTMLInputElement>(null);
    const input2Ref = useRef<HTMLInputElement>(null);

    const assetOne = !!tokenProjectOne?.policy_id ? `${tokenProjectOne?.policy_id}${tokenProjectOne?.asset_name}` : null;
    const { data: balanceOneData, isLoading: isLoadingBalanceTokenProjectOne }: any = useGetBalance(assetOne, tokenProjectOne?.decimals ?? 6);
    const showBalanceTokenProjectOne = balanceOneData?.showBalance ?? 0;
    const spendBalanceTokenProjectOne = balanceOneData?.spendBalance ?? 0;

    const assetTwo = !!tokenProjectTwo?.policy_id ? `${tokenProjectTwo?.policy_id}${tokenProjectTwo?.asset_name}` : null;
    const { data: balanceTwoData, isLoading: isLoadingBalanceTokenProjectTwo }: any = useGetBalance(
        assetTwo,
        tokenProjectTwo?.decimals ?? 6,
        tokenProjectTwo?.price ?? null
    );
    const showBalanceTokenProjectTwo = balanceTwoData?.showBalance ?? 0;
    const spendBalanceTokenProjectTwo = balanceTwoData?.spendBalance ?? 0;

    useEffect(() => {
        const intervalId = setInterval(() => {
            queryClient.invalidateQueries({ queryKey: [BASE_POOL_UTXO_KEY] });
            queryClient.invalidateQueries({ queryKey: [ORDER_BOOK_POOL_UTXO_KEY] });
            queryClient.invalidateQueries({ queryKey: [BASE_WALLET_KEY, 'balance'] });
        }, 10000);
        return () => clearInterval(intervalId);
    }, []);

    const showSelectTokenWarning = !isTokenSelected && (isTokenBuyUpdate || isTokenSellUpdate);

    const handleSwapKeyPress = async (event: any) => {
        handleKeyPress(event, input1Ref, input2Ref, pool, swapType, orderType, setIsLoading, showBalanceTokenProjectTwo, isButtonDisabled);
    };

    const { data: cardanoCrypto }: any = useGetCryptocurrency({
        where: `{ name: { eq: "Cardano" } }`,
    });

    let cardanoToUSD = 0;
    if (cardanoCrypto) {
        cardanoToUSD = cardanoCrypto[0].price;
    }

    // You Pay USD value
    const displayPrice = isBuy ? marketSellPrice : marketBuyPrice;
    const tokenSellUSD = tokenSellValue * cardanoToUSD;
    const tokenSellUSDString = isNaN(tokenSellUSD) || tokenSellUSD == 0 ? '' : `$${tokenSellUSD.toFixed(2)}`;

    let averagePrice = tokenSellValue / tokenBuyValue;
    averagePrice = isNaN(averagePrice) || 0 ? displayPrice : averagePrice;
    let valuePrice = tokenProjectTwo?.is_current_liftoff ? averagePrice : displayPrice;

    const tokenBuyUSD = tokenBuyValue * valuePrice * cardanoToUSD;
    const tokenBuyUSDString = isNaN(tokenBuyUSD) || tokenBuyUSD == 0 ? '' : `$${tokenBuyUSD.toFixed(2)}`;

    const backgroundColor = isParty
        ? 'bg-nike-orange-900 border-nike-orange-500 rounded-3xl'
        : isNike
          ? 'border-nike-orange-600/60 bg-nike-orange-900'
          : 'border-sky-600/60 bg-space-950';
    return (
        <>
            <div
                className={clsx(
                    'relative z-10 w-80 rounded-3xl',
                    isPro ? 'sm:w-100' : 'sm:w-112',
                    isPro ? '' : isParty ? '' : isNike ? 'shadow-full-nike-orange-3xl-500' : 'shadow-full-sky-3xl-900',
                    isPro ? { 'h-144': !fullHeight } : { 'h-107': !fullHeight },
                    isPro ? { 'h-148': fullHeight } : { 'h-144': fullHeight },
                    showOrderBook && !fullHeight && !isSwapPage ? 'mb-112 sm:mb-0' : '',
                    showOrderBook && fullHeight && !isSwapPage ? 'mb-152 sm:mb-0' : '',
                    showOrderBook && !fullHeight && isSwapPage ? 'mb-96 sm:mb-0' : '',
                    showOrderBook && fullHeight && isSwapPage ? 'mb-132 sm:mb-0' : '',
                    animate
                        ? isTransparent
                            ? 'opacity-100 xl:animate-light-fade-out xl:opacity-90'
                            : 'opacity-100 xl:animate-light-fade-in'
                        : isTransparent
                          ? 'opacity-100 xl:opacity-90'
                          : 'opacity-100'
                )}
            >
                <div
                    className={clsx(
                        'flex flex-col gap-4 rounded-3xl border-2 p-4 text-white',
                        backgroundColor,
                        isPro ? 'sm:w-100' : 'sm:w-112',
                        { 'h-107': !fullHeight },
                        { 'h-144': fullHeight }
                    )}
                >
                    {!showSettings && (
                        <>
                            <SwapNavbar
                                swapType={swapType}
                                setSwapType={setSwapType}
                                showOrderBook={showOrderBook}
                                showSettings={showSettings}
                                setShowSettings={setShowSettings}
                                isPro={isPro}
                                isNike={isNike}
                                isParty={isParty}
                            />
                            <div
                                className={clsx('relative flex w-full gap-4', {
                                    'flex-col': isBuy,
                                    'flex-col-reverse': !isBuy,
                                })}
                            >
                                <>
                                    <SwitchButton orderType={orderType} setOrderType={setOrderType} isNike={isNike} isParty={isParty} />
                                </>
                                <div
                                    className={clsx(
                                        'flex h-30 w-full flex-none gap-2 p-3',
                                        'transition-all duration-300 ',
                                        isParty
                                            ? 'border-nike-orange-500 bg-nike-party-orange-800/40 rounded-3xl border-2'
                                            : isNike
                                              ? 'border-nike-orange-600/60 bg-nike-orange-700 hover:border-nike-orange-500/60 rounded-xl border'
                                              : 'rounded-xl border border-sky-600/60 bg-space-700 hover:border-sky-400/60'
                                    )}
                                >
                                    <div className="flex w-full flex-col gap-0.5">
                                        <div className="flex flex-row">
                                            <div className="flex">
                                                <label
                                                    htmlFor={isBuy ? 'token_amount_sell' : 'token_amount_buy'}
                                                    className={clsx('text-sm font-semibold', isNike ? '' : 'text-sky-200')}
                                                >
                                                    {isBuy ? 'You pay' : 'You receive'}
                                                </label>
                                            </div>
                                            <div className="grow"></div>
                                            <div className="flex">
                                                <BalanceOneSection
                                                    swapType={swapType}
                                                    orderType={orderType}
                                                    tokenProjectOne={tokenProjectOne}
                                                    tokenProjectTwo={tokenProjectTwo}
                                                    flattenedBuyPoolUtxos={flattenedBuyPoolUtxos}
                                                    flattenedSellPoolUtxos={flattenedSellPoolUtxos}
                                                    marketPrice={marketPrice}
                                                    isBuy={isBuy}
                                                    tokenSellPreviouslyUpdated={tokenSellPreviouslyUpdated}
                                                    tokenBuyPreviouslyUpdated={tokenBuyPreviouslyUpdated}
                                                    balanceTokenProjectOne={showBalanceTokenProjectOne}
                                                    balanceTokenProjectTwo={showBalanceTokenProjectTwo}
                                                    address={address}
                                                    isLoadingBalanceTokenProjectOne={isLoadingBalanceTokenProjectOne}
                                                    isTokenSelected={isTokenSelected}
                                                    isNike={isNike}
                                                    isParty={isParty}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex">
                                            <div className={clsx('flex w-full')}>
                                                <input
                                                    id={isBuy ? 'token_amount_sell' : 'token_amount_buy'}
                                                    name={isBuy ? 'token_amount_sell' : 'token_amount_buy'}
                                                    type="text"
                                                    lang="en-US"
                                                    className={clsx(
                                                        'flex h-12 w-36 items-center border-0 bg-transparent p-0 text-4xl font-bold placeholder:text-zinc-300 md:w-60',
                                                        'focus:ring-0',
                                                        isNike
                                                            ? 'placeholder:ring-nike-orange-200/80 focus:ring-nike-orange-400'
                                                            : 'placeholder:text-sky-200/80 focus:ring-sky-400'
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
                                                            showBalanceTokenProjectOne,
                                                            showBalanceTokenProjectTwo,
                                                            address
                                                        )
                                                    }
                                                    autoComplete="off"
                                                    placeholder="0"
                                                    value={tokenAmountSellString}
                                                />
                                            </div>
                                            <div className="flex h-full select-none flex-col items-end justify-center gap-2">
                                                <div
                                                    className={clsx(
                                                        'flex h-10 items-center justify-center font-bold',
                                                        'border',
                                                        isParty
                                                            ? 'border-nike-party-orange-600 bg-nike-party-orange-800/65 rounded-xl'
                                                            : isNike
                                                              ? 'border-nike-orange-500 bg-nike-orange-600 rounded-lg'
                                                              : 'rounded-lg border-sky-600/60 bg-space-400 hover:bg-sky-900'
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
                                        <div className="flex">
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
                                                      : tokenSellUSDString}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className={clsx(
                                        'flex h-30 w-full flex-none gap-2 border p-3',
                                        'transition-all duration-300 ',
                                        isParty
                                            ? 'border-nike-orange-500 bg-nike-party-orange-800/40  rounded-3xl border-2'
                                            : isNike
                                              ? 'border-nike-orange-600/60 bg-nike-orange-700 hover:border-nike-orange-500/60 rounded-xl border'
                                              : 'rounded-xl border border-sky-600/60 bg-space-700 hover:border-sky-400/60'
                                    )}
                                >
                                    <div className="flex w-full flex-col gap-0.5">
                                        <div className="flex w-full">
                                            <div className="flex">
                                                <label
                                                    htmlFor={isBuy ? 'token_amount_buy' : 'token_amount_sell'}
                                                    className={clsx('text-sm font-semibold ', isNike ? '' : 'text-sky-200')}
                                                >
                                                    {isBuy ? 'You receive' : 'You pay'}
                                                </label>
                                            </div>
                                            <div className="grow"></div>
                                            <div className="flex">
                                                <BalanceTwoSection
                                                    swapType={swapType}
                                                    orderType={orderType}
                                                    tokenProjectOne={tokenProjectOne}
                                                    tokenProjectTwo={tokenProjectTwo}
                                                    flattenedBuyPoolUtxos={flattenedBuyPoolUtxos}
                                                    flattenedSellPoolUtxos={flattenedSellPoolUtxos}
                                                    marketPrice={marketPrice}
                                                    isBuy={isBuy}
                                                    tokenSellPreviouslyUpdated={tokenSellPreviouslyUpdated}
                                                    tokenBuyPreviouslyUpdated={tokenBuyPreviouslyUpdated}
                                                    showBalanceTokenProjectOne={showBalanceTokenProjectOne}
                                                    showBalanceTokenProjectTwo={showBalanceTokenProjectTwo}
                                                    spendBalanceTokenProjectOne={spendBalanceTokenProjectOne}
                                                    spendBalanceTokenProjectTwo={spendBalanceTokenProjectTwo}
                                                    address={address}
                                                    isLoadingBalanceTokenProjectTwo={isLoadingBalanceTokenProjectTwo}
                                                    isTokenSelected={isTokenSelected}
                                                    isNike={isNike}
                                                    isParty={isParty}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex w-full items-center">
                                            <div className="flex">
                                                <input
                                                    id={isBuy ? 'token_amount_buy' : 'token_amount_sell'}
                                                    name={isBuy ? 'token_amount_buy' : 'token_amount_sell'}
                                                    type="text"
                                                    lang="en-US"
                                                    className={clsx(
                                                        'flex h-12 w-36 items-center border-0 bg-transparent p-0 text-4xl font-bold placeholder:text-zinc-300 focus:ring-0 md:w-60',
                                                        isNike
                                                            ? 'placeholder:ring-nike-orange-200/80 focus:ring-nike-orange-400'
                                                            : 'placeholder:text-sky-200/80 focus:ring-sky-400'
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
                                                            spendBalanceTokenProjectOne,
                                                            spendBalanceTokenProjectTwo,
                                                            address
                                                        )
                                                    }
                                                    autoComplete="off"
                                                    placeholder="0"
                                                    value={tokenAmountBuyString}
                                                />
                                            </div>
                                            <div className="grow"></div>
                                            <div className="flex h-full w-full">
                                                <div className="flex h-full w-full select-none flex-col items-end justify-center gap-2">
                                                    <div
                                                        onClick={() => {
                                                            if (isNike || preselectedPool) return;
                                                            setIsOpenModal(TOKEN_SELECT_IS_OPEN_MODAL_KEY, true);
                                                        }}
                                                        className={clsx('flex h-10 items-center justify-center  pl-2 font-bold', 'border', {
                                                            'border-nike-orange-500 bg-nike-orange-600 rounded-lg': isNike && !preselectedPool,
                                                            'rounded-lg border-sky-600/60 bg-space-400': !isNike && preselectedPool,
                                                            'cursor-pointer rounded-lg border-sky-600/60 bg-space-400 hover:bg-sky-900':
                                                                !isNike && !preselectedPool,
                                                            'border-nike-party-orange-600 bg-nike-party-orange-800/65 rounded-xl': isParty,
                                                        })}
                                                    >
                                                        {isTokenSelected ? (
                                                            <>
                                                                <div className="flex h-10 w-10 items-center justify-center">
                                                                    <Image
                                                                        src={tokenTwoImage}
                                                                        alt="Cardano"
                                                                        width={24}
                                                                        height={24}
                                                                        style={{ width: 24, height: 24, objectFit: 'contain' }}
                                                                    />
                                                                </div>
                                                                <div className="max-w-16 overflow-clip whitespace-nowrap">{tokenTwoName}</div>
                                                                {isNike || preselectedPool ? (
                                                                    <div className="flex h-10 w-6 items-center justify-center"></div>
                                                                ) : (
                                                                    <div className="flex h-10 w-6 items-center justify-center">
                                                                        <Image
                                                                            src="/images/icons/arrow-down.png"
                                                                            alt="Arrow Down"
                                                                            width={10}
                                                                            height={10}
                                                                        />
                                                                    </div>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <>
                                                                <div className="hidden sm:block">Select Token</div>
                                                                <div className="text-sm sm:hidden">Select Token</div>
                                                                <div className="flex h-10 w-6 items-center justify-center">
                                                                    <Image
                                                                        src="/images/icons/arrow-down.png"
                                                                        alt="Arrow Down"
                                                                        width={10}
                                                                        height={10}
                                                                    />
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex w-full">
                                            <div>
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
                                                          : tokenBuyUSDString}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {isTokenSelected && swapType === SwapType.Limit && (
                                <LimitInfoBox
                                    swap={swap}
                                    address={address}
                                    isBuy={isBuy}
                                    limitSellPrice={limitSellPrice}
                                    limitBuyPrice={limitBuyPrice}
                                    marketSellPrice={marketSellPrice}
                                    marketBuyPrice={marketBuyPrice}
                                    percentString={percentString}
                                    precision={precision}
                                    isNike={isNike}
                                    swapType={swapType}
                                    orderType={orderType}
                                    tokenProjectOne={tokenProjectOne}
                                    tokenProjectTwo={tokenProjectTwo}
                                    flattenedBuyPoolUtxos={flattenedBuyPoolUtxos}
                                    flattenedSellPoolUtxos={flattenedSellPoolUtxos}
                                    marketPrice={marketPrice}
                                    tokenSellPreviouslyUpdated={tokenSellPreviouslyUpdated}
                                    tokenBuyPreviouslyUpdated={tokenBuyPreviouslyUpdated}
                                    balanceTokenProjectOne={showBalanceTokenProjectOne}
                                    balanceTokenProjectTwo={showBalanceTokenProjectTwo}
                                />
                            )}
                            {!(swapType === SwapType.Limit && isTokenSelected) && (
                                <SwapPriceComponent
                                    isTokenSelected={isTokenSelected}
                                    isBuy={isBuy}
                                    tokenProjectTwo={tokenProjectTwo}
                                    marketBuyPrice={marketBuyPrice}
                                    marketSellPrice={marketSellPrice}
                                    averagePrice={averagePrice}
                                    isNike={isNike}
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
                                    spendBalanceTokenProjectTwo={spendBalanceTokenProjectTwo}
                                    isAboveBalance={swap?.isAboveBalance}
                                    isNike={isNike}
                                    isParty={isParty}
                                />
                            </>
                        </>
                    )}
                    {showSettings && (
                        <>
                            <SwapSettings setShowSettings={setShowSettings} isNike={isNike} />
                        </>
                    )}
                </div>
                {!isPro && (
                    <SwapOrderBook
                        pool={pool}
                        tokenProjectOne={tokenProjectOne}
                        tokenProjectTwo={tokenProjectTwo}
                        address={address}
                        swapType={swapType}
                        isTokenSelected={isTokenSelected}
                        isEnabled={showOrderBook}
                        utxoOrderBookData={utxoOrderBookData}
                        isNike={isNike}
                        isParty={isParty}
                    />
                )}
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
    balanceTokenProjectTwo: any,
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
            await Order(pool, swapType, orderType, setSwap, balanceTokenProjectTwo);
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
    }
};

export const FilterBuys = (pool: any, address: any) => {
    const filter = `{
        pool_id: { eq: "${pool?.id}"},
        active_type: { eq: LIMIT_BUY_ORDER },
        or: [
            { active_status: { eq: COMPLETE } },
            { active_status: { eq: PENDING }, spend_status: { neq: FAILED } },
        ],
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

export const FilterSells = (pool: any, address: any) => {
    const filter = `{
            pool_id: { eq: "${pool?.id}"},
            active_type: { eq: LIMIT_SELL_ORDER },
            or: [
                { active_status: { eq: COMPLETE } },
                { active_status: { eq: PENDING }, spend_status: { neq: FAILED } },
            ],
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
