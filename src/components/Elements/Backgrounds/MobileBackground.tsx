import clsx from 'clsx';
import Image from 'next/image';

export const MobileBackground = () => {
    return (
        <div className={clsx('fixed top-16 z-10 h-100 w-full overflow-hidden bg-space-500')}>
            <div
                className={clsx('relative flex min-h-[1024px] min-w-[1440px]', 'right-[24rem] sm:right-128 md:right-96 lg:right-40 xl:right-0')}
            ></div>
        </div>
    );
};
