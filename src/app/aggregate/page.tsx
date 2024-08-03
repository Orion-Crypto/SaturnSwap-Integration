'use client';

import { PageBackground } from '@/components/Elements/Backgrounds/PageBackground';
import { Spinner } from '@/components/Elements/Spinner';
import { SubNavbar } from '@/components/Layouts/Navbar/SubNavbar';
import { OrderContainer } from '@/components/PageComponents/Order/OrderContainer/OrderContainer';
import { Swap } from '@/components/PageComponents/Swap/Swap';
import { SimpleOrder } from '@/components/PageComponents/Swap/Utils/AggregatorUtils';
import { MarketOrder } from '@/components/PageComponents/Swap/Utils/TransactionUtils';
import { useGetConnectedWallet } from '@/hooks/Cardano/wallet.hooks';
import { useGetShowBackgroundImage } from '@/hooks/Component/background-image.hook';
import { useGetShowOrders } from '@/hooks/Component/order.hook';
import { OrderContainerType } from '@/types/Enums/OrderContainerType';
import { getHostname, getNikePoolId } from '@/utils/hostname';
import clsx from 'clsx';
import { useState } from 'react';

const SwapPage = () => {
    const hostname = getHostname();
    const [toggleAnimation, setToggleAnimation] = useState(false);
    const [isLoadingSimple, setIsLoadingSimple] = useState(false);
    const [isLoadingAdvanced, setIsLoadingAdvanced] = useState(false);

    const { data: connectedWallet }: any = useGetConnectedWallet();
    const { data: showBackgroundImage }: any = useGetShowBackgroundImage();
    const { data: showOrders } = useGetShowOrders();

    let isMagnifiedPixelRatio = false;
    const isBrowser = typeof window !== 'undefined';
    if (isBrowser) {
        // Get the device pixel ratio is 1.125
        const devicePixelRatio = window.devicePixelRatio;
        isMagnifiedPixelRatio = devicePixelRatio > 1.0 && devicePixelRatio <= 1.25;
    }

    if (showBackgroundImage === undefined)
        return (
            <>
                <div className="flex min-h-screen items-center justify-center">
                    <Spinner />
                </div>
            </>
        );
    return (
        <>
            {/* <PageBackground showBackgroundImage={showBackgroundImage} toggleAnimation={toggleAnimation} isNike={isNike} /> */}
            <div className={clsx(' flex min-h-screen flex-col', 'transition-all duration-300')}>
                <>
                    <SubNavbar
                        showBackgroundImage={showBackgroundImage}
                        showOrders={showOrders}
                        setToggleAnimation={setToggleAnimation}
                        hasShowBackgroundButton={true}
                        hasShowOrdersButton={true}
                        hasAdvancedButton={true}
                    />
                </>
                <div className="flex h-full w-full flex-col items-center justify-center gap-24">
                    <div className="flex w-full flex-col items-center gap-4">
                        <div className="flex w-full items-center justify-center text-3xl font-bold text-sky-300">Simple Tx Builder</div>
                        <div
                            onClick={async () => {
                                if (isLoadingSimple) return;

                                setIsLoadingSimple(true);
                                await ExecuteSimpleOrder();
                                setIsLoadingSimple(false);
                            }}
                            className="z-50 flex h-16 w-64 cursor-pointer select-none items-center justify-center rounded-xl bg-blue-500 p-4 text-xl font-bold text-white transition-all duration-300 hover:bg-blue-600"
                        >
                            {isLoadingSimple ? <Spinner /> : `Buy 10 ₳ Of Nike`}
                        </div>
                    </div>
                    <div className="flex w-full flex-col items-center gap-4">
                        <div className="flex w-full items-center justify-center text-3xl font-bold text-sky-300">Advanced Tx Builder</div>
                        <div
                            onClick={async () => {
                                if (isLoadingSimple) return;

                                setIsLoadingSimple(true);
                                await ExecuteSimpleOrder();
                                setIsLoadingSimple(false);
                            }}
                            className="z-50 flex h-16 w-64 cursor-pointer select-none items-center justify-center rounded-xl bg-blue-500 p-4 text-xl font-bold text-white transition-all duration-300 hover:bg-blue-600"
                        >
                            {isLoadingSimple ? <Spinner /> : `Buy 10 ₳ Of Nike`}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const ExecuteSimpleOrder = async () => {
    const poolId = getNikePoolId();
    const tokenBuyAmount = 10;
    const tokenSellAmount = 10 * 0.2;

    let marketOrderType = 3;
    await SimpleOrder(poolId, tokenBuyAmount, tokenSellAmount, null, marketOrderType);
};

export default SwapPage;
