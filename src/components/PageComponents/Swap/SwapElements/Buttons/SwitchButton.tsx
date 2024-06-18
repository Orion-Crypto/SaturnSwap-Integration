import { resetSwapInputs } from '@/components/PageComponents/Swap/Utils/SwapUtils';
import { OrderType } from '@/types/Enums/OrderType';
import clsx from 'clsx';
import Image from 'next/image';

export const SwitchButton = ({ orderType, setOrderType }: any) => {
    return (
        <>
            <div className="absolute inset-1/2">
                <div className="relative">
                    <div
                        onClick={() => {
                            let newOrderType = OrderType.Buy;
                            if (orderType === OrderType.Buy) {
                                newOrderType = OrderType.Sell;
                            }
                            setOrderType(newOrderType);

                            // Swap the token amounts
                            resetSwapInputs();
                        }}
                        className={clsx(
                            'absolute -right-5 -top-5 flex h-10 w-10 cursor-pointer select-none items-center justify-center rounded-lg border border-sky-600/60 bg-space-700',
                            'transition-all duration-300',
                            'hover:bg-space-400 active:bg-space-100'
                        )}
                    >
                        <Image src="/images/icons/swap-arrow-vert.png" alt="Swap" width={18} height={18} />
                    </div>
                </div>
            </div>
        </>
    );
};
