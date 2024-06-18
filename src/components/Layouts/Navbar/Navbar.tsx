'use client';

import { WalletButton } from '@/components/Elements/Buttons/WalletButtons/WalletButton';
import { setIsMobileNavbarShowing, useGetIsMobileNavbarShowing } from '@/hooks/Navbar/navbar.hook';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export const Navbar = ({ transparent = false }) => {
    const { data: isShowing } = useGetIsMobileNavbarShowing();

    const [isShowingDropdown, setIsShowingDropdown] = useState(false);
    const closeDropdown = () => setIsShowingDropdown(false);

    const pathname = usePathname();
    const isSwapPage = pathname === '/swap';
    const isAggregatePage = pathname === '/aggregate';
    const isBotsPage = pathname === '/bots';
    return (
        <div className={clsx('top-0 z-80 flex w-full', isShowing ? 'fixed' : 'absolute')}>
            <div
                className={clsx(
                    'z-10 flex h-20 w-full items-center justify-start px-2 sm:gap-8 sm:px-8',
                    transparent && !isShowing
                        ? 'bg-opacity-100 md:bg-opacity-0'
                        : 'border-b border-blue-900/40 bg-space-950 drop-shadow-black-sharp'
                )}
            >
                <div className="flex w-16">
                    <Link href="/" className="h-full">
                        <div
                            onClick={() => {
                                handleScrollToTop();
                                setIsMobileNavbarShowing(false);
                            }}
                            className="w-16"
                        >
                            <Image src={'/images/SaturnSwapLogo.png'} alt={'Logo'} width={128} height={128} quality={100} />
                        </div>
                    </Link>
                </div>
                <div className="hidden w-full items-center gap-2 text-base font-light lg:flex">
                    <NavbarLink onClick={closeDropdown} page={'/swap'} isPage={isSwapPage} text={'Swap'} />
                    <NavbarLink onClick={closeDropdown} page={'/aggregate'} isPage={isAggregatePage} text={'Aggregate'} />
                    <NavbarLink onClick={closeDropdown} page={'/bots'} isPage={isBotsPage} text={'Bots'} />
                </div>
                <div className="grow"></div>
                <div className="hidden w-60 lg:flex"></div>
                <div className="flex justify-end gap-4">
                    <div>
                        <WalletButton />
                    </div>
                    <div
                        onClick={() => {
                            handleScrollToTop();
                            setIsMobileNavbarShowing(!isShowing);
                        }}
                        className={clsx(
                            'w-12 select-none items-center justify-center rounded-lg border border-sky-600/60 bg-space-700 text-sm',
                            'cursor-pointer transition-all duration-300 hover:border-sky-400/60 hover:bg-space-400 active:bg-space-100',
                            'flex lg:hidden'
                        )}
                    >
                        <Image src="/images/icons/order-book.png" alt="Order Book" width={24} height={24} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export const handleScrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
};

const NavbarLink = ({ onClick, page, isPage, text, external = false }: any) => {
    return (
        <>
            <Link onClick={onClick} href={page} className="h-12" target={external ? '_blank' : ''}>
                <div
                    className={clsx(
                        'flex h-full cursor-pointer select-none flex-col items-center justify-center rounded-xl px-3 text-base font-bold text-zinc-300 transition-all duration-300',
                        { 'hover:bg-sky-700/60': !isPage, 'bg-sky-700/60': isPage }
                    )}
                >
                    <div>{text}</div>
                </div>
            </Link>
        </>
    );
};
