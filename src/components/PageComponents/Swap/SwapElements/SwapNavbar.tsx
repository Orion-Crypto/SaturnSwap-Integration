import { setSwap } from '@/hooks/Component/swap.hook';
import { SwapType } from '@/types/Enums/SwapType';
import clsx from 'clsx';
import Image from 'next/image';

export const SwapNavbar = ({ swapType, setSwapType, showOrderBook, setShowOrderBook, showSettings, setShowSettings, isPro = false }: any) => {
    return (
        <>
            <div className="z-50 flex h-10 w-full flex-none justify-start gap-2">
                <div
                    onClick={() => {
                        setSwapType(SwapType.Market);
                        setSwap({
                            tokenAmountSell: 0,
                            tokenAmountBuy: 0,
                            tokenSellUpdated: false,
                            tokenBuyUpdated: false,
                        });
                    }}
                    className={clsx(
                        'flex cursor-pointer select-none items-center justify-center rounded-xl p-2 font-semibold text-zinc-200',
                        'transition-all duration-300  active:bg-sky-600',
                        { 'bg-sky-600 hover:bg-sky-600': swapType === SwapType.Market },
                        { 'hover:bg-sky-700': swapType !== SwapType.Market }
                    )}
                >
                    Swap
                </div>
                <div
                    onClick={() => {
                        setSwapType(SwapType.Limit);
                        setSwap({
                            tokenAmountSell: 0,
                            tokenAmountBuy: 0,
                            tokenSellUpdated: false,
                            tokenBuyUpdated: false,
                        });
                    }}
                    className={clsx(
                        'flex cursor-pointer select-none items-center justify-center rounded-xl p-2 font-semibold text-zinc-200',
                        'transition-all duration-300 active:bg-sky-600',
                        { 'bg-sky-600 hover:bg-sky-600': swapType === SwapType.Limit },
                        { 'hover:bg-sky-700': swapType !== SwapType.Limit }
                    )}
                >
                    Limit
                </div>
                <div className="grow"></div>
                <div
                    onClick={() => {
                        setShowSettings(true);
                        setShowOrderBook(false);
                    }}
                    className={clsx(
                        'flex select-none items-center justify-center rounded-lg border px-3 text-sm',
                        'cursor-pointer transition-all duration-300',
                        showSettings
                            ? 'border-sky-400/60 bg-space-400'
                            : 'border-sky-600/60 bg-space-700 hover:border-sky-400/60 hover:bg-space-400 active:bg-space-100'
                    )}
                >
                    <Image src="/images/icons/settings.png" alt="Settings" width={16} height={16} />
                </div>
                {!isPro && (
                    <div
                        onClick={() => setShowOrderBook(!showOrderBook)}
                        className={clsx(
                            'cursor-pointer select-none items-center justify-center rounded-lg border px-2 text-sm',
                            'transition-all duration-300',
                            showOrderBook
                                ? 'border-sky-400/60 bg-space-400'
                                : 'border-sky-600/60 bg-space-700 hover:border-sky-400/60 hover:bg-space-400 active:bg-space-100',
                            isPro ? 'hidden' : 'flex'
                        )}
                    >
                        <Image src="/images/icons/order-book.png" alt="Order Book" width={24} height={24} />
                    </div>
                )}
            </div>
        </>
    );
};
