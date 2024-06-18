import { Spinner } from '@/components/Elements/Spinner';
import { Order } from '@/components/PageComponents/Swap/Utils/TransactionUtils';
import { setSwap } from '@/hooks/Component/swap.hook';
import { SwapType } from '@/types/Enums/SwapType';
import clsx from 'clsx';

export const SwapButton = ({ pool, swapType, orderType, adaAmount, isButtonDisabled, isLoading, setIsLoading, isAboveBalance }: any) => {
    const isBelowSwapAmount = swapType === SwapType.Market && adaAmount < 10 && adaAmount !== 0;
    const isBelowLimitAmount = swapType === SwapType.Limit && adaAmount < 200 && adaAmount !== 0;

    let errorMessage = 'Enter Amount';
    if (isButtonDisabled && isBelowSwapAmount) {
        errorMessage = 'Min. Amount 10 ₳ Worth';
    } else if (isButtonDisabled && isBelowLimitAmount) {
        errorMessage = 'Min. Amount 200 ₳ Worth';
    } else if (isButtonDisabled && isAboveBalance) {
        errorMessage = 'Insufficient Balance';
    }

    let swapMessage = swapType === SwapType.Limit ? 'Place Limit Order' : 'Swap';
    return (
        <>
            <div
                onClick={async () => {
                    if (isButtonDisabled) return;

                    setIsLoading(true);
                    await Order(pool, swapType, orderType, setSwap);
                    setIsLoading(false);
                }}
                className={clsx('flex h-12 w-full flex-none select-none items-center justify-center rounded-2xl text-lg font-bold', '', {
                    'cursor-pointer bg-gradient-to-r from-sky-600 from-50% to-sky-400 text-white transition-all duration-300 hover:shadow-full-sky-md-500 active:scale-975':
                        !isButtonDisabled,
                    'bg-gradient-to-r from-sky-600/40 from-50% to-sky-400/40 text-zinc-400': isButtonDisabled,
                })}
            >
                {isButtonDisabled ? errorMessage : isLoading ? <Spinner /> : swapMessage}
            </div>
        </>
    );
};
