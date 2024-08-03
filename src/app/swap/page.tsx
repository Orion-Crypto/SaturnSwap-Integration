'use client';

import { PageBackground } from '@/components/Elements/Backgrounds/PageBackground';
import { Spinner } from '@/components/Elements/Spinner';
import { SubNavbar } from '@/components/Layouts/Navbar/SubNavbar';
import { OrderContainer } from '@/components/PageComponents/Order/OrderContainer/OrderContainer';
import { Swap } from '@/components/PageComponents/Swap/Swap';
import { useGetConnectedWallet } from '@/hooks/Cardano/wallet.hooks';
import { useGetShowBackgroundImage } from '@/hooks/Component/background-image.hook';
import { useGetShowOrders } from '@/hooks/Component/order.hook';
import { OrderContainerType } from '@/types/Enums/OrderContainerType';
import { getHostname } from '@/utils/hostname';
import clsx from 'clsx';
import { useState } from 'react';

const SwapPage = () => {
    const hostname = getHostname();
    const isNike = hostname.includes('nikeswap');
    const [toggleAnimation, setToggleAnimation] = useState(false);

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
            <PageBackground showBackgroundImage={showBackgroundImage} toggleAnimation={toggleAnimation} isNike={isNike} />
            <div className={clsx('flex min-h-screen flex-col', 'transition-all duration-300')}>
                <>
                    <SubNavbar
                        showBackgroundImage={showBackgroundImage}
                        showOrders={showOrders}
                        setToggleAnimation={setToggleAnimation}
                        hasShowBackgroundButton={true}
                        hasShowOrdersButton={true}
                        hasAdvancedButton={true}
                        isNike={isNike}
                    />
                </>
                <div className="flex h-full  w-full">
                    <div className="flex w-full flex-col items-center justify-center gap-24">
                        <div
                            className={clsx('flex w-full flex-col items-center justify-center', isMagnifiedPixelRatio ? 'sm:mt-0' : 'sm:mt-8')}
                        >
                            <Swap isTransparent={showBackgroundImage} animate={toggleAnimation} isNike={isNike} />
                        </div>
                        {showOrders && (
                            <div className="flex w-full">
                                <OrderContainer
                                    orderContainerType={OrderContainerType.AllOrders}
                                    address={connectedWallet?.address}
                                    toggleAnimation={toggleAnimation}
                                    showBackgroundImage={showBackgroundImage}
                                    isNike={isNike}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default SwapPage;
