'use client';

import { PageBackground } from '@/components/Elements/Backgrounds/PageBackground';
import { ChainStatus } from '@/components/Elements/ChainStatus';
import { MobileNavbar } from '@/components/Layouts/Navbar/MobileNavbar';
import { Navbar } from '@/components/Layouts/Navbar/Navbar';
import { Swap } from '@/components/PageComponents/Swap/Swap';
import { useGetStatus } from '@/hooks/Models/status.hook';
import clsx from 'clsx';

export default function Home() {
    const { data: status }: any = useGetStatus();
    return (
        <>
            <PageBackground showBackgroundImage={true} toggleAnimation={false} />
            <Navbar transparent={true} />
            <MobileNavbar />
            <ChainStatus chainLoadHour={status?.chain_percentage_hour_ago} chainLoadDay={status?.chain_percentage_day_ago} />
            <div className="mt-32 flex flex-col items-center">
                <div className={clsx('z-20 -mt-4 flex w-full flex-col items-center gap-2 text-5xl font-bold')}>
                    <div className=" hidden h-28 bg-gradient-to-r from-sky-500 to-sky-300 bg-clip-text text-center text-transparent sm:inline-block sm:h-16">
                        The Fastest, Simplest,
                    </div>
                    <div className="hidden h-40 bg-gradient-to-r from-sky-500 to-sky-300 bg-clip-text text-center text-transparent sm:inline-block sm:h-28 md:h-16">
                        Cardano Decentralized Exchange
                    </div>
                </div>
                <div className="flex justify-center">
                    <Swap isTransparent={true} />
                </div>
            </div>
        </>
    );
}
