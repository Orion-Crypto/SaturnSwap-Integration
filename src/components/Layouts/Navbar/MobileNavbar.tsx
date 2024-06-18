'use client';

import { handleScrollToTop } from '@/components/Layouts/Navbar/Navbar';
import { setIsMobileNavbarShowing, useGetIsMobileNavbarShowing } from '@/hooks/Navbar/navbar.hook';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const MobileNavbar = () => {
    const { data: isShowing } = useGetIsMobileNavbarShowing();

    const pathname = usePathname();
    const isSwapPage = pathname === '/swap';
    const isOrderPage = pathname === '/orders';
    const isLiquidityPage = pathname === '/liquidity';
    const isTokensPage = pathname === '/tokens';
    const isCreateTokenPage = pathname === '/create/tokens';

    if (!isShowing) return <></>;
    return (
        <div className="fixed inset-0 z-50 flex h-screen w-full">
            <div className={clsx('flex h-full w-full flex-col items-center justify-start bg-space-950 pt-24')}>
                <MobileNavbarLink page={'/swap'} isPage={isSwapPage} text={'Swap'} isShowing={isShowing} />
                <MobileNavbarLink page={'/liquidity'} isPage={isLiquidityPage} text={'Liquidity'} isShowing={isShowing} />
                <MobileNavbarLink page={'/orders'} isPage={isOrderPage} text={'Orders'} isShowing={isShowing} />
                <MobileNavbarLink page={'/tokens'} isPage={isTokensPage} text={'Tokens'} isShowing={isShowing} />
                <MobileNavbarLink page={'/create/tokens'} isPage={isCreateTokenPage} text={'Create'} isShowing={isShowing} />
            </div>
        </div>
    );
};

const MobileNavbarLink = ({ page, isPage, text, isShowing }: any) => {
    return (
        <>
            <Link href={page} className="flex w-full">
                <div
                    onClick={() => {
                        handleScrollToTop();
                        setIsMobileNavbarShowing(!isShowing);
                    }}
                    className={clsx(
                        'flex h-18 w-full cursor-pointer select-none flex-col items-center justify-center gap-2 text-xl font-bold transition-all duration-100 ',
                        'hover:bg-sky-900 active:bg-sky-800'
                    )}
                >
                    <div className={clsx('text-center', isPage ? 'text-yellow-300' : 'text-white')}>{text}</div>
                </div>
            </Link>
        </>
    );
};
