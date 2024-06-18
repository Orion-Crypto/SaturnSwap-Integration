import { setShowActivityFeed } from '@/hooks/Component/activity-feed.hook';
import { setShowBackgroundImage } from '@/hooks/Component/background-image.hook';
import { setShowTrendingFeed } from '@/hooks/Component/trending-feed.hook';
import clsx from 'clsx';
import Image from 'next/image';

export const SubNavbar = ({
    hasShowBackgroundButton,
    hasActivityFeedButton,
    hasTrendingFeedButton,
    showBackgroundImage,
    showActivityFeed,
    showTrendingFeed,
    setToggleAnimation,
}: any) => {
    return (
        <>
            <div className="z-20 mt-20 flex w-full justify-end">
                <div className="flex h-16 items-center justify-center gap-4 pr-4">
                    {/* {hasTrendingFeedButton && (
                        <div
                            onClick={() => setShowTrendingFeed(!showTrendingFeed)}
                            className={clsx(
                                'hidden h-10 w-12 select-none items-center justify-center rounded-lg border border-sky-600/60 text-sm xl:flex',
                                'cursor-pointer transition-all duration-300 hover:border-sky-400/60',
                                showTrendingFeed ? 'bg-space-300' : 'bg-space-900'
                            )}
                        >
                            <Image src="/images/icons/trending-icon.png" alt="Trending" width={18} height={18} />
                        </div>
                    )} */}
                    {hasShowBackgroundButton && (
                        <div
                            onClick={() => {
                                setShowBackgroundImage(!showBackgroundImage);
                                setToggleAnimation(true);
                            }}
                            className={clsx(
                                'flex h-10 w-12 select-none items-center justify-center rounded-lg border border-sky-600/60 text-sm',
                                'cursor-pointer transition-all duration-300 hover:border-sky-400/60',
                                showBackgroundImage ? 'bg-space-300' : 'bg-space-900'
                            )}
                        >
                            <Image src="/images/icons/Image.png" alt="Background Image" width={24} height={24} />
                        </div>
                    )}
                    {hasActivityFeedButton && (
                        <div
                            onClick={() => setShowActivityFeed(!showActivityFeed)}
                            className={clsx(
                                'hidden h-10 w-12 select-none items-center justify-center rounded-lg border border-sky-600/60 text-sm xl:flex',
                                'cursor-pointer transition-all duration-300 hover:border-sky-400/60',
                                showActivityFeed ? 'bg-space-300' : 'bg-space-900'
                            )}
                        >
                            <Image src="/images/icons/activity-feed-icon.png" alt="Activity Feed" width={24} height={24} />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
