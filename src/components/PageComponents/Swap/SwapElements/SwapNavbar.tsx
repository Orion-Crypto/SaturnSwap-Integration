import { setShowOrderBookSwap } from '@/hooks/Component/order-book.hook';
import { setSwap } from '@/hooks/Component/swap.hook';
import { SwapType } from '@/types/Enums/SwapType';
import clsx from 'clsx';
import Image from 'next/image';

export const SwapNavbar = ({ swapType, setSwapType, showOrderBook, showSettings, setShowSettings, isPro = false, isNike = false, isParty = false }: any) => {
    const activeButton = isParty ? 'active:bg-nike-party-orange-800' : isNike ? 'active:bg-nike-orange-600' : 'active:bg-sky-600';
    const activeHover = isParty ? 'hover:bg-nike-party-orange-700' : isNike ? 'hover:bg-nike-orange-700' : 'hover:bg-sky-700';
    const activeStandard = isParty ? 'bg-nike-party-orange-800 hover:bg-nike-orange-600' : isNike ? 'bg-nike-orange-600 hover:bg-nike-orange-600' : 'bg-sky-600 hover:bg-sky-600';
    return (
        <>
            <div className="z-50 flex h-10 w-full flex-none justify-start gap-2">
                <div
                    onClick={() => {
                        setSwapType(SwapType.Market);
                        setSwap({
                            tokenAmountSell: '0',
                            tokenAmountBuy: '0',
                            tokenSellUpdated: false,
                            tokenBuyUpdated: false,
                        });
                    }}
                    className={clsx(
                        'flex cursor-pointer select-none items-center justify-center rounded-xl p-2 font-semibold text-zinc-200',
                        'transition-all duration-300',
                        activeButton,
                        swapType === SwapType.Market ? activeStandard : activeHover
                    )}
                >
                    Swap
                </div>
                <div
                    onClick={() => {
                        setSwapType(SwapType.Limit);
                        setSwap({
                            tokenAmountSell: '0',
                            tokenAmountBuy: '0',
                            tokenSellUpdated: false,
                            tokenBuyUpdated: false,
                        });
                    }}
                    className={clsx(
                        'flex cursor-pointer select-none items-center justify-center rounded-xl p-2 font-semibold text-zinc-200',
                        'transition-all duration-300',
                        activeButton,
                        swapType === SwapType.Limit ? activeStandard : activeHover
                    )}
                >
                    Limit
                </div>
                <div className="grow"></div>
                {!isPro && <OrderBookButton isPro={isPro} showOrderBook={showOrderBook} isNike={isNike} isParty={isParty} />}
                <SettingsButton showSettings={showSettings} setShowSettings={setShowSettings} isNike={isNike} isParty={isParty} />
            </div>
        </>
    );
};

const OrderBookButton = ({ isPro, showOrderBook, isNike, isParty }: any) => {
    const normalBackground = showOrderBook
        ? 'border-sky-400/60 bg-space-400'
        : 'border-sky-600/60 bg-space-700 hover:border-sky-400/60 hover:bg-space-400 active:bg-space-100';
    const nikeBackground = showOrderBook
        ? 'bg-nike-orange-700/60 border-nike-orange-500/60'
        : 'border-nike-orange-600/60 bg-nike-orange-900 hover:bg-nike-orange-700/60 hover:border-nike-orange-500/60 active:bg-nike-orange-600/60';
    const partyBackground = showOrderBook
        ? 'bg-nike-party-orange-800/70 border-nike-party-orange-600/60'
        : 'border-nike-orange-600/60 bg-nike-party-orange-800/20 hover:bg-nike-orange-700/60 hover:bg-nike-party-orange-800/40 active:bg-nike-orange-600/60';

    return (
        <>
            <div
                onClick={() => setShowOrderBookSwap(!showOrderBook)}
                className={clsx(
                    'cursor-pointer select-none items-center justify-center rounded-lg border px-2 text-sm',
                    'transition-all duration-300',
                    isParty ? partyBackground :
                    isNike ? nikeBackground : normalBackground,
                    isPro ? 'hidden' : 'flex'
                )}
            >
                <Image src="/images/icons/order-book.png" alt="Order Book" width={24} height={24} />
            </div>
        </>
    );
};

const SettingsButton = ({ showSettings, setShowSettings, isNike, isParty }: any) => {
    const normalBackground = showSettings
        ? 'border-sky-400/60 bg-space-400'
        : 'border-sky-600/60 bg-space-700 hover:border-sky-400/60 hover:bg-space-400 active:bg-space-100';
    const nikeBackground = showSettings
        ? 'bg-nike-orange-700/60 border-nike-orange-500/60'
        : 'border-nike-orange-600/60 bg-nike-orange-900 hover:bg-nike-orange-700/60 hover:border-nike-orange-500/60 active:bg-nike-orange-600/60';
    const partyBackground = showSettings
        ? 'bg-nike-party-orange-800/70 border-nike-party-orange-600/60'
        : 'border-nike-orange-600/60 bg-nike-party-orange-800/20 hover:bg-nike-orange-700/60 hover:bg-nike-party-orange-800/40 active:bg-nike-orange-600/60';
    return (
        <>
            <div
                onClick={() => {
                    setShowSettings(true);
                    setShowOrderBookSwap(false);
                }}
                className={clsx(
                    'flex select-none items-center justify-center rounded-lg border px-3 text-sm',
                    'cursor-pointer transition-all duration-300',
                    isParty ? partyBackground : isNike ? nikeBackground : normalBackground
                )}
            >
                <Image src="/images/icons/settings.png" alt="Settings" width={16} height={16} />
            </div>
        </>
    );
};
