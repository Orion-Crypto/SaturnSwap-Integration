import { ResetSwapInputs } from '@/components/PageComponents/Swap/Utils/SwapUtils/AutomaticSwapUtilts';
import { OrderType } from '@/types/Enums/OrderType';
import clsx from 'clsx';
import Image from 'next/image';

export const SwitchButton = ({ orderType, setOrderType, isNike = false, isParty = false }: any) => {
    const buttonColor = isParty ? 'bg-nike-orange-800 border-nike-party-orange-600 hover:bg-nike-orange-600 active:bg-nike-orange-800' : isNike
        ? 'border-nike-orange-600/60 bg-nike-orange-900 hover:border-nike-orange-500/60 active:bg-nike-orange-800'
        : 'border-sky-600/60 bg-space-700 hover:bg-space-400 active:bg-space-100';
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
                            ResetSwapInputs();
                        }}
                        className={clsx(
                            'absolute -right-5 -top-5 flex h-10 w-10 cursor-pointer select-none items-center justify-center rounded-lg border',
                            'transition-all duration-300',
                            buttonColor
                        )}
                    >
                        <Image src="/images/icons/swap-arrow-vert.png" alt="Swap" width={18} height={18} />
                    </div>
                </div>
            </div>
        </>
    );
};
