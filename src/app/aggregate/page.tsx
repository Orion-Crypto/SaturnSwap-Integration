'use client';

import { PageBackground } from '@/components/Elements/Backgrounds/PageBackground';
import { Spinner } from '@/components/Elements/Spinner';
import { SubNavbar } from '@/components/Layouts/Navbar/SubNavbar';
import { ActivityFeed } from '@/components/PageComponents/Swap/ActivityFeed';
import { Swap } from '@/components/PageComponents/Swap/Swap';
import { TrendingFeed } from '@/components/PageComponents/Swap/TrendingFeed';
import { useGetShowActivityFeed } from '@/hooks/Component/activity-feed.hook';
import { useGetShowBackgroundImage } from '@/hooks/Component/background-image.hook';
import { useGetShowTrendingFeed } from '@/hooks/Component/trending-feed.hook';
import clsx from 'clsx';
import { useState } from 'react';

const SwapPage = () => {
    const { data: showBackgroundImage }: any = useGetShowBackgroundImage();
    const [toggleAnimation, setToggleAnimation] = useState(false);

    const { data: showActivityFeed } = useGetShowActivityFeed();
    const { data: showTrendingFeed } = useGetShowTrendingFeed();

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
            <PageBackground showBackgroundImage={showBackgroundImage} toggleAnimation={toggleAnimation} />
            <div className={clsx('flex min-h-screen flex-col', 'transition-all duration-300')}>
                <>
                    <SubNavbar
                        hasShowBackgroundButton={true}
                        hasActivityFeedButton={true}
                        hasTrendingFeedButton={true}
                        showBackgroundImage={showBackgroundImage}
                        showActivityFeed={showActivityFeed}
                        showTrendingFeed={showTrendingFeed}
                        setToggleAnimation={setToggleAnimation}
                    />
                </>

                <div className="flex h-full w-full">
                    <div className="ml-24 hidden h-full w-80 xl:flex"></div>
                    <div className="flex flex-grow items-center justify-center ">
                        <div className="mt-8 flex flex-col items-center justify-center sm:mt-20">
                            {showTrendingFeed && <TrendingFeed />}

                            <Swap isTransparent={showBackgroundImage} animate={toggleAnimation} />
                        </div>
                    </div>
                    <div className="relative mr-24 hidden w-80 xl:flex">
                        <ActivityFeed isTransparent={showBackgroundImage} animate={toggleAnimation} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default SwapPage;
