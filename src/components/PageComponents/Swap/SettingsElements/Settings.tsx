import { SettingsNavbar } from '@/components/PageComponents/Swap/SettingsElements/SettingsNavbar';
import { setSlippageType, setSlippageValue, useGetSlippageType, useGetSlippageValue } from '@/hooks/Component/slippage.hook';
import clsx from 'clsx';
import Image from 'next/image';
import { useState } from 'react';

export const SwapSettings = ({ setShowSettings }: any) => {
    return (
        <>
            <SettingsNavbar setShowSettings={setShowSettings} />
            <div className="flex h-full w-full flex-col pt-4">
                <SlippageSettings />
            </div>
        </>
    );
};

const SlippageSettings = () => {
    const { data: slippageType } = useGetSlippageType();
    const { data: slippageValue }: any = useGetSlippageValue();

    const isCustom = slippageType === 'Custom';
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
                            value={slippageValue ? slippageValue : 2}
                            onChange={(event: any) => {
                                setSlippageValue(event.target.value);
                            }}
                        />
                        %
                    </div>
                )}
                <SlippageDropdown slippageType={slippageType} slippageValue={slippageValue} />
            </div>
        </>
    );
};

const SlippageDropdown = ({ slippageType, slippageValue }: any) => {
    const [isShowingDropdown, setIsShowingDropdown] = useState(false);

    const isAuto = slippageType === 'Auto';
    const isCustom = slippageType === 'Custom';
    const slippageValueText = isAuto || isCustom ? slippageType : `${slippageValue}%`;
    return (
        <>
            <div className="relative flex h-full select-none items-center justify-end">
                <div
                    onClick={() => setIsShowingDropdown(!isShowingDropdown)}
                    className={clsx(
                        'flex h-10 w-24 cursor-pointer items-center justify-center gap-1 rounded-lg font-bold',
                        'border border-sky-600/60 bg-space-400 transition-all duration-300 hover:bg-sky-900'
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
                            'border border-sky-600/60 bg-space-400'
                        )}
                    >
                        <div
                            onClick={() => {
                                setSlippageType('Auto');
                                setSlippageValue(null);
                                setIsShowingDropdown(false);
                            }}
                            className="flex cursor-pointer px-4 py-2 hover:bg-sky-900"
                        >
                            Auto
                        </div>
                        <div
                            onClick={() => {
                                setSlippageType('number');
                                setSlippageValue(1);
                                setIsShowingDropdown(false);
                            }}
                            className="flex cursor-pointer px-4 py-2 hover:bg-sky-900"
                        >
                            1%
                        </div>
                        <div
                            onClick={() => {
                                setSlippageType('number');
                                setSlippageValue(2);
                                setIsShowingDropdown(false);
                            }}
                            className="flex cursor-pointer px-4 py-2 hover:bg-sky-900"
                        >
                            2%
                        </div>
                        <div
                            onClick={() => {
                                setSlippageType('number');
                                setSlippageValue(5);
                                setIsShowingDropdown(false);
                            }}
                            className="flex cursor-pointer px-4 py-2 hover:bg-sky-900"
                        >
                            5%
                        </div>
                        <div
                            onClick={() => {
                                setSlippageType('number');
                                setSlippageValue(10);
                                setIsShowingDropdown(false);
                            }}
                            className="flex cursor-pointer px-4 py-2 hover:bg-sky-900"
                        >
                            10%
                        </div>
                        <div
                            onClick={() => {
                                setSlippageType('Custom');
                                setIsShowingDropdown(false);
                            }}
                            className="flex cursor-pointer px-4 py-2 hover:bg-sky-900"
                        >
                            Custom
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};
