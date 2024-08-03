import { SettingsNavbar } from '@/components/PageComponents/Swap/SettingsElements/SettingsNavbar';
import { setSlippageType, setSlippageValue, useGetSlippageType, useGetSlippageValue } from '@/hooks/Component/slippage.hook';
import { SlippageType } from '@/types/Enums/SlippageType';
import clsx from 'clsx';
import Image from 'next/image';
import { useState } from 'react';

export const SwapSettings = ({ setShowSettings, isNike = false }: any) => {
    return (
        <>
            <SettingsNavbar setShowSettings={setShowSettings} isNike={isNike} />
            <div className="flex h-full w-full flex-col pt-4">
                <SlippageSettings isNike={isNike} />
            </div>
        </>
    );
};

const SlippageSettings = ({ isNike }: any) => {
    const { data: slippageType } = useGetSlippageType();
    const { data: slippageValue }: any = useGetSlippageValue();

    const isCustom = slippageType === SlippageType.Custom || slippageValue == 'Custom';
    return (
        <>
            <div className="flex w-full items-center">
                <div className="text-lg font-bold">Slippage</div>
                <div className="grow"></div>
                {isCustom && (
                    <div className="flex items-center gap-2 px-12 text-white">
                        <input
                            id={`custom-slippage`}
                            name={`custom-slippage`}
                            type="number"
                            step="0.01"
                            className={clsx(
                                'flex w-full items-center justify-start rounded-lg border-0 bg-sky-600 px-2 font-bold',
                                'focus:ring-2 focus:ring-sky-400'
                            )}
                            value={slippageValue ? slippageValue : ''}
                            onChange={(event: any) => {
                                const value = event.target.value;
                                if (value > 1000) return;

                                setSlippageValue(event.target.value);
                            }}
                        />
                        %
                    </div>
                )}
                <SlippageDropdown slippageType={slippageType} slippageValue={slippageValue} isNike={isNike} />
            </div>
        </>
    );
};

const SlippageDropdown = ({ slippageType, slippageValue, isNike }: any) => {
    const [isShowingDropdown, setIsShowingDropdown] = useState(false);

    const isAuto = slippageType === SlippageType.Auto || slippageValue === 'Auto';
    const isCustom = slippageType === SlippageType.Custom || slippageValue === 'Custom';
    const isCustomWithNoValue = isCustom && slippageValue === 'Custom';

    const isUnlimited = slippageType === SlippageType.Unlimited || slippageValue == 'Unlimited';

    const slippageValueClean = !!slippageValue ? slippageValue : 0;
    const slippageValueText = isAuto || isCustomWithNoValue || isUnlimited ? slippageValue : `${slippageValueClean}%`;

    const buttonColor = isNike
        ? 'bg-nike-orange-700 border-nike-orange-600/60 hover:bg-nike-orange-800'
        : 'hover:bg-sky-900 border-sky-600/60 bg-space-400';

    const dropdownBackground = isNike ? 'border-nike-orange-600/60 bg-nike-orange-700' : 'border-sky-600/60 bg-space-400';
    const dropdownHover = isNike ? 'hover:bg-nike-orange-800' : 'hover:bg-sky-900';
    return (
        <>
            <div className="relative flex h-full select-none items-center justify-end">
                <div
                    onClick={() => setIsShowingDropdown(!isShowingDropdown)}
                    className={clsx(
                        'flex h-10 w-32 cursor-pointer items-center justify-center gap-1 rounded-lg font-bold',
                        'border transition-all duration-300',
                        buttonColor
                    )}
                >
                    <>
                        <div>{slippageValueText}</div>
                        <div className="flex h-10 w-6 items-center justify-center">
                            <Image src="/images/icons/arrow-down.png" alt="Arrow Down" width={10} height={10} />
                        </div>
                    </>
                </div>
                {isShowingDropdown && (
                    <div
                        onMouseLeave={() => setIsShowingDropdown(false)}
                        className={clsx(
                            'absolute left-0 top-12 z-60 flex max-h-128 w-full flex-col overflow-y-auto rounded-lg font-bold text-white',
                            'border',
                            dropdownBackground
                        )}
                    >
                        <div
                            onClick={() => {
                                setSlippageType(SlippageType.Auto);
                                setSlippageValue('Auto');
                                setIsShowingDropdown(false);
                            }}
                            className={clsx('flex cursor-pointer px-4 py-2', dropdownHover)}
                        >
                            Auto
                        </div>
                        <div
                            onClick={() => {
                                setSlippageType(SlippageType.Number);
                                setSlippageValue(0.5);
                                setIsShowingDropdown(false);
                            }}
                            className={clsx('flex cursor-pointer px-4 py-2', dropdownHover)}
                        >
                            0.5%
                        </div>
                        <div
                            onClick={() => {
                                setSlippageType(SlippageType.Number);
                                setSlippageValue(1);
                                setIsShowingDropdown(false);
                            }}
                            className={clsx('flex cursor-pointer px-4 py-2', dropdownHover)}
                        >
                            1%
                        </div>
                        <div
                            onClick={() => {
                                setSlippageType(SlippageType.Number);
                                setSlippageValue(2);
                                setIsShowingDropdown(false);
                            }}
                            className={clsx('flex cursor-pointer px-4 py-2', dropdownHover)}
                        >
                            2%
                        </div>
                        <div
                            onClick={() => {
                                setSlippageType(SlippageType.Number);
                                setSlippageValue(5);
                                setIsShowingDropdown(false);
                            }}
                            className={clsx('flex cursor-pointer px-4 py-2', dropdownHover)}
                        >
                            5%
                        </div>
                        <div
                            onClick={() => {
                                setSlippageType(SlippageType.Number);
                                setSlippageValue(10);
                                setIsShowingDropdown(false);
                            }}
                            className={clsx('flex cursor-pointer px-4 py-2', dropdownHover)}
                        >
                            10%
                        </div>
                        <div
                            onClick={() => {
                                setSlippageType(SlippageType.Custom);
                                setSlippageValue('Custom');
                                setIsShowingDropdown(false);
                            }}
                            className={clsx('flex cursor-pointer px-4 py-2', dropdownHover)}
                        >
                            Custom
                        </div>
                        <div
                            onClick={() => {
                                setSlippageType(SlippageType.Unlimited);
                                setSlippageValue('Unlimited');
                                setIsShowingDropdown(false);
                            }}
                            className={clsx('flex cursor-pointer px-4 py-2', dropdownHover)}
                        >
                            Unlimited
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};
