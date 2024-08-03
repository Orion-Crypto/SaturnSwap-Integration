import PieChart from '@/components/Elements/Widgets/PieChart';
import { ProfileStats } from '@/components/PageComponents/Order/ProfileContainer/ProfileStats';
import clsx from 'clsx';

export const OrderProfileContainer = ({ toggleAnimation, showBackgroundImage }: any) => {
    return (
        <>
            <div className="flex w-full justify-center px-6 xl:px-24">
                <div
                    className={clsx(
                        'z-20 flex h-full w-full max-w-360 flex-col items-center justify-around rounded-lg border-2 border-sky-600/60 bg-space-950 shadow-full-sky-xl-900 lg:h-100 lg:w-full lg:flex-row',
                        toggleAnimation
                            ? showBackgroundImage
                                ? 'opacity-100 xl:animate-lighter-fade-out xl:opacity-90'
                                : 'animate-lighter-fade-in opacity-100'
                            : showBackgroundImage
                              ? 'opacity-100 xl:opacity-90'
                              : 'opacity-100'
                    )}
                >
                    <div className="h-80 w-full lg:h-full lg:w-1/2 lg:border-r-2 lg:border-sky-600/60">
                        <PieChart />
                    </div>
                    <div className="max-h-100 w-full lg:w-1/2 ">
                        <ProfileStats />
                    </div>
                </div>
            </div>
        </>
    );
};
