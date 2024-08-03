import { Spinner } from '@/components/Elements/Spinner';
import { Order } from '@/components/PageComponents/Swap/Utils/TransactionUtils';
import { setSwap } from '@/hooks/Component/swap.hook';
import { SwapType } from '@/types/Enums/SwapType';
import clsx from 'clsx';

export const SwapButton = ({
    pool,
    swapType,
    orderType,
    adaAmount,
    isButtonDisabled,
    isLoading,
    setIsLoading,
    spendBalanceTokenProjectTwo,
    isAboveBalance,
    isNike,
    isParty,
}: any) => {
    const isBelowSwapAmount = swapType === SwapType.Market && adaAmount < 5 && adaAmount !== 0;
    const isBelowLimitAmount = swapType === SwapType.Limit && adaAmount < 25 && adaAmount !== 0;

    let errorMessage = 'Enter Amount';
    if (isButtonDisabled && isBelowSwapAmount) {
        errorMessage = 'Min. Amount 5 ₳ Worth';
    } else if (isButtonDisabled && isBelowLimitAmount) {
        errorMessage = 'Min. Amount 25 ₳ Worth';
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
                    await Order(pool, swapType, orderType, setSwap, spendBalanceTokenProjectTwo);
                    setIsLoading(false);
                }}
                className={clsx('flex h-12 w-full flex-none select-none items-center justify-center rounded-2xl text-lg font-bold', '', {
                    'cursor-pointer text-white transition-all duration-300  active:scale-975': !isButtonDisabled,
                    'bg-gradient-to-r text-zinc-400': isButtonDisabled,
                    'bg-gradient-to-r from-sky-600 from-50% to-sky-400 hover:shadow-full-sky-md-500': !isButtonDisabled && !isNike && !isParty,
                    'bg-gradient-to-r from-sky-600/40 from-50% to-sky-400/40': isButtonDisabled && !isNike && !isParty,
                    'bg-gradient-to-r from-nike-orange-600 from-50% to-nike-orange-500 hover:shadow-full-nike-orange-md-500':
                        !isButtonDisabled && isNike && isParty,
                    'bg-gradient-to-r from-nike-orange-600/40 from-50% to-nike-orange-500/40': isButtonDisabled && isNike && !isParty,
                    'bg-gradient-to-r from-nike-party-orange-800 to-nike-party-orange-700 hover:shadow-full-nike-orange-md-500': !isButtonDisabled && isParty,
                    'bg-gradient-to-r from-nike-party-orange-800/40 to-nike-party-orange-700/40': isButtonDisabled && isParty,
                })}
            >
                {isButtonDisabled ? errorMessage : isLoading ? <Spinner /> : swapMessage}
            </div>
        </>
    );
};
